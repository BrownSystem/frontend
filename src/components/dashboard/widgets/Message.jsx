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
  duration,
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
    <div className="rounded-md fixed flex justify-center items-center px-5 py-4 border shadow-lg z-[99999999999999999]   w-full h-full bg-black/30 top-0 left-0">
      <div
        className={`w-[320px] h-auto ${variantStyles[type]} rounded-md! border-2 shadow-md`}
      >
        <div className="flex items-start gap-3 p-5 ">
          {/* Icono dinámico */}
          <div className="flex-shrink-0">{variantIcons[type]}</div>

          {/* Contenido */}
          <div className="flex-1">
            <p className="font-semibold text-sm">{title}</p>
            <p className="text-sm opacity-90">{message || "asdasdsad"}</p>
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
    </div>
  );
};

export default Message;
