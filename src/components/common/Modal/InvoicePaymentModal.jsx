import React, { useState } from "react";
import { Close, Danger } from "../../../assets/icons";
import {
  useDownloadVoucherHtml,
  useRegisterPayment,
} from "../../../api/vouchers/vouchers.queries";
import { Message } from "../../dashboard/widgets";
import { useBanks } from "../../../api/banks/banks.queries";
import html2pdf from "html2pdf.js";

const InvoicePaymentModal = ({
  factura,
  onClose,
  onRegistrarPago = console.log,
}) => {
  const [monto, setMonto] = useState(0);
  const [metodo, setMetodo] = useState("Efectivo");
  const [datosPago, setDatosPago] = useState({});
  const [message, setMessage] = useState({ text: "", type: "success" });
  const { mutate: descargarHtml } = useDownloadVoucherHtml();

  const { data: banks } = useBanks();

  const { mutate, isLoading } = useRegisterPayment({
    onSuccess: (data) => {
      setMessage({ text: "Pago registrado correctamente ✅", type: "success" });
      // Cierre de modal, reset de estado, etc.
    },
    onError: (error) => {
      setMessage({
        text: error.message || "Ocurrió un error al registrar el pago ❌",
        type: "error",
      });
    },
  });

  const handleDescargarPDF = () => {
    if (!factura?.id) return;

    descargarHtml(factura.id, {
      onSuccess: (html) => {
        const container = document.createElement("div");
        container.innerHTML = html;

        html2pdf()
          .set({ filename: `comprobante-${factura.numero}.pdf` })
          .from(container)
          .save();
      },
      onError: () => {
        setMessage({
          text: "Error al generar el comprobante ❌",
          type: "error",
        });
      },
    });
  };

  const handleSubmit = () => {
    if (monto > factura.saldoPendiente || !monto) {
      return setMessage({ text: "El monto no es válido ❌", type: "error" });
    }

    const nuevoPago = {
      method:
        metodo === "Efectivo"
          ? "EFECTIVO"
          : metodo === "Transferencia"
          ? "TRANSFERENCIA"
          : "CHEQUE",
      amount: parseFloat(monto),
      currency: "ARS",
      bankId:
        metodo === "Transferencia" || metodo === "Cheque de terceros"
          ? datosPago.banco ?? undefined
          : undefined,
      chequeNumber:
        metodo === "Cheque de terceros"
          ? datosPago.numero ?? undefined
          : undefined,
      chequeDueDate:
        metodo === "Cheque de terceros" && datosPago.fecha
          ? new Date(datosPago.fecha).toISOString()
          : undefined,
      chequeStatus: metodo === "Cheque de terceros" ? "PENDIENTE" : undefined,
      observation: datosPago.observaciones ?? undefined,
      receivedAt: new Date().toISOString(),
      voucherId: factura.id,
    };

    mutate(nuevoPago);
  };

  const handleInputChange = (e) => {
    setDatosPago({ ...datosPago, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed z-[1000000] inset-0 flex gap-4 justify-center items-start bg-[var(--brown-dark-700)]/20 bg-opacity-30 px-4">
      <Message
        message={message.text}
        type={message.type}
        duration={3000}
        onClose={() => setMessage({ text: "" })}
      />
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-lg mt-[5rem]">
        <h2 className="text-xl font-bold text-[var(--brown-dark-950)] flex justify-between items-start">
          <span>
            Pago de factura: {factura.numero}
            <span className="ml-3 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
              {factura.vencimiento}
            </span>
          </span>
          <span className="cursor-pointer" onClick={onClose}>
            <Close />
          </span>
        </h2>

        <div className="text-[var(--brown-dark-700)] mb-2">
          <p className="font-semibold">{factura.proveedor}</p>
        </div>

        <div className="text-sm mb-4 space-y-1">
          <p>Monto total: ${factura.total.toFixed(2)}</p>
          <p className="text-green-700">
            Monto abonado: ${factura.abonado.toFixed(2)}
          </p>
          <p>
            Saldo pendiente:{" "}
            <span className="text-red-700">
              ${(factura.total - factura.abonado - (monto || 0)).toFixed(2)}
            </span>
          </p>
        </div>

        {factura.pagosAnteriores?.length > 0 && (
          <div className="mb-4">
            <p className="font-semibold text-[var(--brown-dark-950)] mb-1">
              Pagos anteriores:
            </p>
            <ul className="text-sm list-disc ml-4 space-y-1">
              {factura.pagosAnteriores.map((p, i) => (
                <li key={i}>
                  {p.fecha}:
                  <span className="text-green-700"> ${p.monto.toFixed(2)}</span>{" "}
                  (
                  <span className="text-[var(--brown-dark-700)]">
                    {p.metodo}
                  </span>
                  {p.banco && (
                    <span className="text-sm text-gray-700">
                      , {p.banco} - {p.numeroOperacion}
                    </span>
                  )}
                  )
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mb-4 relative">
          <label className="block font-semibold mb-1 text-[var(--brown-dark-950)]">
            Monto a abonar
          </label>
          <input
            type="number"
            className="w-full p-2 border border-[var(--brown-dark-500)] rounded"
            placeholder="Monto a abonar"
            value={monto}
            onChange={(e) => setMonto(parseFloat(e.target.value))}
          />
          {monto > factura.saldoPendiente && (
            <span className="pt-1 absolute z-[1000] left-[400px] top-8">
              <Danger color={"#411907"} />
            </span>
          )}
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1 text-[var(--brown-dark-950)]">
            Método de pago
          </label>
          <div className="flex gap-2 mb-2">
            {["Efectivo", "Transferencia", "Cheque de terceros"].map((m) => (
              <button
                key={m}
                className={`px-3 py-1 rounded-lg border ${
                  metodo === m
                    ? "bg-[var(--brown-dark-800)] text-white"
                    : "bg-white text-[var(--brown-dark-800)]"
                }`}
                onClick={() => setMetodo(m)}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {metodo === "Transferencia" && (
            <>
              <select
                name="banco"
                className="w-full p-2 border rounded border-[var(--brown-dark-500)]"
                onChange={handleInputChange}
              >
                <option value="">Selecciona el banco</option>
                {banks?.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                )) || <option value="">Cargando bancos...</option>}
              </select>
              <input
                name="numeroOperacion"
                placeholder="Número de operación"
                className="w-full p-2 border rounded border-[var(--brown-dark-500)]"
                onChange={handleInputChange}
              />
            </>
          )}

          {metodo === "Cheque de terceros" && (
            <>
              <input
                name="numero"
                placeholder="Número de cheque"
                className="w-full p-2 border rounded border-[var(--brown-dark-500)]"
                onChange={handleInputChange}
              />
              <input
                name="banco"
                placeholder="Banco"
                className="w-full p-2 border rounded border-[var(--brown-dark-500)]"
                onChange={handleInputChange}
              />
              <input
                name="titular"
                placeholder="Titular / CUIT"
                className="w-full p-2 border rounded border-[var(--brown-dark-500)]"
                onChange={handleInputChange}
              />
              <input
                name="fecha"
                type="date"
                className="w-full p-2 border rounded border-[var(--brown-dark-500)]"
                onChange={handleInputChange}
              />
            </>
          )}

          <textarea
            name="observaciones"
            placeholder="Observaciones (opcional)"
            className="w-full p-2 border rounded border-[var(--brown-dark-500)]"
            onChange={handleInputChange}
          />
        </div>

        <button
          onClick={handleSubmit}
          className={`bg-[var(--brown-dark-800)] text-white px-4 py-2 rounded w-full hover:opacity-50 cursor-pointer ${
            monto > factura.saldoPendiente
              ? "opacity-50 !hover:opacity-50 !cursor-not-allowed"
              : ""
          }`}
          disabled={monto > factura.saldoPendiente}
        >
          {monto > factura.saldoPendiente
            ? "Monto mayor al saldo adeudado."
            : "Registrar pago"}
        </button>
        <button
          onClick={handleDescargarPDF}
          className="mt-3 bg-[#b68239] text-white px-4 py-2 rounded w-full hover:bg-[#a46f2f] flex items-center justify-center gap-2"
        >
          <i className="fas fa-download"></i> Descargar comprobante PDF
        </button>
      </div>
    </div>
  );
};

export default InvoicePaymentModal;
