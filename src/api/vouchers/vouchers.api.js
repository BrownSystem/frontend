import { AxiosInitializer } from "..";

export const createVoucher = async (data) => {
  const response = await AxiosInitializer.post("/voucher", data);
  return response.data;
};

export const searchVoucher = async (params) => {
  const response = await AxiosInitializer.get(`/voucher/search`, {
    params,
    disableLoader: true,
  });
  return response.data;
};

export const salesVoucherByBranch = async (params) => {
  const response = await AxiosInitializer.get(`/voucher/sales-by-branch`, {
    params,
    disableLoader: false,
  });
  return response.data;
};

export const salesMonthlyVoucherByBranch = async (params) => {
  const response = await AxiosInitializer.get(
    `/voucher/sales-monthly-by-branch`,
    {
      params,
      disableLoader: false,
    }
  );
  return response.data;
};

export const searchVoucherByContact = async (params) => {
  const response = await AxiosInitializer.get(`/voucher/search-by-contact`, {
    params,
    disableLoader: true,
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

export const getOneVoucher = async (id) => {
  const response = await AxiosInitializer.get(`/voucher/one/${id}`);
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

export const deleteVoucher = async ({ id, typeOfDelete }) => {
  const response = await AxiosInitializer.post(
    `/voucher/delete-product/${id}`,
    {
      typeOfDelete,
    }
  );
  return response.data;
};

export const deletePayment = async ({ paymentId }) => {
  const response = await AxiosInitializer.delete(
    `/voucher/delete-payment/${paymentId}`
  );
  return response.data;
};
