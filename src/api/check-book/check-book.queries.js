// api/banks/banks.queries.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteCheckBook, getAllCheckBook } from "./check-book.api";

export const useCheckBook = () => {
  return useQuery({
    queryKey: ["check-book"],
    queryFn: getAllCheckBook,
  });
};

export const useDeleteCheckBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCheckBook,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["check-book"] }),
  });
};
