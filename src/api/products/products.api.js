import { AxiosInitializer } from "..";

export const searchProducts = async ({
  search,
  branchId,
  limit = 6,
  offset,
}) => {
  const params = {
    branchId,
    limit,
    offset,
    ...(search?.trim() ? { search: search.trim() } : {}), // no enviar search vacío
  };

  const response = await AxiosInitializer.get("/products/search", { params });
  return response.data;
};

export const downloadPdfQrs = async ({ products }) => {
  const response = await AxiosInitializer.post(
    "/products/download-pdf-qrs",
    { products },
    { responseType: "blob" } // importante para archivos binarios
  );

  // Crear un blob y generar la descarga
  const url = window.URL.createObjectURL(
    new Blob([response.data], { type: "application/pdf" })
  );
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "qrs-productos.pdf"); // nombre del archivo
  document.body.appendChild(link);
  link.click();

  // Limpieza
  link.remove();
  window.URL.revokeObjectURL(url);
};
