// notifications.js

export const notifyVoucher = ({
  payload,
  data,
  setUser,
  numeroGenerado,
  notify,
}) => {
  const sendNotification = (branchId, message) => {
    notify({
      branchId: `${branchId}`,
      type: "PRODUCT_TRANSFER",
      title: `Nuevo comprobante generado: ${numeroGenerado?.number}`,
      message,
    });
  };

  const { type, emissionBranchId, emissionBranchName } = payload;
  const count = data?.productos.length ?? 0;

  // Mensajes principales según el tipo de comprobante
  const mensajes = {
    DEFAULT: (c) => `Se registró la salida de ${c} producto(s).`,
    REMITO: (c) => `Se registró la entrega de ${c} producto(s).`,
    FACTURA: (c, branch) =>
      `Se incorporaron ${c} producto(s) en la sucursal ${branch}.`,
    NOTA_CREDITO: (c) => `Se restituyeron ${c} producto(s) al inventario.`,
  };

  // Mensajes secundarios (para la otra sucursal)
  const mensajesSecundarios = {
    DEFAULT: (c, branch) =>
      `Se registró la salida de ${c} producto(s) correspondientes a la sucursal ${branch}.`,
    REMITO: (c, branch) =>
      `Se registró la recepción de ${c} producto(s) provenientes de la sucursal ${branch}.`,
    FACTURA: (c, branch) =>
      `Se acreditaron ${c} producto(s) pertenecientes a la sucursal ${branch}.`,
    NOTA_CREDITO: (c, branch) =>
      `Se anuló el comprobante y se devolvieron ${c} producto(s) correspondientes a la sucursal ${branch}.`,
  };

  // Determinamos el tipo de mensaje
  let tipoMensaje = "DEFAULT";
  if (type === "REMITO") tipoMensaje = "REMITO";
  else if (type === "FACTURA") tipoMensaje = "FACTURA";
  else if (type === "NOTA_CREDITO_PROVEEDOR" || type === "NOTA_CREDITO_CLIENTE")
    tipoMensaje = "NOTA_CREDITO";

  // Notificación principal
  sendNotification(
    emissionBranchId,
    mensajes[tipoMensaje](count, emissionBranchName)
  );

  // Notificación secundaria (si corresponde)
  if (emissionBranchId !== setUser.branchId) {
    sendNotification(
      setUser.branchId,
      mensajesSecundarios[tipoMensaje](count, emissionBranchName)
    );
  }
};
