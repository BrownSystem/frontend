// api/banks/banks.api.js

import { AxiosInitializer } from "..";

export const createBank = async (data) => {
  const response = await AxiosInitializer.post("/banks", data);
  return response.data;
};

export const getAllBanks = async () => {
  const response = await AxiosInitializer.get("/banks");
  return response.data;
};
