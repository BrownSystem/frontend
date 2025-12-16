import { AxiosInitializer } from "..";

export const createBoxCategory = async (data) => {
  const response = await AxiosInitializer.post("/box-category", data);
  return response.data;
};

export const getAllBoxCategory = async () => {
  const response = await AxiosInitializer.get("/box-category");
  return response.data;
};

export const getOneBoxCategory = async (id) => {
  const response = await AxiosInitializer.get(`/box-category/${id}`);
  return response.data;
};
