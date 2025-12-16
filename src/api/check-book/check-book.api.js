// api/banks/banks.api.js

import { AxiosInitializer } from "..";

export const getAllCheckBook = async () => {
  const response = await AxiosInitializer.get("/check-book");
  return response.data;
};

export const deleteCheckBook = async (id) => {
  const response = await AxiosInitializer.delete(`/check-book/delete/${id}`);
  return response.data;
};
