import React, { useState } from "react";
import { Close, Danger } from "../../../assets/icons";
import {
  useDownloadVoucherHtml,
  useRegisterPayment,
} from "../../../api/vouchers/vouchers.queries";
import {
  FormattedAmount,
  FormattedNumberInput,
  Message,
} from "../../dashboard/widgets";
import { useBanks } from "../../../api/banks/banks.queries";
import html2pdf from "html2pdf.js";

// tus nuevos componentes
import { useForm } from "react-hook-form";

const InvoicePaymentModal = ({
  factura,
  onClose,
  onRegistrarPago = console.log,
}) => {
  const [metodo, setMetodo] = useState("Efectivo");
  const [datosPago, setDatosPago] = useState({});
  const [message, setMessage] = useState({ text: "", type: "success" });
  const { mutate: descargarHtml } = useDownloadVoucherHtml();
  const { data: banks } = useBanks();

  const { mutate, isLoading } = useRegisterPayment({
    onSuccess: () => {
      setMessage({ text: "Pago registrado correctamente ✅", type: "success" });
    },
    onError: (error) => {
      setMessage({
        text: error.message || "Ocurrió un error al registrar el pago ❌",
        type: "error",
      });
    },
  });

  // hook form
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      monto: 0,
    },
  });

  const monto = watch("monto");

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

  const onSubmit = ({ monto }) => {
    if (monto > factura.saldoPendiente || !monto) {
      return setMessage({ text: "El monto no es válido ❌", type: "error" });
    }

    const nuevoPago = {
      method:
        metodo === "Efectivo"
          ? "EFECTIVO"
          : metodo === "Transferencia"
          ? "TRANSFERENCIA"
          : metodo === "Cheque de terceros"
          ? "CHEQUE"
          : "TARJETA",
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
    <div className="fixed inset-0 z-[1000000] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <Message
        message={message.text}
        type={message.type}
        duration={3000}
        onClose={() => setMessage({ text: "" })}
      />

      <div className="bg-[var(--brown-ligth-50)] rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-fadeIn border border-[var(--brown-ligth-200)]">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[var(--brown-ligth-200)]">
          <h2 className="text-lg font-bold text-[var(--brown-dark-900)]">
            Pago factura #{factura.numero}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[var(--brown-ligth-200)] transition"
          >
            <Close />
          </button>
        </div>

        {/* Info */}
        <div className="px-6 py-4 space-y-2 text-sm text-[var(--brown-dark-800)]">
          <p className="font-semibold">{factura.proveedor}</p>

          <FormattedAmount label="Total:" value={factura.total} />
          <FormattedAmount
            label="Abonado:"
            value={factura.abonado}
            color="text-[var(--text-state-green)]"
          />
          <FormattedAmount
            label="Saldo pendiente:"
            value={factura.total - factura.abonado - (monto || 0)}
            color="text-[var(--text-state-red)]"
          />
        </div>

        {/* Pagos anteriores */}
        {factura.pagosAnteriores?.length > 0 && (
          <div className="px-6 py-3 bg-[var(--brown-ligth-100)] border-y border-[var(--brown-ligth-200)]">
            <p className="font-semibold text-[var(--brown-dark-900)] mb-2">
              Pagos anteriores
            </p>
            <ul className="text-sm text-[var(--brown-dark-700)] list-disc ml-5 space-y-1">
              {factura.pagosAnteriores.map((p, i) => (
                <li key={i}>
                  {p.fecha}:{" "}
                  <FormattedAmount
                    value={p.monto}
                    color="text-[var(--text-state-green)]"
                  />{" "}
                  ({p.metodo}
                  {p.banco && `, ${p.banco} - ${p.numeroOperacion}`})
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4 space-y-4">
          {/* Monto */}
          <div className="relative">
            <FormattedNumberInput
              name="monto"
              control={control}
              label="Monto a abonar"
              decimals={2}
              className="w-full"
            />
            {monto > factura.saldoPendiente && (
              <span className="absolute left-3 top-8">
                <Danger color={"#b91c1c"} />
              </span>
            )}
          </div>

          {/* Método */}
          <div>
            <label className="block font-semibold mb-1 text-[var(--brown-dark-900)]">
              Método de pago
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                "Efectivo",
                "Transferencia",
                "Cheque de terceros",
                "Tarjeta",
              ].map((m) => (
                <button
                  key={m}
                  type="button"
                  className={`px-3 py-1 rounded-lg border text-sm font-medium transition ${
                    metodo === m
                      ? "bg-[var(--brown-dark-800)] text-white border-[var(--brown-dark-800)]"
                      : "bg-[var(--brown-ligth-100)] border-[var(--brown-ligth-300)] text-[var(--brown-dark-700)] hover:bg-[var(--brown-ligth-200)]"
                  }`}
                  onClick={() => setMetodo(m)}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Inputs adicionales */}
          <div className="space-y-2">
            {(metodo === "Transferencia" || metodo === "Tarjeta") && (
              <>
                <select
                  name="banco"
                  className="w-full p-2 border rounded-lg bg-white border-[var(--brown-ligth-300)]"
                  onChange={handleInputChange}
                >
                  <option value="">Selecciona el banco</option>
                  {banks?.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  )) || <option value="">Cargando bancos...</option>}
                </select>
                {metodo === "Transferencia" && (
                  <input
                    name="numeroOperacion"
                    placeholder="Número de operación"
                    className="w-full p-2 border rounded-lg bg-white border-[var(--brown-ligth-300)]"
                    onChange={handleInputChange}
                  />
                )}
              </>
            )}

            {metodo === "Cheque de terceros" && (
              <>
                <input
                  name="numero"
                  placeholder="Número de cheque"
                  className="w-full p-2 border rounded-lg bg-white border-[var(--brown-ligth-300)]"
                  onChange={handleInputChange}
                />
                <input
                  name="banco"
                  placeholder="Banco"
                  className="w-full p-2 border rounded-lg bg-white border-[var(--brown-ligth-300)]"
                  onChange={handleInputChange}
                />
                <input
                  name="titular"
                  placeholder="Titular / CUIT"
                  className="w-full p-2 border rounded-lg bg-white border-[var(--brown-ligth-300)]"
                  onChange={handleInputChange}
                />
                <input
                  name="fecha"
                  type="date"
                  className="w-full p-2 border rounded-lg bg-white border-[var(--brown-ligth-300)]"
                  onChange={handleInputChange}
                />
              </>
            )}

            <textarea
              name="observaciones"
              placeholder="Observaciones (opcional)"
              className="w-full p-2 border rounded-lg bg-white border-[var(--brown-ligth-300)]"
              onChange={handleInputChange}
            />
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-[var(--brown-ligth-100)] border-t border-[var(--brown-ligth-200)] flex flex-col gap-2">
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg font-semibold transition w-full ${
                monto > factura.saldoPendiente
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[var(--brown-dark-800)] text-white hover:bg-[var(--brown-dark-700)]"
              }`}
              disabled={monto > factura.saldoPendiente}
            >
              {monto > factura.saldoPendiente
                ? "Monto mayor al saldo adeudado"
                : "Registrar pago"}
            </button>

            <button
              type="button"
              onClick={handleDescargarPDF}
              className="px-4 py-2 rounded-lg bg-[var(--brown-ligth-400)] text-white font-semibold hover:bg-[var(--brown-dark-500)] transition flex items-center justify-center gap-2"
            >
              <i className="fas fa-download"></i> Descargar comprobante PDF
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoicePaymentModal;
