export const shouldShowAmountCard = (tipo, label, total, paid, remaining) => {
  switch (tipo) {
    case "REMITO":
      return false; // nunca mostrar

    case "NOTA_CREDITO_CLIENTE":
    case "NOTA_CREDITO_PROVEEDOR":
      return label === "TOTAL"; // solo TOTAL

    case "FACTURA":
    case "P":
      if (label === "TOTAL") {
        if (total === 0) return true; // solo TOTAL
        return paid > 0 || total > 0;
      }
      if (label === "ABONADO") return paid > 0;
      if (label === "SALDO") return remaining > 0 && total > 0;
      return false;

    default:
      return false;
  }
};
