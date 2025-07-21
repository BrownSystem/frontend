import React from "react";
import { Danger, Delete, TickCircle, Warning } from "../../../assets/icons";

const getIcon = (type) => {
  switch (type) {
    case "error":
      return (
        <span className="bg-red-500 text-xl rounded-full p-2 text-white">
          <Warning />
        </span>
      );
    case "warning":
      return (
        <span className="bg-orange-500 text-xl rounded-full p-2">
          <Danger color={"white"} />
        </span>
      );
    case "success":
    default:
      return (
        <span className="bg-green-600 text-xl rounded-full p-2">
          <TickCircle color={"white"} />
        </span>
      );
  }
};

const NotificationModal = ({
  isOpen,
  onClose,
  notifications = [],
  onMarkAsRead,
  onDelete,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100000] bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-[480px] max-h-[80vh] overflow-y-auto relative border border-gray-200">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-lg"
          aria-label="Cerrar notificaciones"
        >
          ✕
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl">🔔</span>
          <h2 className="text-xl font-semibold text-gray-800">
            Notificaciones
          </h2>
        </div>

        {/* Content */}
        {notifications.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No hay notificaciones por el momento.
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notif, index) => (
              <div
                key={index}
                className="flex items-start bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition text-sm relative"
              >
                {getIcon(notif.type)}
                <div className="ml-3 flex-1">
                  <p className="font-medium mb-1 text-gray-900">
                    {notif.title}
                  </p>
                  <p className="text-gray-700 mb-2">{notif.message}</p>
                  {notif.action && (
                    <button
                      onClick={notif.action}
                      className="text-green-600 hover:underline text-xs font-medium cursor-pointer"
                    >
                      {notif.actionLabel || "Ver detalles"}
                    </button>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex flex-col gap-2 ml-2">
                  <button
                    onClick={() => onMarkAsRead?.(notif)}
                    className="text-green-600 hover:text-green-800 text-lg"
                    title="Marcar como leído"
                  >
                    ✅
                  </button>
                  <button
                    onClick={() => onDelete?.(notif)}
                    className="text-red-500 hover:text-red-700 text-lg"
                    title="Eliminar notificación"
                  >
                    <Delete />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {/* <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800"
          >
            Cerrar
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default NotificationModal;
