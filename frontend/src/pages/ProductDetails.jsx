import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client.js";
import ErrorState from "../components/ErrorState.jsx";
import LoadingState from "../components/LoadingState.jsx";
import { useCart } from "../context/CartContext.jsx";
import { formatCurrency } from "../utils/format.js";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then(({ data }) => {
        setProduct(data);
        setActiveImage(data.images[0]);
        setSelectedSize(data.sizes.find((size) => size.stock > 0)?.label || "");
      })
      .catch(() => setError("Product was not found."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <section className="container-page py-10"><LoadingState label="Loading product" /></section>;
  if (error) return <section className="container-page py-10"><ErrorState message={error} /></section>;

  const selectedStock = product.sizes.find((size) => size.label === selectedSize)?.stock || 0;

  return (
    <section className="container-page grid gap-10 py-10 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="grid gap-4 lg:grid-cols-[6rem_1fr]">
        <div className="order-2 flex gap-3 overflow-x-auto lg:order-1 lg:grid lg:content-start">
          {product.images.map((image) => (
            <button key={image} onClick={() => setActiveImage(image)} className={`aspect-square w-24 shrink-0 overflow-hidden rounded-lg border ${activeImage === image ? "border-rust" : "border-ink/10"}`}>
              <img src={image} alt={product.name} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
        <div className="order-1 overflow-hidden rounded-lg bg-parchment lg:order-2">
          <img src={activeImage} alt={product.name} className="aspect-[4/5] h-full w-full object-cover" />
        </div>
      </div>

      <div className="lg:sticky lg:top-28 lg:self-start">
        <p className="label">{product.category}</p>
        <div className="flex items-start justify-between gap-4">
          <h1 className="font-display text-4xl font-black leading-tight md:text-5xl">{product.name}</h1>
          {product.soldOut && <span className="badge bg-rust">Sold Out</span>}
        </div>
        <p className="mt-5 text-3xl font-black">{formatCurrency(product.price)}</p>
        <p className="mt-5 leading-8 text-ink/68">{product.description}</p>

        <div className="mt-8">
          <p className="label">Available sizes</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size.label}
                disabled={size.stock === 0}
                onClick={() => setSelectedSize(size.label)}
                className={`min-w-14 rounded-full border px-4 py-2 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-35 ${
                  selectedSize === size.label ? "border-ink bg-ink text-linen" : "border-ink/10 bg-linen hover:border-rust"
                }`}
              >
                {size.label}
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm text-ink/55">{selectedSize ? `${selectedStock} in stock for size ${selectedSize}` : "No size available"}</p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <div className="flex items-center rounded-full border border-ink/10 bg-linen">
            <button className="p-3" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Decrease quantity">
              <Minus size={18} />
            </button>
            <span className="min-w-10 text-center font-bold">{quantity}</span>
            <button className="p-3" onClick={() => setQuantity((value) => Math.min(selectedStock || 1, value + 1))} aria-label="Increase quantity">
              <Plus size={18} />
            </button>
          </div>
          <button className="btn-primary flex-1 sm:flex-none" disabled={product.soldOut || !selectedSize} onClick={() => addToCart(product, selectedSize, quantity)}>
            <ShoppingBag size={18} />
            Add to cart
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
