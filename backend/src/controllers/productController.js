import Product from "../models/Product.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const buildFilters = (query) => {
  const filters = {};

  if (query.search) filters.$text = { $search: query.search };
  if (query.category) filters.category = query.category;
  if (query.size) filters["sizes.label"] = query.size;
  if (query.minPrice || query.maxPrice) {
    filters.price = {};
    if (query.minPrice) filters.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filters.price.$lte = Number(query.maxPrice);
  }

  return filters;
};

const sortMap = {
  newest: "-createdAt",
  priceAsc: "price",
  priceDesc: "-price",
  name: "name"
};

const normalizeProductPayload = (body) => ({
  name: body.name,
  description: body.description,
  price: Number(body.price),
  images: Array.isArray(body.images) ? body.images.filter(Boolean) : [],
  category: body.category,
  featured: Boolean(body.featured),
  sizes: Array.isArray(body.sizes)
    ? body.sizes.map((size) => ({ label: size.label, stock: Number(size.stock || 0) })).filter((size) => size.label)
    : []
});

export const listProducts = asyncHandler(async (req, res) => {
  const products = await Product.find(buildFilters(req.query)).sort(sortMap[req.query.sort] || "-createdAt");
  res.json(products);
});

export const listFeaturedProducts = asyncHandler(async (_req, res) => {
  const products = await Product.find({ featured: true }).sort("-createdAt").limit(8);
  res.json(products);
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError("Product not found.", 404);
  res.json(product);
});

export const createProduct = asyncHandler(async (req, res) => {
  const payload = normalizeProductPayload(req.body);
  if (!payload.images.length) throw new ApiError("At least one image is required.", 400);
  if (!payload.sizes.length) throw new ApiError("At least one size is required.", 400);

  const product = await Product.create(payload);
  res.status(201).json(product);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError("Product not found.", 404);

  Object.assign(product, normalizeProductPayload(req.body));
  if (!product.images.length) throw new ApiError("At least one image is required.", 400);
  if (!product.sizes.length) throw new ApiError("At least one size is required.", 400);

  await product.save();
  res.json(product);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new ApiError("Product not found.", 404);
  res.json({ message: "Product deleted." });
});
