import express from "express";
import { getCurrentAdmin, loginAdmin } from "../controllers/authController.js";
import { adminOnly, protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/me", protect, adminOnly, getCurrentAdmin);

export default router;
