// apps/api/src/routes/projectRoutes.ts
import { Router } from "express";
import { auth } from "../middlewares/auth";
import { tenantIsolation } from "../middlewares/tenantIsolation";
import * as projectController from "../controllers/projectController";

const router = Router();

router.use(auth, tenantIsolation);

router.post("/", projectController.createProject);
router.get("/", projectController.listProjects);
router.get("/:projectId", projectController.getProject);
router.put("/:projectId", projectController.updateProject);
router.delete("/:projectId", projectController.deleteProject);

export default router;
