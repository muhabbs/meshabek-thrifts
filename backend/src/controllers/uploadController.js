import { cloudinary, setupCloudinary } from "../config/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const uploadProductImages = asyncHandler(async (req, res) => {
  if (!setupCloudinary()) {
    throw new ApiError("Cloudinary is not configured.", 500);
  }

  if (!req.files?.length) {
    throw new ApiError("Upload at least one image.", 400);
  }

  const uploads = await Promise.all(
    req.files.map((file) =>
      cloudinary.uploader.upload(`data:${file.mimetype};base64,${file.buffer.toString("base64")}`, {
        folder: "meshabek-store/products",
        resource_type: "image"
      })
    )
  );

  res.status(201).json(uploads.map((upload) => upload.secure_url));
});
