// apps/api/src/services/stripeService.ts
import Stripe from "stripe";
import Subscription from "../models/Subscription";
import { SubscriptionPlan, SubscriptionStatus } from "../types";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-11-20.acacia",
});

const STRIPE_PRICE_ID_FREE = process.env.STRIPE_PRICE_ID_FREE;
const STRIPE_PRICE_ID_PRO = process.env.STRIPE_PRICE_ID_PRO;

export async function createCheckoutSession(
  organizationId: string,
  plan: SubscriptionPlan
) {
  const subscription = await Subscription.findOne({ organizationId });
  if (!subscription) {
    throw new Error("Abonnement non trouvé");
  }

  const priceId = plan === SubscriptionPlan.PRO ? STRIPE_PRICE_ID_PRO : STRIPE_PRICE_ID_FREE;

  if (!priceId) {
    throw new Error("Price ID non configuré");
  }

  let customerId = subscription.stripeCustomerId;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: subscription.organizationId.toString(),
      metadata: { organizationId: organizationId.toString() },
    });
    customerId = customer.id;
    subscription.stripeCustomerId = customerId;
    await subscription.save();
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.CLIENT_URL}/billing?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/billing`,
    metadata: { organizationId: organizationId.toString(), plan },
  });

  return { sessionId: session.id, url: session.url };
}

export async function createPortalSession(organizationId: string) {
  const subscription = await Subscription.findOne({ organizationId });
  if (!subscription || !subscription.stripeCustomerId) {
    throw new Error("Aucun abonnement Stripe trouvé");
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${process.env.CLIENT_URL}/billing`,
  });

  return { url: session.url };
}

export async function handleWebhookEvent(
  payload: string | Buffer,
  signature: string
) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const verifyWebhook = process.env.STRIPE_VERIFY_WEBHOOK === "true";

  // Si la vérification est désactivée (dev sans CLI), on parse directement
  if (!verifyWebhook || !webhookSecret) {
    const event = JSON.parse(payload.toString());
    console.log(`[Webhook] Event reçu: ${event.type} (vérif désactivée)`);
    // TODO: Traiter l'événement sans vérification
    return event;
  }

  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    webhookSecret
  );

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const { organizationId, plan } = session.metadata as {
        organizationId: string;
        plan: SubscriptionPlan;
      };

      await Subscription.findOneAndUpdate(
        { organizationId },
        {
          plan,
          stripeSubscriptionId: session.subscription as string,
          status: SubscriptionStatus.ACTIVE,
        }
      );
      break;
    }

    case "customer.subscription.updated": {
      const subscriptionData = event.data.object as Stripe.Subscription;
      const organizationId = subscriptionData.metadata.organizationId;

      await Subscription.findOneAndUpdate(
        { organizationId },
        {
          status: subscriptionData.status === "active"
            ? SubscriptionStatus.ACTIVE
            : SubscriptionStatus.CANCELED,
        }
      );
      break;
    }

    case "customer.subscription.deleted": {
      const subscriptionData = event.data.object as Stripe.Subscription;
      const organizationId = subscriptionData.metadata.organizationId;

      await Subscription.findOneAndUpdate(
        { organizationId },
        {
          plan: SubscriptionPlan.FREE,
          status: SubscriptionStatus.CANCELED,
          stripeSubscriptionId: undefined,
        }
      );
      break;
    }
  }

  return event;
}
