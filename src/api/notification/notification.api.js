import { AxiosInitializer } from "..";

// Crear una nueva notificación
export const createNotification = async (data) => {
  const response = await AxiosInitializer.post("/notifications", data);
  return response.data;
};

// Obtener notificaciones por sucursal
export const getNotificationsByBranch = async (branchId) => {
  const response = await AxiosInitializer.get("/notifications", {
    params: { branchId },
  });
  return response.data;
};

// Marcar como leída
export const markNotificationAsRead = async (id) => {
  const response = await AxiosInitializer.patch(`/notifications/${id}/read`);
  return response.data;
};

// Soft-delete
export const deleteNotification = async (id) => {
  const response = await AxiosInitializer.delete(`/notifications/${id}`);
  return response.data;
};
