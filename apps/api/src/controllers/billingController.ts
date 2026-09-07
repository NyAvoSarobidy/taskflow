// apps/api/src/controllers/billingController.ts
import { Request, Response, NextFunction } from "express";
import * as stripeService from "../services/stripeService";
import { SubscriptionPlan } from "../types";

export async function createCheckout(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { plan } = req.body;
    const organizationId = (req.query.organizationId as string) || req.tenant?.organizationId;

    if (!organizationId) {
      return res.status(400).json({ message: "organizationId manquant" });
    }

    if (!plan || !Object.values(SubscriptionPlan).includes(plan)) {
      return res.status(400).json({ message: "Plan invalide" });
    }

    const session = await stripeService.createCheckoutSession(organizationId, plan);
    res.status(200).json(session);
  } catch (error) {
    next(error);
  }
}

export async function createPortal(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const organizationId = (req.query.organizationId as string) || req.tenant?.organizationId;

    if (!organizationId) {
      return res.status(400).json({ message: "organizationId manquant" });
    }

    const session = await stripeService.createPortalSession(organizationId);
    res.status(200).json(session);
  } catch (error) {
    next(error);
  }
}

export async function handleWebhook(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const signature = req.headers["stripe-signature"] as string;

    if (!signature) {
      return res.status(400).json({ message: "Signature manquante" });
    }

    await stripeService.handleWebhookEvent(req.body, signature);
    res.status(200).json({ received: true });
  } catch (error) {
    next(error);
  }
}
