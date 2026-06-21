import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { products } from "./products.js";

dotenv.config();

const seed = async () => {
  await connectDB();

  await Promise.all([User.deleteMany(), Product.deleteMany(), Order.deleteMany()]);

  await User.create({
    name: process.env.ADMIN_NAME || "Meshabek Admin",
    email: process.env.ADMIN_EMAIL || "admin@meshabek.store",
    password: process.env.ADMIN_PASSWORD || "admin12345",
    role: "admin"
  });

  const preparedProducts = products.map((product) => {
    const stock = product.sizes.reduce((sum, size) => sum + Number(size.stock || 0), 0);
    return { ...product, stock, soldOut: stock <= 0 };
  });

  const createdProducts = await Product.insertMany(preparedProducts);

  await Order.create([
    {
      customer: {
        name: "Mariam Hassan",
        phone: "01012345678",
        address: "Nasr City, Cairo",
        notes: "Call before delivery"
      },
      products: [
        {
          product: createdProducts[0]._id,
          name: createdProducts[0].name,
          image: createdProducts[0].images[0],
          price: createdProducts[0].price,
          size: "L",
          quantity: 1
        }
      ],
      totalPrice: createdProducts[0].price,
      status: "Delivered"
    },
    {
      customer: {
        name: "Omar Adel",
        phone: "01199887766",
        address: "Smouha, Alexandria",
        notes: ""
      },
      products: [
        {
          product: createdProducts[2]._id,
          name: createdProducts[2].name,
          image: createdProducts[2].images[0],
          price: createdProducts[2].price,
          size: "32",
          quantity: 1
        },
        {
          product: createdProducts[20]._id,
          name: createdProducts[20].name,
          image: createdProducts[20].images[0],
          price: createdProducts[20].price,
          size: "One Size",
          quantity: 1
        }
      ],
      totalPrice: createdProducts[2].price + createdProducts[20].price,
      status: "Confirmed"
    }
  ]);

  console.log("Seed complete. Admin:", process.env.ADMIN_EMAIL || "admin@meshabek.store");
  await mongoose.disconnect();
};

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
