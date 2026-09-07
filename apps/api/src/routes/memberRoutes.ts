// apps/api/src/routes/memberRoutes.ts
import { Router } from "express";
import { auth } from "../middlewares/auth";
import { tenantIsolation } from "../middlewares/tenantIsolation";
import Membership from "../models/Membership";
import User from "../models/User";

const router = Router();

router.use(auth, tenantIsolation);

// Lister les membres de l'organisation
router.get("/", async (req, res) => {
  try {
    const organizationId = (req.query.organizationId as string) || req.tenant?.organizationId;

    if (!organizationId) {
      return res.status(400).json({ message: "organizationId requis" });
    }

    const memberships = await Membership.find({ organizationId })
      .populate("userId", "email name createdAt")
      .sort({ createdAt: 1 });

    const members = memberships.map((m) => ({
      _id: m.userId._id,
      email: m.userId.email,
      name: m.userId.name,
      role: m.role,
      createdAt: m.createdAt,
    }));

    res.status(200).json({ members });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
