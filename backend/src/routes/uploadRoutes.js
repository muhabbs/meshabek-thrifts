import express from "express";
import multer from "multer";
import { uploadImages } from "../controllers/uploadController.js";
import { adminOnly, protect } from "../middleware/auth.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.post("/images", protect, adminOnly, upload.array("images", 6), uploadImages);

export default router;
