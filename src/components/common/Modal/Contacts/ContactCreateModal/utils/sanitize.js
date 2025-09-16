const apiTypeMap = {
  cliente: "CLIENT",
  proveedor: "SUPPLIER",
  vendedor: "SELLER", // 👈 agregamos soporte real
};

export const sanitizeContactData = (contact, tipo, branchId) => {
  return Object.fromEntries(
    Object.entries({
      ...contact,
      type: apiTypeMap[tipo] || "CLIENT", // fallback por si viene algo raro
      available: true,
      branchId,
    }).filter(
      ([_, value]) => value !== "" && value !== null && value !== undefined
    )
  );
};
