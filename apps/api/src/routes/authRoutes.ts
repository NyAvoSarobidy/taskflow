import { Router } from "express";
import {
  register,
  login,
  refresh,
  logout,
  me,
  verifyOTP,
  resendOTP,
} from "../controllers/authController";
import { auth } from "../middlewares/auth";

const router = Router();

// Routes publiques
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);

// Routes protégées
router.post("/logout", auth, logout);
router.get("/me", auth, me);

export default router;
