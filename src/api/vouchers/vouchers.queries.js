import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createVoucher, registerPayment, searchVoucher } from "./vouchers.api";

export const useCreateVoucher = ({ onSuccess, onError } = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createVoucher,
    onSuccess: (data) => {
      // Aquí asumo que la respuesta tiene la estructura { success: boolean, data: ..., message: string }
      if (data.success) {
        // Éxito real, invalida cache y callback onSuccess
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "vouchers",
        });

        if (onSuccess) onSuccess(data);
      } else {
        // Hay error lógico, llamar onError con mensaje o lanzar error para que react-query lo maneje
        const error = new Error(
          data.message || "Error desconocido al crear voucher"
        );
        if (onError) {
          onError(error);
        } else {
          throw error;
        }
      }
    },
    onError: (error) => {
      // Callback opcional para manejar errores de red o del servidor
      if (onError) onError(error);
      else {
        console.error("Error creando voucher:", error);
      }
    },
  });
};

export const useSearchVouchers = (params) =>
  useQuery({
    queryKey: ["vouchers", params],
    queryFn: () => searchVoucher(params),
    keepPreviousData: true, // Mantiene data mientras carga nueva
  });

export const useRegisterPayment = ({ onSuccess, onError } = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerPayment,
    onSuccess: (data) => {
      if (data.success) {
        // Invalida la lista si el pago afecta el estado
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "vouchers",
        });
        if (onSuccess) onSuccess(data);
      } else {
        const error = new Error(data.message || "Error al registrar el pago");
        if (onError) onError(error);
        else throw error;
      }
    },
    onError: (error) => {
      if (onError) onError(error);
      else console.error("Error al registrar pago:", error);
    },
  });
};
