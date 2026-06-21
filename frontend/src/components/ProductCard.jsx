import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency } from "../utils/format.js";

const ProductCard = ({ product }) => {
  const availableSize = product.sizes?.find((size) => size.stock > 0)?.label;

  return (
    <article className="group overflow-hidden rounded-lg border border-ink/10 bg-linen shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      <Link to={`/products/${product._id}`} className="relative block aspect-[4/5] overflow-hidden bg-parchment">
        <img src={product.images?.[0]} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        {product.soldOut && <span className="badge absolute left-3 top-3 bg-rust">Sold Out</span>}
      </Link>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-olive">{product.category}</p>
            <Link to={`/products/${product._id}`} className="mt-1 block font-bold leading-snug hover:text-rust">
              {product.name}
            </Link>
          </div>
          <p className="shrink-0 font-bold">{formatCurrency(product.price)}</p>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-ink/55">{product.sizes?.map((size) => size.label).join(" / ")}</p>
          <Link
            to={`/products/${product._id}`}
            className="rounded-full bg-ink p-2 text-linen transition hover:bg-rust"
            aria-label={`View ${product.name}`}
            title={availableSize ? `Available in ${availableSize}` : "Sold out"}
          >
            <ShoppingBag size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
