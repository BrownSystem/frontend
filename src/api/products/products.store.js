import { useQuery } from "@tanstack/react-query";
import { searchProducts } from "./products.api";

export const useSearchProducts = ({ search, branchId, limit = 20, offset }) => {
  return useQuery({
    queryKey: ["products", search, branchId, limit, offset],
    queryFn: () => searchProducts({ search, branchId, limit, offset }),
    enabled: !!search && !!branchId, // solo cuando estén definidos
  });
};
