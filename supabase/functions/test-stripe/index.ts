import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[TEST-STRIPE] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Starting Stripe connectivity test");

    // 1. Verificar se a chave existe
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      logStep("ERROR: Stripe secret key not found");
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Stripe secret key not configured",
        step: "key_missing"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // 2. Verificar formato da chave
    if (!stripeKey.startsWith("sk_")) {
      logStep("ERROR: Invalid key format", { keyPrefix: stripeKey.substring(0, 3) });
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Invalid Stripe secret key format",
        step: "key_format"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    logStep("Stripe key format is valid", { keyPrefix: stripeKey.substring(0, 10) });

    // 3. Testar conectividade com API
    const stripe = new Stripe(stripeKey, { 
      apiVersion: "2025-08-27.basil" 
    });

    logStep("Testing Stripe API connectivity");
    
    // Testar listagem de preços (operação segura)
    const prices = await stripe.prices.list({ limit: 1 });
    logStep("Stripe API connection successful", { pricesCount: prices.data.length });

    // 4. Testar os price IDs específicos
    const testPriceIds = [
      "price_1S9d5HRGP4n024Fuvq3WeHCv", // micro
      "price_1S9d5HRGP4n024FunrJaW2Mr", // meso
      "price_1S9d5HRGP4n024FurSVi6ys7"  // macro
    ];

    const priceResults = [];
    
    for (const priceId of testPriceIds) {
      try {
        logStep(`Testing price ID: ${priceId}`);
        const price = await stripe.prices.retrieve(priceId);
        priceResults.push({
          priceId,
          valid: true,
          active: price.active,
          currency: price.currency,
          unitAmount: price.unit_amount,
          product: price.product
        });
        logStep(`Price ID ${priceId} is valid`, { active: price.active });
      } catch (priceError: any) {
        logStep(`Price ID ${priceId} failed`, { error: priceError.message });
        priceResults.push({
          priceId,
          valid: false,
          error: priceError.message,
          code: priceError.code
        });
      }
    }

    return new Response(JSON.stringify({
      success: true,
      apiConnected: true,
      keyFormat: "valid",
      priceTests: priceResults,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error: any) {
    logStep("ERROR in test-stripe", { 
      message: error.message, 
      type: error.type,
      code: error.code 
    });
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      type: error.type,
      code: error.code,
      step: "stripe_api_test"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});