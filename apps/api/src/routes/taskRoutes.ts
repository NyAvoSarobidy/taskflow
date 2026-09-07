
import { Router } from "express";
import { auth } from "../middlewares/auth";
import { tenantIsolation } from "../middlewares/tenantIsolation";
import * as taskController from "../controllers/taskController";

const router = Router();

router.use(auth, tenantIsolation);

router.get("/my-tasks", taskController.listMyTasks);
router.post("/projects/:projectId/tasks", taskController.createTask);
router.get("/projects/:projectId/tasks", taskController.listTasks);
router.get("/projects/:projectId/tasks/:taskId", taskController.getTask);
router.put("/projects/:projectId/tasks/:taskId", taskController.updateTask);
router.delete("/projects/:projectId/tasks/:taskId", taskController.deleteTask);

export default router;
