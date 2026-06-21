import { BarChart3, LogOut, Package, ShoppingBag } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    { to: "/admin", label: "Dashboard", icon: BarChart3, end: true },
    { to: "/admin/products", label: "Products", icon: Package },
    { to: "/admin/orders", label: "Orders", icon: ShoppingBag }
  ];

  return (
    <div className="min-h-screen bg-parchment">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-ink/10 bg-linen p-6 lg:block">
        <h1 className="font-display text-3xl font-black">Meshabek Admin</h1>
        <nav className="mt-10 grid gap-2">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${isActive ? "bg-ink text-linen" : "hover:bg-ink/5"}`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <button
          className="btn-secondary mt-10 w-full"
          onClick={() => {
            logout();
            navigate("/admin/login");
          }}
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-ink/10 bg-linen/90 px-4 py-4 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between">
            <span className="font-display text-xl font-black">Admin</span>
            <div className="flex gap-2">
              {links.map(({ to, icon: Icon, end }) => (
                <NavLink key={to} to={to} end={end} className="rounded-full border border-ink/10 p-2">
                  <Icon size={18} />
                </NavLink>
              ))}
            </div>
          </div>
        </header>
        <main className="container-page py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
