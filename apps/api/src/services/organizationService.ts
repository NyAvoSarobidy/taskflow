
import mongoose from "mongoose";
import Organization from "../models/Organization";
import Membership from "../models/Membership";

export async function listUserOrganizations(userId: string) {
  const memberships = await Membership.find({ userId }).populate(
    "organizationId",
    "name createdAt"
  );

  return memberships.map((m) => {
    const org = m.organizationId as unknown as { _id: mongoose.Types.ObjectId; name: string; createdAt: Date };
    return {
      organizationId: org._id,
      name: org.name,
      role: m.role,
      createdAt: org.createdAt,
    };
  });
}

export async function getOrganization(organizationId: string, userId: string) {
  const membership = await Membership.findOne({
    userId,
    organizationId,
  });

  if (!membership) return null;

  return Organization.findById(organizationId);
}
