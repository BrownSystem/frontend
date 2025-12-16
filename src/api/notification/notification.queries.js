import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createNotification,
  deleteNotification,
  getNotificationsByBranch,
  markNotificationAsRead,
} from "./notification.api";

// Obtener todas por branch
export const useNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotificationsByBranch(),
    keepPreviousData: true,
    refetchInterval: 10000, // 🔄 cada 10s
  });
};

// Crear nueva notificación
export const useCreateNotification = ({ onSuccess, onError } = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNotification,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      if (onSuccess) onSuccess(data);
    },
    onError,
  });
};

// Marcar como leída
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });
};

// Eliminar (soft-delete)
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });
};
