import { Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

const links = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/faq", label: "FAQ" }
];

const AppLayout = () => {
  const [open, setOpen] = useState(false);
  const { count } = useCart();

  const navLinkClass = ({ isActive }) =>
    `text-sm font-bold transition ${isActive ? "text-rust" : "text-ink/75 hover:text-rust"}`;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-linen/90 backdrop-blur-xl">
        <div className="container-page flex h-20 items-center justify-between">
          <Link to="/" className="font-display text-2xl font-black tracking-wide text-ink">
            Meshabek Store
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} className={navLinkClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/cart" className="relative rounded-full border border-ink/10 p-3 transition hover:border-rust hover:text-rust" aria-label="Cart">
              <ShoppingBag size={20} />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-rust px-1 text-[11px] font-bold text-white">
                  {count}
                </span>
              )}
            </Link>
            <button className="rounded-full border border-ink/10 p-3 md:hidden" onClick={() => setOpen((value) => !value)} aria-label="Menu">
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {open && (
          <nav className="container-page grid gap-3 pb-5 md:hidden">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)} className={navLinkClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="mt-20 border-t border-ink/10 bg-ink py-10 text-linen">
        <div className="container-page grid gap-8 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <h2 className="font-display text-3xl font-black">Meshabek Store</h2>
            <p className="mt-3 max-w-md text-sm leading-7 text-linen/70">
              Premium thrift finds curated in Egypt: washed denim, vintage hoodies, jackets, knitwear, and one-off pieces.
            </p>
          </div>
          <div>
            <p className="font-bold">Shop</p>
            <div className="mt-3 grid gap-2 text-sm text-linen/70">
              <Link to="/products">All products</Link>
              <Link to="/cart">Cart</Link>
              <Link to="/admin/login">Admin</Link>
            </div>
          </div>
          <div>
            <p className="font-bold">Egypt Delivery</p>
            <p className="mt-3 text-sm leading-7 text-linen/70">Cairo, Giza, Alexandria, and governorates through courier partners.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
