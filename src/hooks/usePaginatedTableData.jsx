import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

export const usePaginatedTableData = ({
  fetchFunction,
  queryKeyBase,
  search,
  branchId,
  additionalParams = {},
  limit = 6,
  enabled = true,
}) => {
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const offset = page;
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timeout);
  }, [search]);

  const isEnabled = Boolean(enabled);

  const query = useQuery({
    queryKey: [
      queryKeyBase,
      debouncedSearch,
      branchId,
      limit,
      offset,
      additionalParams,
    ],
    queryFn: () =>
      fetchFunction({
        search: debouncedSearch,
        branchId,
        limit,
        offset,
        ...additionalParams,
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

export const usePaginatedTableBoxDailyData = ({
  fetchFunction,
  queryKeyBase,
  branchId,
  additionalParams = {},
  limit = 6,
  enabled = true,
}) => {
  const [page, setPage] = useState(1);
  const offset = page;

  const isEnabled = Boolean(enabled);

  const query = useQuery({
    queryKey: [queryKeyBase, branchId, limit, offset, additionalParams],
    queryFn: () =>
      fetchFunction({
        branchId,
        limit,
        offset,
        ...additionalParams,
      }),
    enabled: isEnabled,
    keepPreviousData: true,
  });

  return {
    data: query.data || [],
    page,
    setPage,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    totalPages: Math.max(1, Math.ceil(query.data?.meta?.total / limit)) || 1,
    offset,
  };
};
