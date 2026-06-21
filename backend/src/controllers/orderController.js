import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const normalizeOrderItems = (items) =>
  Object.values(
    items.reduce((acc, item) => {
      const key = `${item.product}-${item.size}`;
      acc[key] = acc[key] || { product: item.product, size: item.size, quantity: 0 };
      acc[key].quantity += Number(item.quantity || 0);
      return acc;
    }, {})
  );

export const createOrder = asyncHandler(async (req, res) => {
  const { customer, products } = req.body;

  if (!customer?.name || !customer?.phone || !customer?.address) {
    throw new ApiError("Name, phone, and address are required.", 400);
  }

  if (!Array.isArray(products) || products.length === 0) {
    throw new ApiError("Order must contain at least one product.", 400);
  }

  const requestedItems = normalizeOrderItems(products);
  const orderItems = [];
  const stockUpdates = [];
  let totalPrice = 0;

  for (const item of requestedItems) {
    if (!item.product || !item.size || item.quantity < 1) {
      throw new ApiError("Each order item requires product, size, and quantity.", 400);
    }

    const product = await Product.findById(item.product);
    if (!product) throw new ApiError("A product in this order no longer exists.", 404);

    const size = product.sizes.find((entry) => entry.label === item.size);
    if (!size) throw new ApiError(`${product.name} is unavailable in size ${item.size}.`, 400);
    if (size.stock < item.quantity) {
      throw new ApiError(`Only ${size.stock} item(s) left for ${product.name} in ${item.size}.`, 400);
    }

    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      size: item.size,
      quantity: item.quantity
    });

    stockUpdates.push({ product, size, quantity: item.quantity });
    totalPrice += product.price * item.quantity;
  }

  for (const update of stockUpdates) {
    update.size.stock -= update.quantity;
    await update.product.save();
  }

  const order = await Order.create({ customer, products: orderItems, totalPrice });
  res.status(201).json(order);
});

export const listOrders = asyncHandler(async (_req, res) => {
  const orders = await Order.find().populate("products.product", "name category").sort("-createdAt");
  res.json(orders);
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("products.product", "name category");
  if (!order) throw new ApiError("Order not found.", 404);
  res.json(order);
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const allowedStatuses = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];
  if (!allowedStatuses.includes(req.body.status)) {
    throw new ApiError("Invalid order status.", 400);
  }

  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError("Order not found.", 404);

  order.status = req.body.status;
  await order.save();

  res.json(order);
});
