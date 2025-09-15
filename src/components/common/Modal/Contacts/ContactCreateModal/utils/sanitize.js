export const sanitizeContactData = (contact, tipo, branchId) => {
  return Object.fromEntries(
    Object.entries({
      ...contact,
      type: tipo === "cliente" ? "CLIENT" : "SUPPLIER",
      available: true,
      branchId,
    }).filter(
      ([_, value]) => value !== "" && value !== null && value !== undefined
    )
  );
};
