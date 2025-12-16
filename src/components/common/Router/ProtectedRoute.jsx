import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { verifyToken } from "../../../api/auth/auth.api";
import { useAuthStore } from "../../../api/auth/auth.store";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isValidToken, setIsValidToken] = useState(null); // null = aún no se sabe
  const { user, setUser, logout } = useAuthStore();

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        logout();
        setIsValidToken(false);
        setIsLoading(false);
        return;
      }

      try {
        const { user: validatedUser } = await verifyToken();
        setUser(validatedUser);
        setIsValidToken(true);
      } catch (error) {
        logout();
        setIsValidToken(false);
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();

    // 👇 Se revalida cada 60 segundos
  }, []);

  if (isLoading) return null;

  if (!isValidToken) {
    return <Navigate to="/" replace />;
  }

  if (user && allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard/ventas" replace />;
  }

  return children;
};

export default ProtectedRoute;
