import { AxiosInitializer } from "..";

export const createVoucher = async (data) => {
  const response = await AxiosInitializer.post("/voucher", data);
  return response.data;
};

export const searchVoucher = async (params) => {
  const response = await AxiosInitializer.get(`/voucher/search`, {
    params,
  });
  return response.data;
};

export const registerPayment = async (data) => {
  const response = await AxiosInitializer.post(
    "/voucher/register-payment",
    data
  );
  return response.data;
};

export const searchReservedVouchers = async (params) => {
  const response = await AxiosInitializer.get(`/voucher/reserved`, {
    params,
  });
  return response.data;
};

export const updateReservedStatus = async ({ id, isReserved }) => {
  const response = await AxiosInitializer.patch(
    `/voucher/reserved-update/${id}`,
    { isReserved }
  );
  return response.data;
};
