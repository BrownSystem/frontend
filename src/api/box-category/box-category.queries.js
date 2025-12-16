import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createBoxCategory,
  getAllBoxCategory,
  getOneBoxCategory,
} from "./box-category.api";

// Hook para obtener todas las tarjetas
export const useGetAllBoxCategories = () => {
  return useQuery({
    queryKey: ["box-category"],
    queryFn: getAllBoxCategory,
  });
};

// Hook para obtener una tarjeta por id
export const useGetOneBoxCategory = (id) => {
  return useQuery({
    queryKey: ["box-category", id],
    queryFn: () => getOneBoxCategory(id),
    enabled: !!id, // solo ejecuta si hay id
  });
};

export const useCreateBoxCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBoxCategory,
    onSuccess: (newBoxCategory) => {
      // invalidar o actualizar cache de tarjetas
      queryClient.invalidateQueries({ queryKey: ["box-category"] });
    },
  });
};
