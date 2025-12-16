import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  boxDailyAnalysisByExpenses,
  closedBoxDaily,
  deleteTransaction,
  findAllBoxDaily,
  getOneBoxDaily,
  openBoxDaily,
  reopenBoxDaily,
} from "./boxDaily.api";

export const useOpenBoxDaily = ({ onSuccess, onError } = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: openBoxDaily,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["box-daily"] });
      if (onSuccess) onSuccess(data);
    },
    onError,
  });
};

export const useClosedBoxDaily = ({ onSuccess, onError } = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: closedBoxDaily,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["box-daily"] });
      if (onSuccess) onSuccess(data);
    },
    onError,
  });
};

export const useReopenBoxDaily = ({ onSuccess, onError } = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reopenBoxDaily,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["box-daily"] });
      if (onSuccess) onSuccess(data);
    },
    onError,
  });
};

export const useFindAllBoxDaily = (params) =>
  useQuery({
    queryKey: ["box-daily", params],
    queryFn: () => findAllBoxDaily(params),
    keepPreviousData: true, // Mantiene data mientras carga nueva
  });

export const useGetOneBoxDaily = (id) => {
  return useQuery({
    queryKey: ["box-daily", id],
    queryFn: () => getOneBoxDaily(id),
    enabled: !!id, // solo ejecuta si hay id
  });
};

export const useDeleteTransactions = ({
  branchId,
  onSuccess,
  onError,
} = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTransaction,

    onSuccess: (deletedTransactionId) => {
      // 🔹 1. Actualizar instantáneamente el cache
      queryClient.setQueriesData({ queryKey: ["box-daily"] }, (oldData) => {
        if (!oldData) return oldData;

        // Si la data es una lista de cajas (useFindAllBoxDaily)
        if (Array.isArray(oldData)) {
          return oldData.map((box) => ({
            ...box,
            transactions: box.transactions?.filter(
              (t) => t.id !== deletedTransactionId
            ),
          }));
        }

        // Si es una sola caja (useGetOneBoxDaily)
        if (oldData?.transactions) {
          return {
            ...oldData,
            transactions: oldData.transactions.filter(
              (t) => t.id !== deletedTransactionId
            ),
          };
        }

        return oldData;
      });

      // 🔹 2. Sincronizar después
      queryClient.invalidateQueries({ queryKey: ["box-daily"] });

      if (onSuccess) onSuccess();
    },

    onError,
  });
};

// ANALISIS DE DATOS
// gastos
export const useExpensesByBranchAndDate = (params) =>
  useQuery({
    queryKey: ["expenses-by-branches", params],
    queryFn: () => boxDailyAnalysisByExpenses(params),
    keepPreviousData: true, // Mantiene data mientras carga nueva
  });
