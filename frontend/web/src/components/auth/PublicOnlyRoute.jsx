import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { AUTH_STATUS } from "../../context/AuthContext.jsx";

export default function PublicOnlyRoute() {
  const { status } = useAuth();

  if (status === AUTH_STATUS.AUTHENTICATED) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return <Outlet />;
}
