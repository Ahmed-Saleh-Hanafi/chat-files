import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import FullPageLoader from "../common/FullPageLoader.jsx";
import { AUTH_STATUS } from "../../context/AuthContext.jsx";

export default function ProtectedRoute() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === AUTH_STATUS.UNKNOWN || status === AUTH_STATUS.CHECKING) {
    return <FullPageLoader label="Checking your session..." />;
  }

  if (status === AUTH_STATUS.UNAUTHENTICATED) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
