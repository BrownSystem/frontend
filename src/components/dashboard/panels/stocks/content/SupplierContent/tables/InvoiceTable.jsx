import { useState } from "react";
import { ShowEyes } from "../../../../../../../assets/icons";
import { InvoiceModal } from "../../../../../../common";
import { GenericTable } from "../../../../../widgets";
import { BsEye } from "react-icons/bs";

const initialFacturas = [
  {
    proveedor: "Tapicerías del Centro",
    factura: "FC1-0000678",
    fecha: "15/04/2025",
    fechaPago: "20/04/2025",
    monto: 1540.5,
    montoPagado: 1540.5,
    formaDePago: "Cheque",
    estado: "Pagada",
    registradoPor: "Lucía M.",
  },
  {
    proveedor: "Curtiembre Fina",
    factura: "A0067",
    fecha: "10/04/2025",
    fechaPago: "18/04/2025",
    monto: 956.0,
    montoPagado: 956.0,
    formaDePago: "Cheque de Tercero",
    estado: "Pagada",
    registradoPor: "Carlos B.",
  },
  {
    proveedor: "Gómez e Hijos",
    factura: "B0004",
    fecha: "02/04/2025",
    fechaPago: "25/04/2025",
    monto: 624.19,
    montoPagado: 400.0,
    formaDePago: "Efectivo",
    estado: "Parcial",
    registradoPor: "Ana R.",
  },
];

const InvoiceTable = () => {
  const [facturas, setFacturas] = useState(initialFacturas);
  const [showModal, setShowModal] = useState(false);

  const columns = [
    { key: "proveedor", label: "PROVEEDOR" },
    { key: "factura", label: "FACTURA" },
    { key: "fecha", label: "FECHA" },
    {
      key: "monto",
      label: "MONTO",
      render: (value) =>
        `$${value.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`,
    },
    {
      key: "montoPagado",
      label: "MONTO PAGADO",
      render: (value) =>
        `$${value.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`,
    },
    {
      key: "saldo",
      label: "SALDO",
      render: (_, row) =>
        `$${(row.monto - row.montoPagado).toLocaleString("es-AR", {
          minimumFractionDigits: 2,
        })}`,
    },
    {
      key: "formaDePago",
      label: "FORMA DE PAGO",
      render: (value) => (
        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-[var(--bg-state-green)] text-[var(--text-state-green)]">
          {value}
        </span>
      ),
    },
    {
      key: "estado",
      label: "ESTADO",
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            value === "Pagada"
              ? "bg-[var(--bg-state-green)] text-[var(--text-state-green)]"
              : "bg-[var(--bg-state-yellow)] text-[var(--text-state-yellow)]"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "detalles",
      label: "DETALLES",
      render: () => (
        <div
          className="flex items-center justify-center cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          <BsEye className="w-6 h-6 cursor-pointer" />
        </div>
      ),
    },
  ];

  return (
    <>
      {showModal && (
        <InvoiceModal
          onCancel={() => setShowModal(false)}
          onConfirm={() => {
            alert("Pago confirmado");
            setShowModal(false);
          }}
        />
      )}

      <div className="w-full mt-1 flex flex-col ">
        <div className="flex flex-col md:flex-row justify-center items-center w-full px-4 ">
          <h2 className="text-2xl  font-semibold text-[#2c2b2a]">
            FACTURAS POR ABONAR
          </h2>
        </div>

        <GenericTable
          columns={columns}
          data={facturas}
          enableFilter={true}
          enablePagination={true}
        />
      </div>
    </>
  );
};

export default InvoiceTable;
