import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

export const usePaginatedTableReservationData = ({
  fetchFunction,
  queryKeyBase,
  search = "",
  additionalParams = {},
  limit = 6,
  enabled = true,
}) => {
  const [offset, setOffset] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setOffset(1); // Reinicia la paginación con cada nueva búsqueda
    }, 400);
    return () => clearTimeout(timeout);
  }, [search]);

  const isEnabled = Boolean(enabled);

  const query = useQuery({
    queryKey: [queryKeyBase, debouncedSearch, limit, offset, additionalParams],
    queryFn: () => {
      const params = {
        search: debouncedSearch,
        limit,
        offset,
        ...additionalParams,
      };
      return fetchFunction(params);
    },
    enabled: isEnabled,
    keepPreviousData: true,
  });
  return {
    data: query.data?.data || [],
    offset,
    setOffset,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    totalPages: query.data?.lastPage || 1,
    debouncedSearch,
  };
};
