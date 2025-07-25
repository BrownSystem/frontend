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
  const { id, ...payload } = data; // Sacamos 'id' del objeto

  const response = await AxiosInitializer.patch(
    `/branch/update/${id}`,
    payload // Enviamos el resto del objeto sin 'id'
  );

  return response.data;
};
