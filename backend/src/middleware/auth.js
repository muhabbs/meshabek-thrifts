import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ApiError, asyncHandler } from "../utils/errors.js";

export const protect = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.split(" ")[1] : null;

  if (!token) throw new ApiError("Authentication token is required.", 401);

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);

  if (!user) throw new ApiError("User no longer exists.", 401);

  req.user = user;
  next();
});

export const adminOnly = (req, _res, next) => {
  if (req.user?.role !== "admin") {
    return next(new ApiError("Admin access only.", 403));
  }
  next();
};
