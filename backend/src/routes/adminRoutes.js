import express from "express";
import { getDashboardStats } from "../controllers/adminController.js";
import { adminOnly, protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/stats", protect, adminOnly, getDashboardStats);

export default router;
