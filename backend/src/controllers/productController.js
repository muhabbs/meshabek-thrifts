import Product from "../models/Product.js";
import { ApiError, asyncHandler } from "../utils/errors.js";

const buildProductFilters = (query) => {
  const filters = {};

  if (query.category) filters.category = query.category;
  if (query.size) filters["sizes.label"] = query.size;
  if (query.search) filters.$text = { $search: query.search };
  if (query.minPrice || query.maxPrice) {
    filters.price = {};
    if (query.minPrice) filters.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filters.price.$lte = Number(query.maxPrice);
  }

  return filters;
};

export const getProducts = asyncHandler(async (req, res) => {
  const sortMap = {
    newest: "-createdAt",
    priceAsc: "price",
    priceDesc: "-price",
    name: "name"
  };

  const products = await Product.find(buildProductFilters(req.query)).sort(sortMap[req.query.sort] || "-createdAt");
  res.json(products);
});

export const getFeaturedProducts = asyncHandler(async (_req, res) => {
  const products = await Product.find({ featured: true }).sort("-createdAt").limit(8);
  res.json(products);
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError("Product not found.", 404);
  res.json(product);
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError("Product not found.", 404);

  Object.assign(product, req.body);
  await product.save();

  res.json(product);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new ApiError("Product not found.", 404);
  res.json({ message: "Product deleted." });
});
