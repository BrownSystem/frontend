import { searchContacts } from "./contacts.api";

export const useSearchContacts = ({ search, branchId, type, limit = 6, offset }) => {
  return useQuery({
    queryKey: ["contacts", search, branchId, type, limit, offset],
    queryFn: () => searchContacts({ search, branchId, type, limit, offset }),
    enabled: !!search && !!branchId && !!type, // solo cuando estén definidos
  });
};