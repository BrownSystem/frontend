import React from "react";
import { Download } from "../../../assets/icons";
import { useDownloadVoucherHtml } from "../../../api/vouchers/vouchers.queries";
import html2pdf from "html2pdf.js";

const InvoiceModal = ({ onCancel, onConfirm, factura, productos, pago }) => {
  const { mutate: descargarHtml } = useDownloadVoucherHtml();

  const handleDescargarPDF = () => {
    if (!factura?.id) return;

    descargarHtml(factura.id, {
      onSuccess: (html) => {
        const container = document.createElement("div");
        container.innerHTML = html;

        html2pdf()
          .set({
            margin: 0.5,
            filename: `comprobante-${factura.numero}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
          })
          .from(container)
          .save();
      },
      onError: () => {
        setMessage({
          text: "No se pudo generar el comprobante ❌",
          type: "error",
        });
      },
    });
  };

  const calcularSubtotal = (p) => p.precio * p.cantidad;
  const total = productos.reduce((acc, p) => acc + calcularSubtotal(p), 0);

  return (
    <div className="fixed inset-0 bg-[var(--brown-ligth-400)]/30 flex items-center justify-center z-[9999] p-6">
      <div className="bg-[#fdfaf6] rounded-3xl shadow-2xl w-full max-w-[950px] p-8 border border-[#e4d7c5]">
        <div className="grid grid-cols-2 gap-8">
          {/* Columna izquierda */}
          <div className="flex flex-col gap-6">
            {/* Encabezado */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-[var(--brown-dark-800)] text-white p-3 rounded-xl shadow-md flex items-center justify-center">
                  <i className="fas fa-warehouse text-xl"></i>
                </div>
                <div className="text-[var(--brown-dark-900)] font-bold text-lg">
                  COMPROBANTE ({factura?.tipo ?? "—"}) N°:{" "}
                  <span className="text-[var(--brown-ligth-400)]">
                    {factura?.numero ?? "—"}
                  </span>
                </div>
              </div>
              <div className="text-[var(--brown-dark-900)] font-semibold">
                FECHA:{" "}
                <span className="text-[var(--brown-ligth-400)]">
                  {factura?.fecha ?? "—"}
                </span>
              </div>
            </div>

            {/* Origen y destino */}
            <div className="bg-[var(--brown-ligth-100)] rounded-lg p-4 border border-[var(--brown-ligth-200)] shadow-inner">
              <p className="font-semibold text-[var(--brown-dark-950)] text-md">
                {factura?.tipo === "FACTURA"
                  ? factura?.cliente ?? "—"
                  : factura?.origen ?? "—"}
              </p>
              <p className="text-[var(--brown-dark-950)] mt-1">
                {factura?.tipo === "FACTURA"
                  ? factura?.origen ?? "—"
                  : factura?.cliente ?? "—"}
                {factura?.tipo === "REMITO" ? factura?.destino : ""}
                {factura?.direccion && (
                  <span className="text-[var(--brown-ligth-400)]">
                    {" "}
                    ({factura.direccion})
                  </span>
                )}
              </p>
            </div>

            {/* Detalles del pago */}
            <div className="bg-[var(--brown-ligth-50)] border border-[var(--brown-ligth-200)] rounded-xl p-5 shadow-sm">
              <h3 className="font-bold text-[var(--brown-dark-900)] mb-3 text-lg">
                Detalles del Pago
              </h3>
              <div className="flex flex-col gap-2 text-[var(--brown-dark-950)] text-sm">
                <p>
                  <strong>Fecha de Pago:</strong> {pago?.fechaPago ?? "—"}
                </p>
                <p>
                  <strong>Forma de Pago:</strong> {pago?.formaDePago ?? "—"}
                </p>
                <p className="text-green-700 font-semibold">
                  Monto Pagado: $
                  {(pago?.montoPagado ?? 0).toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <p className="text-red-600 font-semibold">
                  Saldo Restante: $
                  {(pago?.saldoRestante ?? 0).toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <p>
                  <strong>Observaciones:</strong> {pago?.observaciones ?? "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Columna derecha - Productos y totales */}
          <div className="flex flex-col justify-between h-full">
            <div className="overflow-y-auto max-h-[450px] pr-2">
              <table className="w-full text-left text-md border-collapse">
                <thead>
                  <tr className="bg-[var(--brown-ligth-200)] rounded-lg text-[var(--brown-dark-900)]">
                    <th className="py-3 px-2 text-left">Producto</th>
                    <th className="py-3 px-2 text-center">Cantidad</th>
                    <th className="py-3 px-2 text-center">Precio</th>
                    <th className="py-3 px-2 text-center">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {(productos ?? []).map((p, i) => (
                    <tr
                      key={i}
                      className="border-b border-[var(--brown-ligth-200)] hover:bg-[var(--brown-ligth-50)] transition-colors"
                    >
                      <td className="py-2 px-2 font-medium text-[var(--brown-dark-950)]">
                        {p.codigo}
                        <div className="text-[var(--brown-ligth-500)] text-sm">
                          {p.descripcion ?? "—"}
                        </div>
                      </td>
                      <td className="py-2 text-center">{p.cantidad}</td>
                      <td className="py-2 text-center">
                        $
                        {(p.precio ?? 0).toLocaleString("es-AR", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="py-2 text-center font-semibold">
                        $
                        {calcularSubtotal(p).toLocaleString("es-AR", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total y botones */}
            <div className="flex justify-between items-center mt-4">
              <p className="font-bold text-[var(--brown-dark-900)] text-xl">
                Total:{" "}
                <span className="text-green-700 text-[20px]">
                  $
                  {total.toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  className="bg-[var(--brown-dark-800)] text-white px-5 py-2 rounded-xl hover:bg-[var(--brown-dark-700)] transition-colors"
                >
                  Cerrar
                </button>
                <button
                  onClick={handleDescargarPDF}
                  className="bg-[var(--brown-dark-500)] text-white px-5 py-2 rounded-xl hover:bg-[var(--brown-dark-700)] flex items-center gap-2 transition-colors"
                >
                  <Download />
                  Descargar PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
