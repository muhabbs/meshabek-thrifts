import { cloudinary, configureCloudinary } from "../config/cloudinary.js";
import { ApiError, asyncHandler } from "../utils/errors.js";

export const uploadImages = asyncHandler(async (req, res) => {
  if (!configureCloudinary()) {
    throw new ApiError("Cloudinary environment variables are not configured.", 500);
  }

  if (!req.files?.length) {
    throw new ApiError("No images uploaded.", 400);
  }

  const uploads = await Promise.all(
    req.files.map((file) =>
      cloudinary.uploader.upload(`data:${file.mimetype};base64,${file.buffer.toString("base64")}`, {
        folder: "meshabek-store"
      })
    )
  );

  res.status(201).json(uploads.map((upload) => upload.secure_url));
});
