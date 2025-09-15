import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createContact,
  findOneContact,
  searchContacts,
  updateContact,
} from "./contacts.api";

export const useSearchContacts = ({
  search,
  branchId,
  type,
  limit = 6,
  offset = 0,
}) => {
  return useQuery({
    queryKey: ["contacts", search?.trim(), branchId, type, limit, offset],
    queryFn: () =>
      searchContacts({
        search,
        branchId: branchId || undefined, // 👈 importante
        type,
        limit,
        offset,
      }),
    enabled: offset >= 0, // 👈 ya no depende de branchId
    keepPreviousData: true,
  });
};

export const useCreateContact = ({ onSuccess, onError }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createContact,
    onSuccess: (data) => {
      // Refrescar la cache de contactos
      queryClient.invalidateQueries({ queryKey: ["contacts"] });

      // Callback opcional
      if (onSuccess) onSuccess(data);
    },
    onError: (error) => {
      if (onError) onError(error);
    },
  });
};

export const useFindOneContact = (
  id,
  { enabled = !!id, onSuccess, onError } = {}
) => {
  return useQuery({
    queryKey: ["contacts", id],
    queryFn: () => findOneContact(id),
    enabled, // solo ejecuta si hay id
    onSuccess,
    onError,
  });
};

export const useUpdateContact = ({ onSuccess, onError }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, contactData }) => updateContact(id, contactData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      if (onSuccess) onSuccess(data);
    },
    onError: (error) => {
      if (onError) onError(error);
    },
  });
};
