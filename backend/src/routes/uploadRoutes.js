import express from "express";
import multer from "multer";
import { uploadProductImages } from "../controllers/uploadController.js";
import { adminOnly, protect } from "../middleware/auth.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.post("/products", protect, adminOnly, upload.array("images", 6), uploadProductImages);

export default router;
