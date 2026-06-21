import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/client.js";
import ErrorState from "../../components/ErrorState.jsx";
import LoadingState from "../../components/LoadingState.jsx";
import { formatCurrency } from "../../utils/format.js";

const statuses = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    api
      .get("/orders")
      .then(({ data }) => setOrders(data))
      .catch(() => setError("Could not load orders."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const updateStatus = async (id, status) => {
    try {
      const { data } = await api.patch(`/orders/${id}/status`, { status });
      setOrders((current) => current.map((order) => (order._id === id ? data : order)));
      toast.success("Order updated.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update order.");
    }
  };

  if (loading) return <LoadingState label="Loading orders" />;
  if (error) return <ErrorState message={error} />;

  return (
    <div>
      <h1 className="font-display text-4xl font-black">Orders</h1>
      <div className="mt-6 grid gap-4">
        {orders.map((order) => (
          <article key={order._id} className="rounded-lg border border-ink/10 bg-linen p-5">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
              <div>
                <p className="font-bold">{order.customer.name}</p>
                <p className="mt-1 text-sm text-ink/60">{order.customer.phone} - {order.customer.address}</p>
                {order.customer.notes && <p className="mt-1 text-sm text-ink/55">Notes: {order.customer.notes}</p>}
              </div>
              <div className="flex items-center gap-3">
                <strong>{formatCurrency(order.totalPrice)}</strong>
                <select className="input w-40" value={order.status} onChange={(event) => updateStatus(order._id, event.target.value)}>
                  {statuses.map((status) => <option key={status}>{status}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-5 grid gap-3">
              {order.products.map((item) => (
                <div key={`${order._id}-${item.product}-${item.size}`} className="flex gap-3 rounded-lg bg-parchment p-3 text-sm">
                  <img src={item.image} alt={item.name} className="h-14 w-14 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="font-bold">{item.name}</p>
                    <p className="text-ink/55">Size {item.size} x {item.quantity}</p>
                  </div>
                  <strong>{formatCurrency(item.price * item.quantity)}</strong>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default AdminOrders;
