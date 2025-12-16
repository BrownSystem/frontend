import { AxiosInitializer } from "..";

export const getIncomeByPaymentMethod = async (branchId) => {
  const response = await AxiosInitializer.get(
    `/transaction/get-income-by-payment-method/${branchId}`
  );
  return response.data;
};

export const expenseTransferByBranch = async (data) => {
  const response = await AxiosInitializer.post(
    "/transaction/expense-trasnfer-branch",
    data
  );
  return response.data;
};

export const expenseEmployeed = async (data) => {
  const response = await AxiosInitializer.post(
    "/transaction/expense-employeed",
    data
  );
  return response.data;
};

export const expenseByCategory = async (data) => {
  const response = await AxiosInitializer.post(
    "/transaction/expense-by-category",
    data
  );
  return response.data;
};
