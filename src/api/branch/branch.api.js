import { AxiosInitializer } from "..";

export const findAllBranch = async () => {
  const response = await AxiosInitializer.get("/branch");
  return response.data;
};

export const createBranch = async (data) => {
  const response = await AxiosInitializer.post("/branch", data);
  return response.data;
};

export const updateBranch = async (data) => {
  const response = await AxiosInitializer.put(`/branch/${data._id}`, data);
  return response.data;
};
