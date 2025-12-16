import React, { useEffect, useState } from "react";
import {
  Buy,
  Comprobantes,
  Logout,
  Notification,
  Panel,
} from "../../../assets/icons";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../api/auth/auth.store";
import { NotificationModal } from "../../common";
import {
  useDeleteNotification,
  useMarkAsRead,
  useNotifications,
} from "../../../api/notification/notification.queries";
import { Message } from "../widgets";
import { useMessageStore } from "../../../store/useMessage";

const Sidebar = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const { setMessage } = useMessageStore();

  const { data: notificationsData = [], isLoading } = useNotifications(
    user?.branchId
  );

  useEffect(() => {
    if (notificationsData.length > 0) {
      notificationsData?.map((n) => {
        if (!n.read) {
          setMessage({
            text: n.title,
            type: "info",
          });
        }
      });
    }
  }, [notificationsData]);

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
            onClick={() => handleSliderChange("/dashboard")}
            className="group relative cursor-pointer border-none"
          >
            <Panel color={"white"} size={32} />
            <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-sm text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
              Panel
            </span>
          </div>
        )}

        {/* Ventas */}
        <div
          onClick={() => handleSliderChange("ventas")}
          className="group relative cursor-pointer border-none"
        >
          <Buy size={38} color={"white"} />
          <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-sm text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
            Ventas
          </span>
        </div>

        {/* Notification */}
        <div
          onClick={() => setShowNotificationModal(true)}
          className="group relative cursor-pointer border-none"
        >
          <Notification size={32} color={"white"} />
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
          <Logout color={"white"} />
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
        }))}
        onMarkAsRead={(notif) => {
          markAsRead(notif.id);
        }}
        onDelete={(notif) => {
          deleteNotification(notif.id);
        }}
      />
    </div>
  );
};

export default Sidebar;
