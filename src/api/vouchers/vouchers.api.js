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

export const downloadVoucherPdf = async (id) => {
  const response = await AxiosInitializer.get(`/voucher/pdf/${id}`, {
    responseType: "blob", // 🧠 Muy importante para recibir el PDF como archivo
    params: { download: true }, // Incluye el parámetro para forzar la descarga
  });

  return response.data; // Devuelve el blob
};
