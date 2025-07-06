import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../../api/auth/auth.store";

const PublicRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
