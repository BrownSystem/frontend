import { useMutation, useQuery } from "@tanstack/react-query";
import { downloadPdfQrs, searchProducts } from "./products.api";

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
