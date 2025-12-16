import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  expenseByCategory,
  expenseEmployeed,
  expenseTransferByBranch,
  getIncomeByPaymentMethod,
} from "./transaction.api";

export const useGetIncomeByPaymentMethod = (branchId) => {
  return useQuery({
    queryKey: ["transactions", branchId],
    queryFn: () => getIncomeByPaymentMethod(branchId),
    enabled: !!branchId,
  });
};

export const useExpenseTransferByBranch = ({ onSuccess, onError } = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: expenseTransferByBranch,
    onSuccess: (data) => {
      // Siempre actualiza el box-daily
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "box-daily",
      });

      // Si el servidor devolvió un mensaje o data válida, todo bien
      if (onSuccess) onSuccess(data);
    },
    onError: (error) => {
      if (onError) onError(error);
    },
  });
};

export const useExpenseEmployeed = ({ onSuccess, onError } = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: expenseEmployeed,
    onSuccess: (data) => {
      // Siempre actualiza el box-daily
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "box-daily",
      });

      // Si el servidor devolvió un mensaje o data válida, todo bien
      if (onSuccess) onSuccess(data);
    },
    onError: (error) => {
      if (onError) onError(error);
    },
  });
};

export const useExpenseByCategory = ({ onSuccess, onError } = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: expenseByCategory,
    onSuccess: (data) => {
      // Siempre actualiza el box-daily
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "box-daily",
      });

      // Si el servidor devolvió un mensaje o data válida, todo bien
      if (onSuccess) onSuccess(data);
    },
    onError: (error) => {
      if (onError) onError(error);
    },
  });
};
