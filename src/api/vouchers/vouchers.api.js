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

export const downloadVoucherHtml = async (id) => {
  const response = await AxiosInitializer.get(`/voucher/html/${id}`);
  return response.data; // devuelve string HTML
};

export const generateVoucherNumber = async (data) => {
  const response = await AxiosInitializer.post(
    "/voucher/generate-number",
    data
  );
  return response.data;
};
