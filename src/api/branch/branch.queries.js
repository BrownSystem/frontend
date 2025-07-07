import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createBranch, findAllBranch, updateBranch } from "./branch.api";

export const useFindAllBranch = () => {
  return useQuery({
    queryKey: ["branch"],
    queryFn: findAllBranch,
    staleTime: 1000 * 60 * 5, // cache por 5 minutos
    refetchOnWindowFocus: false,
  });
};

export const useCreateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBranch,
    onSuccess: () => {
      queryClient.invalidateQueries(["branch"]);
    },
  });
};

export const useUpdateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBranch,
    onSuccess: () => {
      queryClient.invalidateQueries(["branch"]);
    },
  });
};
