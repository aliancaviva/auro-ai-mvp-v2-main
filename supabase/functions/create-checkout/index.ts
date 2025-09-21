import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    logStep("Function started");
    
    // Verificar se a chave do Stripe está configurada
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      logStep("ERROR: Stripe secret key not found");
      throw new Error("Stripe secret key not configured");
    }
    if (!stripeKey.startsWith("sk_")) {
      logStep("ERROR: Invalid Stripe secret key format", { keyPrefix: stripeKey.substring(0, 3) });
      throw new Error("Invalid Stripe secret key format");
    }
    logStep("Stripe key verified", { keyPrefix: stripeKey.substring(0, 7) });

    const { priceId } = await req.json();
    if (!priceId) {
      logStep("ERROR: No price ID provided");
      throw new Error("Price ID is required");
    }

    // Validar formato do price ID
    if (!priceId.startsWith("price_")) {
      logStep("ERROR: Invalid price ID format", { priceId });
      throw new Error("Invalid price ID format");
    }
    logStep("Received price ID", { priceId });

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      logStep("ERROR: No authorization header");
      throw new Error("No authorization header provided");
    }
    
    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      logStep("ERROR: Invalid token format");
      throw new Error("Invalid authorization token");
    }
    
    const { data, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) {
      logStep("ERROR: User authentication failed", { error: userError.message });
      throw new Error(`Authentication failed: ${userError.message}`);
    }
    
    const user = data.user;
    if (!user?.email) {
      logStep("ERROR: User not authenticated or no email");
      throw new Error("User not authenticated or email not available");
    }
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { 
      apiVersion: "2025-08-27.basil" 
    });

    // Testar conectividade com Stripe validando o price ID
    try {
      logStep("Validating price ID with Stripe API");
      const priceValidation = await stripe.prices.retrieve(priceId);
      logStep("Price ID validated", { 
        priceId, 
        active: priceValidation.active,
        currency: priceValidation.currency,
        unitAmount: priceValidation.unit_amount 
      });
      
      if (!priceValidation.active) {
        logStep("ERROR: Price is not active", { priceId });
        throw new Error(`Price ${priceId} is not active in Stripe`);
      }
    } catch (stripeError: any) {
      logStep("ERROR: Stripe price validation failed", { 
        error: stripeError.message, 
        code: stripeError.code,
        type: stripeError.type 
      });
      throw new Error(`Stripe validation failed: ${stripeError.message}`);
    }

    // Check if customer exists
    logStep("Checking for existing Stripe customer");
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing customer found", { customerId, email: user.email });
    } else {
      logStep("No existing customer found, will create during checkout", { email: user.email });
    }

    // Use production domain for Stripe URLs
    const productionDomain = "https://auroai.site";
    logStep("Using production domain for checkout URLs", { productionDomain });
    
    logStep("Creating Stripe checkout session", { 
      customerId, 
      customerEmail: customerId ? undefined : user.email,
      priceId,
      userId: user.id 
    });

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${productionDomain}/planos?payment=success`,
      cancel_url: `${productionDomain}/planos?payment=canceled`,
      metadata: {
        user_id: user.id,
        price_id: priceId
      }
    });

    logStep("Checkout session created successfully", { 
      sessionId: session.id, 
      url: session.url,
      customerId: session.customer,
      mode: session.mode 
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorDetails = {
      message: errorMessage,
      code: error.code || 'UNKNOWN',
      type: error.type || 'UNKNOWN',
      stack: error.stack ? error.stack.split('\n').slice(0, 3).join('\n') : 'No stack trace'
    };
    
    logStep("ERROR in create-checkout", errorDetails);

    // Determinar o status code baseado no tipo de erro
    let statusCode = 500;
    if (errorMessage.includes('Authentication') || errorMessage.includes('authorization')) {
      statusCode = 401;
    } else if (errorMessage.includes('Price') || errorMessage.includes('Invalid')) {
      statusCode = 400;
    } else if (error.type === 'StripeInvalidRequestError') {
      statusCode = 400;
    } else if (error.type === 'StripeAuthenticationError') {
      statusCode = 401;
    }

    return new Response(JSON.stringify({ 
      error: errorMessage,
      code: error.code,
      type: error.type 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: statusCode,
    });
  }
});