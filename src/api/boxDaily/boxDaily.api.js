import { AxiosInitializer } from "..";

export const findAllBoxDaily = async (params) => {
  const response = await AxiosInitializer.get(`/box-daily`, {
    params,
  });
  return response.data;
};

export const getOneBoxDaily = async (id) => {
  const response = await AxiosInitializer.get(`/box-daily/id/${id}`);
  return response.data;
};

export const openBoxDaily = async (data) => {
  const response = await AxiosInitializer.post("/box-daily/open", data);
  return response.data;
};

export const closedBoxDaily = async (data) => {
  const { id, ...rest } = data;
  const response = await AxiosInitializer.patch(
    `/box-daily/closed/${id}`,
    rest
  );
  return response.data;
};

export const reopenBoxDaily = async (data) => {
  const { id, ...rest } = data;
  const response = await AxiosInitializer.patch(
    `/box-daily/reopen/${id}`,
    rest
  );
  return response.data;
};

export const deleteTransaction = async ({ id }) => {
  const response = await AxiosInitializer.delete(`/transaction/${id}`);
  return response.data;
};

// ANALISIS DE DATOS
// gastos
export const boxDailyAnalysisByExpenses = async (params) => {
  const response = await AxiosInitializer.get(`/box-daily/expenses`, {
    params,
  });
  return response.data;
};
