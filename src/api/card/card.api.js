import { AxiosInitializer } from "..";

export const createCard = async (data) => {
  const response = await AxiosInitializer.post("/card", data);
  return response.data;
};

export const getAllCard = async () => {
  const response = await AxiosInitializer.get("/card");
  return response.data;
};

export const getOneCard = async (id) => {
  const response = await AxiosInitializer.get(`/card/${id}`);
  return response.data;
};

export const updateCard = async (id, data) => {
  const response = await AxiosInitializer.patch(`/card/${id}`, data);
  return response.data;
};
