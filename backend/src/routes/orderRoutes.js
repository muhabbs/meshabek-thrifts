import express from "express";
import { createOrder, getOrder, getOrders, updateOrderStatus } from "../controllers/orderController.js";
import { adminOnly, protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/", protect, adminOnly, getOrders);
router.get("/:id", protect, adminOnly, getOrder);
router.patch("/:id/status", protect, adminOnly, updateOrderStatus);

export default router;
