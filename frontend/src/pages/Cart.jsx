import { Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { formatCurrency } from "../utils/format.js";

const Cart = () => {
  const { items, subtotal, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <section className="container-page grid min-h-[55vh] place-items-center py-10 text-center">
        <div>
          <h1 className="font-display text-5xl font-black">Your cart is empty</h1>
          <p className="mt-4 text-ink/60">Find a one-off piece before someone else does.</p>
          <Link to="/products" className="btn-primary mt-8">Shop products</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container-page py-10">
      <h1 className="font-display text-5xl font-black">Cart</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_24rem]">
        <div className="grid gap-4">
          {items.map((item) => (
            <article key={`${item.product}-${item.size}`} className="grid gap-4 rounded-lg border border-ink/10 bg-linen p-4 sm:grid-cols-[7rem_1fr_auto] sm:items-center">
              <img src={item.image} alt={item.name} className="aspect-square w-28 rounded-lg object-cover" />
              <div>
                <h2 className="font-bold">{item.name}</h2>
                <p className="mt-1 text-sm text-ink/55">Size {item.size}</p>
                <p className="mt-2 font-bold">{formatCurrency(item.price)}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-full border border-ink/10">
                  <button className="p-2" onClick={() => updateQuantity(item.product, item.size, item.quantity - 1)} aria-label="Decrease quantity"><Minus size={16} /></button>
                  <span className="min-w-8 text-center text-sm font-bold">{item.quantity}</span>
                  <button className="p-2" onClick={() => updateQuantity(item.product, item.size, item.quantity + 1)} aria-label="Increase quantity"><Plus size={16} /></button>
                </div>
                <button className="rounded-full border border-ink/10 p-2 text-rust" onClick={() => removeItem(item.product, item.size)} aria-label="Remove item"><Trash2 size={16} /></button>
              </div>
            </article>
          ))}
        </div>
        <aside className="h-fit rounded-lg border border-ink/10 bg-linen p-5 shadow-sm">
          <h2 className="font-display text-2xl font-black">Order summary</h2>
          <div className="mt-5 flex justify-between border-b border-ink/10 pb-4 text-sm">
            <span>Subtotal</span>
            <strong>{formatCurrency(subtotal)}</strong>
          </div>
          <p className="mt-4 text-sm text-ink/60">Delivery is confirmed by phone after order placement.</p>
          <Link to="/checkout" className="btn-primary mt-6 w-full">Checkout</Link>
        </aside>
      </div>
    </section>
  );
};

export default Cart;
