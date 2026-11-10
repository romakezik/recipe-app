import { Navigate, Outlet } from "react-router";
import { useAuth } from "../hooks/useAuth";

export default function PrivateRoute() {
  const { user, loading } = useAuth();

  if (loading)
    return <div className="p-6 text-center">Проверка авторизации...</div>;

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
