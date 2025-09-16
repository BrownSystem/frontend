import { useEffect } from "react";
import {
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
  FiInfo,
} from "react-icons/fi";

const variantStyles = {
  success: "bg-green-50 text-green-900 border-green-300",
  error: "bg-red-50 text-red-900 border-red-300",
  warning: "bg-yellow-50 text-yellow-900 border-yellow-300",
  info: "bg-blue-50 text-blue-900 border-blue-300",
};

const variantIcons = {
  success: <FiCheckCircle className="w-6 h-6 text-green-600" />,
  error: <FiXCircle className="w-6 h-6 text-red-600" />,
  warning: <FiAlertTriangle className="w-6 h-6 text-yellow-600" />,
  info: <FiInfo className="w-6 h-6 text-blue-600" />,
};

const Message = ({
  title = "Notificación",
  message,
  type = "info",
  duration = 3000,
  onClose,
}) => {
  useEffect(() => {
    if (message && duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div
      className={`fixed top-6 right-6 px-5 py-4 border rounded-xl shadow-lg z-[99999999999] w-[320px] animate-fadeInUp ${variantStyles[type]}`}
    >
      <div className="flex items-start gap-3">
        {/* Icono dinámico */}
        <div className="flex-shrink-0">{variantIcons[type]}</div>

        {/* Contenido */}
        <div className="flex-1">
          <p className="font-semibold text-sm">{title}</p>
          <p className="text-sm opacity-90">{message}</p>
        </div>

        {/* Botón de cerrar */}
        {onClose && (
          <button
            onClick={onClose}
            className="text-lg leading-none ml-2 hover:opacity-70"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default Message;
