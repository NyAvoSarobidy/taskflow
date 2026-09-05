// apps/api/src/models/Subscription.ts
import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { SubscriptionPlan, SubscriptionStatus } from "../types";

export interface ISubscription extends Document {
  organizationId: Types.ObjectId;
  plan: SubscriptionPlan;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  status: SubscriptionStatus;
}

const subscriptionSchema = new Schema<ISubscription>({
  organizationId: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
    unique: true,
  },
  plan: {
    type: String,
    enum: [SubscriptionPlan.FREE, SubscriptionPlan.PRO],
    default: SubscriptionPlan.FREE,
  },
  stripeCustomerId: {
    type: String,
    required: false,
  },
  stripeSubscriptionId: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: [
      SubscriptionStatus.ACTIVE,
      SubscriptionStatus.TRIALING,
      SubscriptionStatus.PAST_DUE,
      SubscriptionStatus.CANCELED,
    ],
    default: SubscriptionStatus.ACTIVE,
  },
});

export const Subscription: Model<ISubscription> =
  mongoose.models.Subscription ||
  mongoose.model<ISubscription>("Subscription", subscriptionSchema);
export default Subscription;
