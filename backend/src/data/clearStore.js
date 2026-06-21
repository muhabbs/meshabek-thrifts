import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

dotenv.config();

const clearStore = async () => {
  if (process.env.CONFIRM_CLEAR_STORE !== "true") {
    throw new Error("Set CONFIRM_CLEAR_STORE=true to delete all products and orders.");
  }

  await connectDB();
  const [products, orders] = await Promise.all([Product.deleteMany(), Order.deleteMany()]);

  console.log(`Deleted ${products.deletedCount} products and ${orders.deletedCount} orders.`);
};

clearStore()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
