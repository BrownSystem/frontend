import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../../api/auth/auth.store";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    // No logueado
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Usuario logueado pero sin rol permitido
    // Podés redirigir a otra ruta o mostrar mensaje
    return <Navigate to="/dashboard/ventas" replace />; // ejemplo redirigir a ventas
  }

  // Usuario con rol permitido
  return children;
};

export default ProtectedRoute;
