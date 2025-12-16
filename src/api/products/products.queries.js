import {
  createProduct,
  downloadPdfProducts,
  updateProduct,
  updateStockFromList,
  uploadProducts,
} from "./products.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { downloadPdfQrs, searchProducts } from "./products.api";

export const useCreateProduct = ({ onSuccess, onError } = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      if (onSuccess) onSuccess(data);
    },
    onError,
  });
};

export const useSearchProducts = ({
  search,
  branchId,
  limit = 6,
  offset = 0,
}) => {
  return useQuery({
    queryKey: ["products", search?.trim(), branchId, limit, offset],
    queryFn: () => searchProducts({ search, branchId, limit, offset }),
    enabled: !!branchId && offset >= 0,
    keepPreviousData: true, // mantiene los datos anteriores mientras se carga la nueva página
  });
};

export const useDownloadPdfQrs = () => {
  return useMutation({
    mutationFn: downloadPdfQrs,
  });
};

export const useDownloadPdfProducts = () => {
  return useMutation({
    mutationFn: downloadPdfProducts,
  });
};

export const useUploadProducts = ({ onSuccess, onError } = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadProducts,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      if (onSuccess) onSuccess(data);
    },
    onError,
  });
};

export const useUpdateProduct = ({ onSuccess, onError } = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProduct,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      if (onSuccess) onSuccess(data);
    },
    onError,
  });
};

export const useUpdateStockFromList = ({ onSuccess, onError } = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStockFromList,
    onSuccess: (data) => {
      // 🔄 refresca tablas de productos / stock
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      queryClient.invalidateQueries({
        queryKey: ["products-branches"],
      });

      if (onSuccess) onSuccess(data);
    },
    onError,
  });
};
