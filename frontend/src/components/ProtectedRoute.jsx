import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const ProtectedRoute = ({ children }) => {
  const { isAdmin, loading } = useAuth();

  if (loading) return <div className="grid min-h-screen place-items-center bg-linen text-sm font-bold">Loading...</div>;
  if (!isAdmin) return <Navigate to="/admin/login" replace />;

  return children;
};

export default ProtectedRoute;
