import { AxiosInitializer } from "..";

export const createProduct = async (product) => {
  const response = await AxiosInitializer.post("/products", product);
  return response.data;
};

export const searchProducts = async ({
  search,
  branchId,
  limit = 150,
  offset,
  filterbystock,
}) => {
  const params = {
    branchId,
    limit,
    offset,
    ...(search?.trim() ? { search: search.trim() } : {}),
    ...(filterbystock !== undefined ? { filterbystock } : {}), // no enviar search vacío
  };

  const response = await AxiosInitializer.get("/products/search", { params });
  return response.data;
};

export const searchProductsByBranches = async ({
  search,
  limit = 200,
  offset,
  filterbystock,
}) => {
  const params = {
    limit,
    offset,
    ...(search?.trim() ? { search: search.trim() } : {}),
    ...(filterbystock !== undefined ? { filterbystock } : {}), // no enviar search vacío
  };

  const response = await AxiosInitializer.get("/products/by-branches", {
    params,
  });
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

export const downloadPdfProducts = async ({ products }) => {
  const response = await AxiosInitializer.post(
    "/products/download-pdf-products",
    { products },
    { responseType: "blob" } // importante para archivos binarios
  );

  // Crear un blob y generar la descarga
  const url = window.URL.createObjectURL(
    new Blob([response.data], { type: "application/pdf" })
  );
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "catalogo-productos.pdf"); // nombre del archivo
  document.body.appendChild(link);
  link.click();

  // Limpieza
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const uploadProducts = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await AxiosInitializer.post("/products/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

export const updateProduct = async (product) => {
  const { id, ...rest } = product;
  const response = await AxiosInitializer.patch(`/products/update/${id}`, rest);
  return response.data;
};
