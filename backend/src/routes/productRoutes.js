import express from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  listFeaturedProducts,
  listProducts,
  updateProduct
} from "../controllers/productController.js";
import { adminOnly, protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", listProducts);
router.get("/featured", listFeaturedProducts);
router.get("/:id", getProduct);
router.post("/", protect, adminOnly, createProduct);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
