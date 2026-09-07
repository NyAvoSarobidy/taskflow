// apps/api/src/routes/billingRoutes.ts
import { Router } from "express";
import { auth } from "../middlewares/auth";
import { tenantIsolation } from "../middlewares/tenantIsolation";
import * as billingController from "../controllers/billingController";

const router = Router();

router.use(auth, tenantIsolation);

router.post("/checkout", billingController.createCheckout);
router.post("/portal", billingController.createPortal);

export default router;
