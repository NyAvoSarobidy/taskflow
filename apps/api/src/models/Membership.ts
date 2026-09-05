// apps/api/src/models/Membership.ts
import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { UserRole } from "../types";

export interface IMembership extends Document {
  userId: Types.ObjectId;
  organizationId: Types.ObjectId;
  role: UserRole;
  createdAt: Date;
}

const membershipSchema = new Schema<IMembership>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  organizationId: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
    index: true,
  },
  role: {
    type: String,
    required: true,
    enum: [UserRole.ADMIN, UserRole.MEMBRE],
    default: UserRole.MEMBRE,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index composé unique pour empêcher les doublons d'appartenance
membershipSchema.index({ userId: 1, organizationId: 1 }, { unique: true });

export const Membership: Model<IMembership> =
  mongoose.models.Membership ||
  mongoose.model<IMembership>("Membership", membershipSchema);
export default Membership;
