import React from "react";
import { Danger, Delete, TickCircle, Warning } from "../../../assets/icons";

const getIcon = (type) => {
  switch (type) {
    case "error":
      return (
        <span className="bg-bg-state-red text-xl rounded-full p-2 text-text-state-red">
          <Warning />
        </span>
      );
    case "warning":
      return (
        <span className="bg-bg-state-yellow text-xl rounded-full p-2 text-text-state-yellow">
          <Danger />
        </span>
      );
    case "success":
    default:
      return (
        <span className="bg-[var(--brown-dark-800)] text-xl rounded-full p-2 text-text-state-green">
          <TickCircle />
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
  const openVoucher = (id) => {
    navigate(`/dashboard/comprobantes/${id}`);
  };

  return (
    <div className="fixed inset-0 z-[100000] bg-[var(--brown-dark-950)]/50 flex items-center justify-center">
      <div className="bg-[var(--brown-ligth-50)] rounded-2xl shadow-lg p-6 w-[520px] max-h-[80vh] overflow-y-auto relative border border-[var(--brown-ligth-200)] font-outfit">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--brown-dark-700)] hover:text-[var(--brown-dark-900)] text-lg"
          aria-label="Cerrar notificaciones"
        >
          ✕
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl">🔔</span>
          <h2 className="text-lg font-semibold text-[var(--brown-dark-900)]">
            Notificaciones
          </h2>
        </div>

        {/* Content */}
        {notifications.length === 0 ? (
          <div className="text-center text-[var(--brown-dark-700)] py-10 italic">
            No hay notificaciones por el momento.
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif, index) => (
              <div
                key={index}
                className="flex items-start bg-[var(--brown-ligth-100)] border border-[var(--brown-ligth-200)] rounded-lg p-4 hover:bg-[var(--brown-ligth-200)] transition text-sm relative"
              >
                {getIcon(notif.type)}
                <div className="ml-3 flex-1">
                  <p className="font-medium mb-1 text-[var(--brown-dark-900)]">
                    {notif.title}
                  </p>
                  <p className="text-[var(--brown-dark-700)] mb-2">
                    {notif.message}
                  </p>
                  {notif.action && (
                    <button
                      onClick={() => {
                        openVoucher(notif.action);
                        onMarkAsRead?.(notif);
                      }}
                      className="text-[var(--brown-dark-800)] hover:underline text-xs font-medium cursor-pointer"
                    >
                      {notif.actionLabel || "Ver detalles"}
                    </button>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex flex-col gap-2 ml-2">
                  <button
                    onClick={() => onDelete?.(notif)}
                    className="text-[var(--text-state-red)] hover:text-[var(--brown-dark-800)] text-lg"
                    title="Eliminar notificación"
                  >
                    <Delete />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationModal;
