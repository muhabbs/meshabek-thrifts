import { Package, ShoppingBag, TrendingUp, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../api/client.js";
import ErrorState from "../../components/ErrorState.jsx";
import LoadingState from "../../components/LoadingState.jsx";
import { formatCurrency } from "../../utils/format.js";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/admin/stats")
      .then(({ data }) => setStats(data))
      .catch(() => setError("Could not load dashboard stats."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState label="Loading dashboard" />;
  if (error) return <ErrorState message={error} />;

  const cards = [
    { label: "Products", value: stats.totalProducts, icon: Package },
    { label: "Orders", value: stats.totalOrders, icon: ShoppingBag },
    { label: "Revenue", value: formatCurrency(stats.revenue), icon: Wallet },
    { label: "Best sellers", value: stats.bestSellers.length, icon: TrendingUp }
  ];

  return (
    <div>
      <h1 className="font-display text-4xl font-black">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-lg border border-ink/10 bg-linen p-5">
            <Icon className="text-rust" size={24} />
            <p className="mt-4 text-sm font-bold text-ink/55">{label}</p>
            <p className="mt-1 text-2xl font-black">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <section className="rounded-lg border border-ink/10 bg-linen p-5">
          <h2 className="font-display text-2xl font-black">Recent orders</h2>
          <div className="mt-4 grid gap-3">
            {stats.recentOrders.map((order) => (
              <div key={order._id} className="flex justify-between rounded-lg bg-parchment p-3 text-sm">
                <div>
                  <p className="font-bold">{order.customer.name}</p>
                  <p className="text-ink/55">{order.status}</p>
                </div>
                <strong>{formatCurrency(order.totalPrice)}</strong>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-lg border border-ink/10 bg-linen p-5">
          <h2 className="font-display text-2xl font-black">Best selling products</h2>
          <div className="mt-4 grid gap-3">
            {stats.bestSellers.map((item) => (
              <div key={item._id} className="flex justify-between rounded-lg bg-parchment p-3 text-sm">
                <div>
                  <p className="font-bold">{item.name}</p>
                  <p className="text-ink/55">{item.quantity} sold</p>
                </div>
                <strong>{formatCurrency(item.revenue)}</strong>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
