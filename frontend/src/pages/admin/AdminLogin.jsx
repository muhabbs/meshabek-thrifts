import { Lock } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const AdminLogin = () => {
  const { login, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@meshabek.store");
  const [password, setPassword] = useState("admin12345");
  const [submitting, setSubmitting] = useState(false);

  if (isAdmin) return <Navigate to="/admin" replace />;

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      toast.success("Welcome back.");
      navigate("/admin");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="grid min-h-screen place-items-center bg-ink p-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-lg bg-linen p-6 shadow-soft">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-rust text-white">
          <Lock size={22} />
        </div>
        <h1 className="mt-5 font-display text-4xl font-black">Admin login</h1>
        <p className="mt-2 text-sm text-ink/60">Manage Meshabek products, orders, and sales.</p>
        <div className="mt-6 grid gap-4">
          <label>
            <span className="label">Email</span>
            <input className="input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label>
            <span className="label">Password</span>
            <input className="input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </label>
        </div>
        <button className="btn-primary mt-6 w-full" disabled={submitting}>{submitting ? "Signing in..." : "Sign in"}</button>
      </form>
    </section>
  );
};

export default AdminLogin;
