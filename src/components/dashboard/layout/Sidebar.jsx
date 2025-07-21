import React, { useState } from "react";
import { Buy, Logout, Notification } from "../../../assets/icons";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../api/auth/auth.store";
import { NotificationModal } from "../../common";
import {
  useDeleteNotification,
  useMarkAsRead,
  useNotifications,
} from "../../../api/notification/notification.queries";

const Sidebar = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const { data: notificationsData = [], isLoading } = useNotifications(
    user?.branchId
  );

  const { mutate: deleteNotification } = useDeleteNotification();
  const { mutate: markAsRead } = useMarkAsRead();

  const unreadCount = notificationsData.filter((n) => !n.read).length;

  const handleSliderChange = (href) => {
    navigate(href);
  };

  const handleLogout = () => {
    navigate("/"); // Redirigir a login
  };

  // Aquí podés definir qué mostrar según el rol
  const isAdmin = user?.role === "ADMIN";
  const isManagement = user?.role === "MANAGEMENT";

  return (
    <div className="fixed z-[99999] top-0 h-full w-[4rem] bg-[var(--brown-dark-800)] shadow-md">
      <div className="flex flex-col w-full h-full justify-center items-center pt-10 gap-[60px]">
        {/* Dashboard - ADMIN y MANAGEMENT */}
        {(isAdmin || isManagement) && (
          <div
            onClick={() => handleSliderChange("/")}
            className="group relative cursor-pointer border-none"
          >
            <svg
              width="34"
              height="34"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 2.75H5C3.75736 2.75 2.75 3.75736 2.75 5V8C2.75 9.24264 3.75736 10.25 5 10.25H8C9.24264 10.25 10.25 9.24264 10.25 8V5C10.25 3.75736 9.24264 2.75 8 2.75Z"
                stroke="#fff"
                strokeWidth="1.5"
              />
              <path
                d="M19 2.75H16C14.7574 2.75 13.75 3.75736 13.75 5V8C13.75 9.24264 14.7574 10.25 16 10.25H19C20.2426 10.25 21.25 9.24264 21.25 8V5C21.25 3.75736 20.2426 2.75 19 2.75Z"
                stroke="#fff"
                strokeWidth="1.5"
              />
              <path
                d="M19 13.75H16C14.7574 13.75 13.75 14.7574 13.75 16V19C13.75 20.2426 14.7574 21.25 16 21.25H19C20.2426 21.25 21.25 20.2426 21.25 19V16C21.25 14.7574 20.2426 13.75 19 13.75Z"
                stroke="#fff"
                strokeWidth="1.5"
              />
              <path
                d="M8 13.75H5C3.75736 13.75 2.75 14.7574 2.75 16V19C2.75 20.2426 3.75736 21.25 5 21.25H8C9.24264 21.25 10.25 20.2426 10.25 19V16C10.25 14.7574 9.24264 13.75 8 13.75Z"
                stroke="#fff"
                strokeWidth="1.5"
              />
            </svg>
            <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-sm text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
              Dashboard
            </span>
          </div>
        )}

        {/* Ventas */}
        <div
          onClick={() => handleSliderChange("ventas")}
          className="group relative cursor-pointer border-none"
        >
          <Buy x={"34"} y={"34"} />
          <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-sm text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
            Ventas
          </span>
        </div>

        {/* Notification */}
        <div
          onClick={() => setShowNotificationModal(true)}
          className="group relative cursor-pointer border-none"
        >
          <Notification />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] rounded-full px-[5px]">
              {unreadCount}
            </span>
          )}
          <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-sm text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
            Notificaciones
          </span>
        </div>

        {/* Logout */}
        <div
          className="group relative cursor-pointer border-none"
          onClick={handleLogout}
        >
          <Logout />
          <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-sm text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
            Salir
          </span>
        </div>
      </div>
      <NotificationModal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        notifications={notificationsData.map((n) => ({
          id: n.id,
          title: n.title,
          message: n.message,
          type: n.type || "success",
          actionLabel: "Ver detalle",
          action: () => console.log("Ver notificación:", n.id),
        }))}
        onMarkAsRead={(notif) => {
          console.log("📨 Marcar como leído", notif.id);
          markAsRead(notif.id);
        }}
        onDelete={(notif) => {
          console.log("🗑️ Eliminar", notif.id);
          deleteNotification(notif.id);
        }}
      />
    </div>
  );
};

export default Sidebar;
