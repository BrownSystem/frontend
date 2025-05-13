import React, { useState } from "react";
import { Close, Danger } from "../../../assets/icons";

// Datos ficticios de una factura
const facturaEjemplo = {
  numero: "FC1-0000678",
  proveedor: "Tapicerías del Centro",
  total: 3000.0,
  abonado: 1000,
  saldoPendiente: 2000.0,
  vencimiento: "Vencida",
  pagosAnteriores: [
    {
      fecha: "2025-04-20",
      monto: 500,
      metodo: "Efectivo",
    },
    {
      fecha: "2025-04-25",
      monto: 500,
      metodo: "Transferencia",
      banco: "Banco Nación",
      numeroOperacion: "12345678",
    },
  ],
};

const InvoicePaymentModal = ({
  factura = facturaEjemplo,
  onClose,
  onRegistrarPago = console.log,
}) => {
  const [monto, setMonto] = useState(0);
  const [metodo, setMetodo] = useState("Efectivo");
  const [tipoCheque, setTipoCheque] = useState("");
  const [datosPago, setDatosPago] = useState({});

  const handleMetodoChange = (nuevoMetodo) => {
    setMetodo(nuevoMetodo);
    setDatosPago({});
    setTipoCheque("");
  };

  const handleInputChange = (e) => {
    setDatosPago({ ...datosPago, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const metodoFinal = metodo === "Cheques" ? tipoCheque : metodo;
    const nuevoPago = {
      fecha: new Date().toISOString().split("T")[0],
      monto: parseFloat(monto),
      metodo: metodoFinal,
      ...datosPago,
    };
    onRegistrarPago(nuevoPago);
    onClose();
  };

  return (
    <div className=" fixed z-[1000000] inset-0 flex gap-2 justify-center items-start bg-[var(--brown-ligth-400)]/20 bg-opacity-30 ">
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
                  {
                    <span className="text-green-700">
                      {""} ${p.monto.toFixed(2)}
                    </span>
                  }{" "}
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
            {["Efectivo", "Cheques", "Transferencia"].map((m) => (
              <button
                key={m}
                className={`px-3 py-1 rounded-lg border ${
                  metodo === m
                    ? "bg-[var(--brown-dark-800)] text-white"
                    : "bg-white text-[var(--brown-dark-800)]"
                }`}
                onClick={() => handleMetodoChange(m)}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
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
      </div>
      {metodo !== "Efectivo" && (
        <div className="bg-white p-6 rounded-2xl shadow-lg w-full  max-w-lg mt-[5rem]">
          <div className="flex flex-col items-end h-full">
            {metodo === "Cheques" && (
              <>
                <select
                  className="w-full p-2 mb-2 border rounded border-[var(--brown-dark-500)]"
                  onChange={(e) => setTipoCheque(e.target.value)}
                >
                  <option value="">Selecciona el tipo de cheque</option>
                  <option value="Cheque propio">Cheque propio</option>
                  <option value="Cheque de terceros">Cheque de terceros</option>
                </select>
              </>
            )}
            {tipoCheque && (
              <div className="space-y-2">
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
                {tipoCheque === "Cheque de terceros" && (
                  <input
                    name="titular"
                    placeholder="Titular / CUIT"
                    className="w-full p-2 border rounded border-[var(--brown-dark-500)]"
                    onChange={handleInputChange}
                  />
                )}
                <input
                  name="fecha"
                  type="date"
                  placeholder="Fecha de vencimiento"
                  className="w-full p-2 border rounded border-[var(--brown-dark-500)]"
                  onChange={handleInputChange}
                />
              </div>
            )}

            {metodo === "Transferencia" && (
              <>
                <select
                  name="banco"
                  className="w-full p-2 mb-2 border rounded border-[var(--brown-dark-500)]"
                  onChange={handleInputChange}
                >
                  <option value="">Selecciona el banco</option>
                  <option value="Banco Nación">Banco Nación</option>
                  <option value="Banco Galicia">Banco Galicia</option>
                  <option value="Mercado Pago">Mercado Pago</option>
                </select>
                <input
                  name="numeroOperacion"
                  placeholder="Número de operación"
                  className="w-full p-2 mb-2 border rounded border-[var(--brown-dark-500)]"
                  onChange={handleInputChange}
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicePaymentModal;
