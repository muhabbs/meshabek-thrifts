import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const createAdmin = async () => {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required in backend/.env.");
  }

  if (ADMIN_PASSWORD.length < 8) {
    throw new Error("ADMIN_PASSWORD must be at least 8 characters.");
  }

  await connectDB();

  const existing = await User.findOne({ email: ADMIN_EMAIL }).select("+password");

  if (existing) {
    existing.name = ADMIN_NAME || existing.name;
    existing.password = ADMIN_PASSWORD;
    existing.role = "admin";
    await existing.save();
    console.log(`Admin updated: ${ADMIN_EMAIL}`);
    return;
  }

  await User.create({
    name: ADMIN_NAME || "Meshabek Admin",
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    role: "admin"
  });

  console.log(`Admin created: ${ADMIN_EMAIL}`);
};

createAdmin()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
