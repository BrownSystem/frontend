import React, { useState } from "react";

// Datos ficticios de una factura
const facturaEjemplo = {
  numero: "FC1-0000678",
  proveedor: "Tapicerías del Centro",
  total: 3000.0,
  abonado: 100,
  saldoPendiente: 1000.0,
  vencimiento: "Vencida",
};

const InvoicePaymentModal = ({
  factura = facturaEjemplo,
  onClose = () => {},
  onRegistrarPago = console.log,
}) => {
  const [monto, setMonto] = useState(factura.saldoPendiente);
  const [metodo, setMetodo] = useState("Efectivo");
  const [datosCheque, setDatosCheque] = useState({});

  const handleMetodoChange = (nuevoMetodo) => {
    setMetodo(nuevoMetodo);
    factura.setDatosCheque({});
  };

  const handleInputChange = (e) => {
    setDatosCheque({ ...datosCheque, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onRegistrarPago({ monto, metodo, datosCheque });
    onClose();
  };

  return (
    <div className="fixed z-[1000000] inset-0 flex items-center justify-center bg-[var(--brown-ligth-400)]/20 bg-opacity-30 ">
      <div className="bg-[#FFF8F0] p-6 rounded-2xl shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-bold text-[var(--brown-dark-950)]">
          Pago de factura: {factura.numero}
          <span className="ml-3 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            {factura.vencimiento}
          </span>
        </h2>
        <div className="text-[var(--brown-dark-700)] mb-4">
          <p>{factura.proveedor}</p>
        </div>

        <div className="mb-4 text-sm ">
          <p>
            Abonaste:{" "}
            <span className="text-green-700">
              ${factura.abonado.toFixed(2) || 0}
            </span>
          </p>
          <p>
            Monto total: <span>${factura.total.toFixed(2)}</span>
          </p>
          <p>
            Monto por abonar:{" "}
            <span className="text-green-700">
              {!isNaN(parseFloat(monto))
                ? parseFloat(monto).toFixed(2)
                : "0.00"}
            </span>
          </p>
          <p>
            Saldo pendiente:{" "}
            <span className="text-red-700">
              $
              {(
                (parseFloat(factura.total) || 0) - (parseFloat(monto) || 0)
              ).toFixed(2)}
            </span>
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-[var(--brown-dark-950)] font-semibold mb-1">
            Monto a abonar
          </label>
          <input
            type="number"
            className="w-full p-2 border border-[var(--brown-dark-500)] rounded"
            placeholder="Monto a Abonar"
            value={monto}
            onChange={(e) => setMonto(parseFloat(e.target.value))}
          />
        </div>

        <div className="mb-1">
          <p className="text-[var(--brown-dark-950)] font-semibold mb-1">
            Método de pago
          </p>
          <div className="flex gap-2">
            {["Efectivo", "Cheque propio", "Cheque de terceros", "Dólares"].map(
              (m) => (
                <button
                  key={m}
                  className={`px-2 py-1 rounded-lg border cursor-pointer hover: ${
                    metodo === m
                      ? "bg-[var(--brown-dark-800)] text-white"
                      : "bg-white text-[var(--brown-dark-800)]"
                  }`}
                  onClick={() => handleMetodoChange(m)}
                >
                  {m}
                </button>
              )
            )}
          </div>
        </div>

        {(metodo === "Cheque propio" || metodo === "Cheque de terceros") && (
          <div className="mb-1 space-y-1">
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
            {metodo === "Cheque de terceros" && (
              <input
                name="titular"
                placeholder="Titular / CUIT del cheque"
                className="w-full p-2 border rounded border-[var(--brown-dark-500)]"
                onChange={handleInputChange}
              />
            )}
            <input
              name="fecha"
              placeholder="Fecha de vencimiento"
              type="date"
              className="w-full p-2 border rounded border-[var(--brown-dark-500)]"
              onChange={handleInputChange}
            />
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="bg-[var(--brown-dark-800)] text-white px-4 py-2 rounded border-[var(--brown-dark-500)] w-full mt-4 cursor-pointer"
        >
          Registrar pago
        </button>
      </div>
    </div>
  );
};

export default InvoicePaymentModal;
