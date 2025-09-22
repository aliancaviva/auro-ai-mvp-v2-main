import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

// Mapping de price IDs para planos (produção)
const PRICE_TO_PLAN: { [key: string]: string } = {
  "price_1S9d5HRGP4n024Fuvq3WeHCv": "micro",
  "price_1S9d5HRGP4n024FunrJaW2Mr": "meso", 
  "price_1S9d5HRGP4n024FurSVi6ys7": "macro",
  "price_1S9eiNRGP4n024FuzUZw50LJ": "teste" // ID de teste encontrado nos logs
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    logStep("Authenticating user with token");
    
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      logStep("No customer found, updating unsubscribed state");
      
      // Atualizar profile para plano teste se não tiver assinatura ativa
      await supabaseClient
        .from('profiles')
        .update({ 
          current_plan: 'teste',
          plan_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 dias
        })
        .eq('id', user.id);
      
      return new Response(JSON.stringify({ 
        subscribed: false, 
        current_plan: 'teste' 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });
    const hasActiveSub = subscriptions.data.length > 0;
    let currentPlan = 'teste';
    let subscriptionEnd = null;

    if (hasActiveSub) {
      const subscription = subscriptions.data[0];
      logStep("Raw subscription data", { 
        subscriptionId: subscription.id, 
        current_period_end: subscription.current_period_end,
        typeof_end: typeof subscription.current_period_end
      });
      
      // Validate and parse the timestamp
      let subscriptionEndTimestamp = subscription.current_period_end;
      if (typeof subscriptionEndTimestamp !== 'number' || subscriptionEndTimestamp <= 0) {
        logStep("Invalid timestamp, using fallback", { current_period_end: subscriptionEndTimestamp });
        // Fallback to 1 month from now
        subscriptionEndTimestamp = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60);
      }
      
      subscriptionEnd = new Date(subscriptionEndTimestamp * 1000).toISOString();
      logStep("Active subscription found", { 
        subscriptionId: subscription.id, 
        endDate: subscriptionEnd, 
        rawTimestamp: subscriptionEndTimestamp 
      });
      
      // Determinar plano baseado no price_id
      const priceId = subscription.items.data[0].price.id;
      currentPlan = PRICE_TO_PLAN[priceId] || 'teste';
      logStep("Determined subscription plan", { priceId, currentPlan });
      
      // Atualizar profile no Supabase
      await supabaseClient
        .from('profiles')
        .update({ 
          current_plan: currentPlan,
          plan_expires_at: subscriptionEnd
        })
        .eq('id', user.id);
        
      logStep("Profile updated in Supabase", { plan: currentPlan });
    } else {
      logStep("No active subscription found");
      
      // Atualizar para plano teste
      await supabaseClient
        .from('profiles')
        .update({ 
          current_plan: 'teste',
          plan_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        })
        .eq('id', user.id);
    }

    return new Response(JSON.stringify({
      subscribed: hasActiveSub,
      current_plan: currentPlan,
      subscription_end: subscriptionEnd
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-subscription", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});