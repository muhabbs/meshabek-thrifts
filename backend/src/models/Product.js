import mongoose from "mongoose";

const sizeSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    stock: { type: Number, required: true, min: 0, default: 0 }
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    images: [{ type: String, required: true }],
    category: {
      type: String,
      required: true,
      enum: ["Hoodies", "Jackets", "Jeans", "Shirts", "Sweaters", "Accessories"]
    },
    sizes: [sizeSchema],
    stock: { type: Number, required: true, min: 0, default: 0 },
    soldOut: { type: Boolean, default: false },
    featured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

productSchema.pre("validate", function syncStock(next) {
  if (this.sizes?.length) {
    this.stock = this.sizes.reduce((sum, size) => sum + Number(size.stock || 0), 0);
  }
  this.soldOut = this.stock <= 0;
  next();
});

productSchema.index({ name: "text", description: "text", category: "text" });

export default mongoose.model("Product", productSchema);
