import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client.js";
import { useCart } from "../context/CartContext.jsx";
import { formatCurrency } from "../utils/format.js";

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "", notes: "" });

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      toast.error("Name, phone, and address are required.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/orders", { customer: form, products: items.map(({ product, size, quantity }) => ({ product, size, quantity })) });
      clearCart();
      toast.success("Order placed. Meshabek will contact you soon.");
      navigate("/products");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not place order.");
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <section className="container-page grid min-h-[55vh] place-items-center py-10 text-center">
        <div>
          <h1 className="font-display text-5xl font-black">No checkout items</h1>
          <Link to="/products" className="btn-primary mt-8">Shop products</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container-page py-10">
      <h1 className="font-display text-5xl font-black">Checkout</h1>
      <form onSubmit={submit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_24rem]">
        <div className="rounded-lg border border-ink/10 bg-linen p-5">
          <div className="grid gap-4">
            <label>
              <span className="label">Customer name</span>
              <input className="input" value={form.name} onChange={(event) => update("name", event.target.value)} required />
            </label>
            <label>
              <span className="label">Phone number</span>
              <input className="input" value={form.phone} onChange={(event) => update("phone", event.target.value)} required />
            </label>
            <label>
              <span className="label">Address</span>
              <textarea className="input min-h-32 resize-y" value={form.address} onChange={(event) => update("address", event.target.value)} required />
            </label>
            <label>
              <span className="label">Notes</span>
              <textarea className="input min-h-24 resize-y" value={form.notes} onChange={(event) => update("notes", event.target.value)} />
            </label>
          </div>
        </div>
        <aside className="h-fit rounded-lg border border-ink/10 bg-linen p-5 shadow-sm">
          <h2 className="font-display text-2xl font-black">Summary</h2>
          <div className="mt-5 grid gap-4">
            {items.map((item) => (
              <div key={`${item.product}-${item.size}`} className="flex gap-3">
                <img src={item.image} alt={item.name} className="h-16 w-16 rounded-lg object-cover" />
                <div className="flex-1 text-sm">
                  <p className="font-bold">{item.name}</p>
                  <p className="text-ink/55">Size {item.size} x {item.quantity}</p>
                </div>
                <strong className="text-sm">{formatCurrency(item.price * item.quantity)}</strong>
              </div>
            ))}
          </div>
          <div className="mt-5 flex justify-between border-t border-ink/10 pt-4">
            <span>Total</span>
            <strong>{formatCurrency(subtotal)}</strong>
          </div>
          <button className="btn-primary mt-6 w-full" disabled={submitting}>{submitting ? "Placing..." : "Place order"}</button>
        </aside>
      </form>
    </section>
  );
};

export default Checkout;
