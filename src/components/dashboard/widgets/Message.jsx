import { useEffect } from "react";

const variantStyles = {
  success: "bg-green-100 text-green-800 border-green-400",
  error: "bg-red-100 text-red-800 border-red-400",
  warning: "bg-yellow-100 text-yellow-800 border-yellow-400",
  info: "bg-blue-100 text-blue-800 border-blue-400",
};

const Message = ({ message, type = "info", duration = 3000, onClose }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!message) return null;

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 border rounded shadow z-[9999] ${variantStyles[type]}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-center">{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="text-xl leading-none ml-2 hover:text-black"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default Message;
