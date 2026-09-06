
import { Router } from "express";
import { auth } from "../middlewares/auth";
import * as organizationController from "../controllers/organizationController";

const router = Router();

router.use(auth);

router.get("/", organizationController.listOrganizations);
router.get("/:organizationId", organizationController.getOrganization);

export default router;
