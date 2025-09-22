import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
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
    logStep("Webhook started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");
    
    if (!signature) {
      throw new Error("No Stripe signature found");
    }

    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!webhookSecret) {
      throw new Error("STRIPE_WEBHOOK_SECRET is not set");
    }

    // Verify the webhook signature
    let event: Stripe.Event;
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
      logStep("Webhook signature verified", { eventType: event.type });
    } catch (err) {
      logStep("Webhook signature verification failed", { error: err.message });
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
      case 'invoice.payment_succeeded':
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        
        if (event.type === 'checkout.session.completed') {
          const session = event.data.object as Stripe.CheckoutSession;
          if (session.mode !== 'subscription' || !session.subscription) {
            logStep("Skipping non-subscription checkout session");
            return new Response("OK", { status: 200 });
          }
          // Get the actual subscription
          const sub = await stripe.subscriptions.retrieve(session.subscription as string);
          await updateUserSubscription(sub, supabaseClient);
        } else {
          await updateUserSubscription(subscription, supabaseClient);
        }
        break;
      }
      
      case 'customer.subscription.deleted':
      case 'invoice.payment_failed': {
        const subscription = event.data.object as Stripe.Subscription;
        await updateUserSubscription(subscription, supabaseClient, true);
        break;
      }
      
      default:
        logStep("Unhandled event type", { eventType: event.type });
    }

    return new Response("OK", { 
      status: 200,
      headers: corsHeaders 
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in webhook", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

async function updateUserSubscription(
  subscription: Stripe.Subscription, 
  supabaseClient: any, 
  isDeleted: boolean = false
) {
  try {
    logStep("Processing subscription update", { 
      subscriptionId: subscription.id, 
      customerId: subscription.customer,
      status: subscription.status,
      isDeleted 
    });

    // Get customer email from Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { 
      apiVersion: "2025-08-27.basil" 
    });
    
    const customer = await stripe.customers.retrieve(subscription.customer as string);
    if (!customer || customer.deleted || !('email' in customer) || !customer.email) {
      throw new Error("Customer not found or no email");
    }

    logStep("Customer retrieved", { email: customer.email });

    // Find user by email in Supabase auth
    const { data: authData, error: authError } = await supabaseClient.auth.admin.listUsers();
    if (authError) {
      logStep("Error fetching users", { error: authError });
      return;
    }
    
    const user = authData.users.find(u => u.email === customer.email);
    if (!user) {
      logStep("User not found in auth", { email: customer.email });
      return;
    }
    
    // Check if profile exists
    const { data: profiles, error: profileError } = await supabaseClient
      .from('profiles')
      .select('id')
      .eq('id', user.id);

    if (profileError) {
      logStep("Error fetching profile", { email: customer.email, error: profileError });
      return;
    }
    
    if (!profiles || profiles.length === 0) {
      logStep("Profile not found, creating new profile", { email: customer.email, userId: user.id });
      // Create profile if it doesn't exist
      const { error: createError } = await supabaseClient
        .from('profiles')
        .insert({
          id: user.id,
          full_name: user.user_metadata?.full_name || customer.name || null
        });
      
      if (createError) {
        logStep("Error creating profile", { error: createError });
        return;
      }
    }

    const userId = user.id;
    logStep("User found", { userId });

    let currentPlan = 'teste';
    let subscriptionEnd = null;

    if (!isDeleted && subscription.status === 'active') {
      // Determine plan based on price_id
      const priceId = subscription.items.data[0].price.id;
      currentPlan = PRICE_TO_PLAN[priceId] || 'teste';
      
      // Validate and parse the timestamp
      let subscriptionEndTimestamp = subscription.current_period_end;
      if (typeof subscriptionEndTimestamp !== 'number' || subscriptionEndTimestamp <= 0) {
        logStep("Invalid timestamp in webhook, using fallback", { current_period_end: subscriptionEndTimestamp });
        // Fallback to 1 month from now
        subscriptionEndTimestamp = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60);
      }
      
      subscriptionEnd = new Date(subscriptionEndTimestamp * 1000).toISOString();
      
      logStep("Active subscription processed", { 
        priceId, 
        currentPlan, 
        subscriptionEnd,
        rawTimestamp: subscriptionEndTimestamp
      });
    } else {
      // Set to test plan if subscription is deleted or inactive
      subscriptionEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      logStep("Subscription deleted or inactive, setting to test plan");
    }

    // Update user profile
    const { error: updateError } = await supabaseClient
      .from('profiles')
      .update({
        current_plan: currentPlan,
        plan_expires_at: subscriptionEnd
      })
      .eq('id', userId);

    if (updateError) {
      throw updateError;
    }

    logStep("Profile updated successfully", { 
      userId, 
      currentPlan, 
      subscriptionEnd 
    });

  } catch (error) {
    logStep("Error updating subscription", { 
      error: error.message,
      subscriptionId: subscription.id 
    });
    throw error;
  }
}