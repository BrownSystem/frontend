import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContact, searchContacts } from "./contacts.api";

export const useSearchContacts = ({
  search,
  branchId,
  type,
  limit = 6,
  offset = 0,
}) => {
  return useQuery({
    queryKey: ["contacts", search?.trim(), branchId, type, limit, offset],
    queryFn: () => searchContacts({ search, branchId, type, limit, offset }),
    enabled: !!branchId && offset >= 0,
    keepPreviousData: true, // mantiene los datos anteriores mientras se carga la nueva página
  });
};

export const useCreateContact = ({ onSuccess }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createContact,
    onSuccess: (data) => {
      // Refrescar la cache de contactos
      queryClient.invalidateQueries({ queryKey: ["contacts"] });

      // Callback opcional
      if (onSuccess) onSuccess(data);
    },
  });
};
