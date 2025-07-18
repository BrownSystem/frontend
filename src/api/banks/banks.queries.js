// api/banks/banks.queries.js
import { useQuery } from "@tanstack/react-query";
import { getAllBanks } from "./banks.api";

export const useBanks = () => {
  return useQuery({
    queryKey: ["banks"],
    queryFn: getAllBanks,
  });
};
