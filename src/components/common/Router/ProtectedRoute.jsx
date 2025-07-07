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

      try {
        const { user: validatedUser } = await verifyToken();
        setUser(validatedUser); // actualiza user en el store
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

  // Redirección si token inválido
  if (!isValidToken) return <Navigate to="/" replace />;

  // Redirección si rol no permitido
  if (user && allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard/ventas" replace />;
  }

  return children;
};

export default ProtectedRoute;
