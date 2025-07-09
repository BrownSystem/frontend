import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { verifyToken } from "../../../api/auth/auth.api";
import { useAuthStore } from "../../../api/auth/auth.store";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isValidToken, setIsValidToken] = useState(true);
  const [hasValidated, setHasValidated] = useState(false);

  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const checkToken = async () => {
      if (hasValidated) return;

      const token = localStorage.getItem("token");

      // Si no hay token, evitamos la verificación
      if (!token) {
        setUser(null);
        setIsValidToken(false);
        setHasValidated(true);
        setIsLoading(false);
        return;
      }

      try {
        const { user: validatedUser } = await verifyToken();
        setUser(validatedUser);
        setIsValidToken(true);
      } catch (error) {
        setUser(null);
        setIsValidToken(false);
      } finally {
        setHasValidated(true);
        setIsLoading(false);
      }
    };

    checkToken();
  }, [hasValidated, setUser]);

  if (isLoading) return null;

  if (!isValidToken) return <Navigate to="/" replace />;

  if (user && allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard/ventas" replace />;
  }

  return children;
};

export default ProtectedRoute;
