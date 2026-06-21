import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { asyncHandler } from "../utils/errors.js";

export const getDashboardStats = asyncHandler(async (_req, res) => {
  const [totalProducts, totalOrders, deliveredRevenue, recentOrders, bestSellers] = await Promise.all([
    Product.countDocuments(),
    Order.countDocuments(),
    Order.aggregate([
      { $match: { status: { $ne: "Cancelled" } } },
      { $group: { _id: null, revenue: { $sum: "$totalPrice" } } }
    ]),
    Order.find().sort("-createdAt").limit(6),
    Order.aggregate([
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.product",
          name: { $first: "$products.name" },
          quantity: { $sum: "$products.quantity" },
          revenue: { $sum: { $multiply: ["$products.price", "$products.quantity"] } }
        }
      },
      { $sort: { quantity: -1 } },
      { $limit: 5 }
    ])
  ]);

  res.json({
    totalProducts,
    totalOrders,
    revenue: deliveredRevenue[0]?.revenue || 0,
    recentOrders,
    bestSellers
  });
});
