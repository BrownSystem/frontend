// api/banks/banks.queries.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createBank, getAllBanks, updateBank } from "./banks.api";

export const useBanks = () => {
  return useQuery({
    queryKey: ["banks"],
    queryFn: getAllBanks,
  });
};

export const useCreateBank = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBank,
    onSuccess: (newBank) => {
      // invalidar o actualizar cache de tarjetas
      queryClient.invalidateQueries({ queryKey: ["banks"] });
    },
  });
};

export const useUpdateBank = ({ onSuccess, onError }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateBank(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["banks"] });
      if (onSuccess) onSuccess(data);
    },
    onError: (error) => {
      if (onError) onError(error);
    },
  });
};
