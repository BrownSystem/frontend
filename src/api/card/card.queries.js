import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createCard, getAllCard, getOneCard } from "./card.api";

// Hook para obtener todas las tarjetas
export const useGetAllCards = () => {
  return useQuery({
    queryKey: ["cards"],
    queryFn: getAllCard,
  });
};

// Hook para obtener una tarjeta por id
export const useGetOneCard = (id) => {
  return useQuery({
    queryKey: ["cards", id],
    queryFn: () => getOneCard(id),
    enabled: !!id, // solo ejecuta si hay id
  });
};

export const useCreateCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCard,
    onSuccess: (newCard) => {
      // invalidar o actualizar cache de tarjetas
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });
};
