// apps/api/src/models/Invitation.ts
import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { UserRole } from "../types";

export interface IInvitation extends Document {
  organizationId: Types.ObjectId;
  email: string;
  role: UserRole;
  invitedBy: Types.ObjectId;
  token: string;
  status: "pending" | "accepted" | "expired";
  expiresAt: Date;
  createdAt: Date;
}

const invitationSchema = new Schema<IInvitation>({
  organizationId: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  role: {
    type: String,
    required: true,
    enum: [UserRole.ADMIN, UserRole.MEMBRE],
    default: UserRole.MEMBRE,
  },
  invitedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "expired"],
    default: "pending",
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index pour expirer automatiquement les invitations
invitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Invitation: Model<IInvitation> =
  mongoose.models.Invitation ||
  mongoose.model<IInvitation>("Invitation", invitationSchema);
export default Invitation;
