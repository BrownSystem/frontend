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
    <div className="fixed inset-0 bg-[var(--brown-ligth-400)]/20 flex items-center justify-center z-50 top-8">
      <div className="bg-[#fefcf9] rounded-2xl shadow-lg w-[900px] p-6 border border-[#e0d2bb]">
        <div className="grid grid-cols-2 gap-6">
          {/* Columna izquierda */}
          <div className="flex flex-col gap-4 mt-3">
            {/* Encabezado */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="bg-[#302f2d] text-white p-2 rounded-lg">
                  <i className="fas fa-warehouse"></i>
                </div>
                <span className="font-bold text-[var(--brown-dark-800)]">
                  COMPROBANTE ({factura?.tipo ?? "—"}) N°:{" "}
                  <span className="text-[var(--brown-ligth-400)]">
                    {factura?.numero ?? "—"}
                  </span>
                </span>
              </div>
              <span className="font-bold text-[var(--brown-dark-800)]">
                FECHA:{" "}
                <span className="text-[var(--brown-ligth-400)]">
                  {factura?.fecha ?? "—"}
                </span>
              </span>
            </div>

            {/* Origen y destino */}
            <div className="text-md">
              <p className="font-semibold text-[var(--brown-dark-950)]">
                {factura?.origen ?? "—"}
              </p>
              <p className="text-[var(--brown-dark-950)]">
                {factura?.cliente ?? "—"}
                {factura?.direccion && (
                  <span className="text-[var(--brown-ligth-400)]">
                    {" "}
                    ({factura.direccion})
                  </span>
                )}
              </p>
            </div>

            {/* Detalles del pago */}
            <div className="bg-[var(--brown-ligth-100)] border border-[var(--brown-ligth-200)] rounded-md p-4 flex flex-col">
              <h3 className="font-semibold text-[var(--brown-dark-900)] mb-2">
                Detalles del Pago
              </h3>
              <div className="flex flex-col gap-1 text-[var(--brown-dark-950)] text-sm">
                <p>
                  <strong>Fecha de Pago:</strong> {pago?.fechaPago ?? "—"}
                </p>
                <p>
                  <strong>Forma de Pago:</strong> {pago?.formaDePago ?? "—"}
                </p>
                <p className="text-green-700">
                  <strong className="text-[var(--brown-dark-950)]">
                    Monto Pagado:
                  </strong>{" "}
                  $
                  {(pago?.montoPagado ?? 0).toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <p className="text-red-700">
                  <strong className="text-[var(--brown-dark-950)]">
                    Saldo Restante:
                  </strong>{" "}
                  $
                  {(pago?.saldoRestante ?? 0).toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <p>
                  <strong>Banco / Medio:</strong> {pago?.banco ?? "—"}
                </p>
                <p>
                  <strong>Nº de Operación:</strong>{" "}
                  {pago?.numeroOperacion ?? "—"}
                </p>
                <p className="col-span-2">
                  <strong>Observaciones:</strong> {pago?.observaciones ?? "—"}
                </p>
                <p className="col-span-2">
                  <strong>Registrado por:</strong> {pago?.registradoPor ?? "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Columna derecha - Productos y totales */}
          <div className="flex flex-col justify-between h-full">
            <div>
              <table className="w-full text-left text-md mb-4">
                <thead>
                  <tr className="border-b border-[#ddd] grid grid-cols-4 items-center">
                    <th className="py-2 text-[var(--brown-dark-950)]">
                      Producto
                    </th>
                    <th className="py-2 text-center text-[var(--brown-dark-950)]">
                      Cantidad
                    </th>
                    <th className="py-2 text-center text-[var(--brown-dark-950)]">
                      Precio
                    </th>
                    <th className="py-2 text-center text-[var(--brown-dark-950)]">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(productos ?? []).map((p, i) => (
                    <tr
                      key={i}
                      className="border-b border-[#eee] grid grid-cols-4 items-center"
                    >
                      <td className="py-2">
                        <div className="font-medium text-[var(--brown-dark-950)]">
                          {p.codigo ?? "—"}
                        </div>
                        <div className="text-[var(--brown-ligth-500)]">
                          {p.descripcion ?? "—"}
                        </div>
                      </td>
                      <td className="py-2 text-right text-[var(--brown-dark-950)]">
                        <p className="flex justify-center">{p.cantidad}</p>
                      </td>
                      <td className="py-2 text-center text-[var(--brown-dark-950)]">
                        $
                        {(p.precio ?? 0).toLocaleString("es-AR", {
                          minimumFractionDigits: 2,
                        })}
                      </td>

                      <td className="py-2 text-center text-[var(--brown-dark-950)]">
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
            <div className="flex justify-between items-center mt-2">
              <p className="font-medium text-[var(--brown-dark-950)] text-lg">
                Total:{" "}
                <span className="text-green-700 text-[18px] font-medium">
                  $
                  {total.toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={onCancel}
                  className="bg-[#1a1a1a] text-white px-4 py-2 rounded-md hover:bg-[var(--brown-ligth-400)] cursor-pointer"
                >
                  Cerrar
                </button>
                <button
                  onClick={handleDescargarPDF}
                  className="bg-[var(--brown-dark-700)] text-white px-4 py-2 rounded-md hover:bg-[var(--brown-dark-800)] flex gap-1 cursor-pointer"
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
