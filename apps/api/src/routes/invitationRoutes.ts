// apps/api/src/routes/invitationRoutes.ts
import { Router } from "express";
import { auth } from "../middlewares/auth";
import { tenantIsolation } from "../middlewares/tenantIsolation";
import * as invitationController from "../controllers/invitationController";

const router = Router();

router.use(auth, tenantIsolation);

router.post("/", invitationController.createInvitation);
router.get("/", invitationController.listInvitations);
router.get("/accept", invitationController.acceptInvitation);
router.post("/:invitationId/revoke", invitationController.revokeInvitation);
router.post("/:invitationId/resend", invitationController.resendInvitation);

export default router;
