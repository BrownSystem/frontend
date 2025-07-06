import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

export const usePaginatedTableData = ({
  fetchFunction,
  queryKeyBase,
  search = "",
  branchId,
  limit = 6,
  enabled = true,
}) => {
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const offset = (page - 1) * limit + 1;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timeout);
  }, [search]);

  const isEnabled = Boolean(enabled) && Boolean(branchId);

  const query = useQuery({
    queryKey: [queryKeyBase, debouncedSearch, branchId, limit, offset],
    queryFn: () =>
      fetchFunction({
        search: debouncedSearch,
        branchId,
        limit,
        offset,
      }),
    enabled: isEnabled,
    keepPreviousData: true,
  });

  return {
    data: query.data?.data || [],
    page,
    setPage,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    totalPages: Math.max(1, Math.ceil(query.data?.meta?.total / limit)) || 1,
    offset,
    debouncedSearch,
  };
};
