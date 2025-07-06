import { useState } from "react";
import { SearchIcon, ShowEyes } from "../../../../../../assets/icons";
import InvoiceModal from "../../../../../common/Modal/InvoiceModal";
import InvoicePaymentModal from "../../../../../common/Modal/InvoicePaymentModal";
import { GenericTable } from "../../../../widgets";
import { BsEye } from "react-icons/bs";

const facturasVentas = [
  {
    factura: "FC1-0000678",
    fecha: "15/04/2025",
    fechaPago: "20/04/2025",
    monto: 1540.5,
    montoPagado: 1540.5,
    formaDePago: "Cheque",
    estado: "Pagada",
    cliente: "Lucía M.",
  },
  {
    factura: "A0067",
    fecha: "10/04/2025",
    fechaPago: "18/04/2025",
    monto: 956.0,
    montoPagado: 956.0,
    formaDePago: "Cheque de Tercero",
    estado: "Pagada",
    cliente: "Carlos B.",
  },
  {
    factura: "FC1-0000679",
    fecha: "17/04/2025",
    fechaPago: "19/04/2025",
    monto: 1280.75,
    montoPagado: 1280.75,
    formaDePago: "Transferencia",
    estado: "Pagada",
    cliente: "Sandra L.",
  },
  {
    factura: "A0068",
    fecha: "18/04/2025",
    fechaPago: "22/04/2025",
    monto: 875.0,
    montoPagado: 875.0,
    formaDePago: "Efectivo",
    estado: "Pagada",
    cliente: "Martín R.",
  },
  {
    factura: "FC1-0000680",
    fecha: "20/04/2025",
    fechaPago: "27/04/2025",
    monto: 1940.0,
    montoPagado: 1940.0,
    formaDePago: "Tarjeta",
    estado: "Pagada",
    cliente: "Valeria G.",
  },
];

const facturasPago = [
  {
    factura: "B0004",
    fecha: "02/04/2025",
    fechaPago: "25/04/2025",
    monto: 624.19,
    montoPagado: 0,
    formaDePago: "Efectivo",
    estado: "Pendiente",
    cliente: "Ana R.",
  },
  {
    factura: "B0005",
    fecha: "02/04/2025",
    fechaPago: "25/04/2025",
    monto: 600.19,
    montoPagado: 0,
    formaDePago: "Transferencia",
    estado: "Pendiente",
    cliente: "Pedro T.",
  },
  {
    factura: "B0006",
    fecha: "05/04/2025",
    fechaPago: "28/04/2025",
    monto: 715.0,
    montoPagado: 0,
    formaDePago: "Cheque",
    estado: "Pendiente",
    cliente: "Laura S.",
  },
  {
    factura: "B0007",
    fecha: "09/04/2025",
    fechaPago: "30/04/2025",
    monto: 890.5,
    montoPagado: 400.0,
    formaDePago: "Transferencia",
    estado: "Parcial",
    cliente: "Julián M.",
  },
  {
    factura: "B0008",
    fecha: "12/04/2025",
    fechaPago: "12/04/2025",
    monto: 320.0,
    montoPagado: 200.0,
    formaDePago: "Efectivo",
    estado: "Parcial",
    cliente: "Camila Z.",
  },
];

const SalesInvoiceTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [showModalRegisterPayment, setShowModalRegisterPayment] =
    useState(false);
  const [tags, setTags] = useState("pagos");

  const columnsVentas = [
    { key: "fecha", label: "FECHA", className: "text-center" },
    { key: "cliente", label: "CLIENTE", className: "text-center" },
    {
      key: "monto",
      label: "MONTO",
      className: "text-center",
      render: (value) =>
        `$${value.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`,
    },
    {
      key: "montoPagado",
      label: "MONTO ABONADO",
      className: "text-center",
      render: (value) => (
        <span className="text-green-700">
          ${value.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      key: "estado",
      label: "ESTADO",
      className: "text-center",
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
      key: "acciones",
      label: "DETALLES",
      className: "text-center",
      render: (_, row) => (
        <div
          className="flex items-center justify-center cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          <BsEye className="h-6 w-6" />
        </div>
      ),
    },
  ];

  const columnsPagos = [
    { key: "fecha", label: "FECHA", className: "text-center" },
    { key: "cliente", label: "CLIENTE", className: "text-center" },
    {
      key: "monto",
      label: "MONTO",
      className: "text-center",
      render: (value) =>
        `$${value.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`,
    },
    {
      key: "montoPagado",
      label: "MONTO ABONADO",
      className: "text-center",
      render: (value) => (
        <span className="text-green-700">
          ${value.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      key: "saldo",
      label: "SALDO",
      className: "text-center",
      render: (_, row) =>
        `$${(row.monto - row.montoPagado).toLocaleString("es-AR", {
          minimumFractionDigits: 2,
        })}`,
    },
    {
      key: "estado",
      label: "ESTADO",
      className: "text-center",
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            value === "Pendiente"
              ? "bg-[var(--bg-state-red)] text-[var(--text-state-red)]"
              : "bg-[var(--bg-state-yellow)] text-[var(--text-state-yellow)]"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "acciones",
      label: "DETALLES",
      className: "text-center",
      render: (_, row) => (
        <div
          className="flex items-center justify-center cursor-pointer"
          onClick={() => setShowModalRegisterPayment(true)}
        >
          <BsEye className="h-6 w-6" />
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

      {showModalRegisterPayment && (
        <InvoicePaymentModal
          onClose={() => setShowModalRegisterPayment(false)}
          onConfirm={() => {
            alert("Pago confirmado");
            setShowModalRegisterPayment(false);
          }}
        />
      )}

      <div className="w-full h-full bg-white rounded-lg shadow p-4">
        {/* Buscador */}

        {/* Tabs */}
        <div className="w-full mt-4">
          <div className="flex text-[15px] font-medium rounded-t-lg overflow-hidden bg-[var(--brown-ligth-200)]">
            <div
              className={`w-full cursor-pointer px-4 py-2 transition-all duration-200 text-xl text-center ${
                tags === "ventas"
                  ? "text-[var(--brown-ligth-400)] border-b-2 border-[var(--brown-dark-600)]"
                  : "bg-white text-[var(--brown-dark-700)] border-t-2 border-x-2 border-[var(--brown-dark-600)] rounded-t-md shadow-md"
              }`}
              onClick={() => setTags("pagos")}
            >
              Pagos Pendientes
            </div>
            <div
              className={`w-full px-4 py-2 transition-all duration-200 text-xl text-center cursor-pointer ${
                tags === "pagos"
                  ? "text-[var(--brown-ligth-400)] border-b-2 border-[var(--brown-dark-600)]"
                  : "bg-white text-[var(--brown-dark-700)] border-t-2 border-x-2 border-[var(--brown-dark-600)] rounded-t-md shadow-md"
              }`}
              onClick={() => setTags("ventas")}
            >
              Ventas Finalizadas
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="mt-4">
          <GenericTable
            columns={tags === "pagos" ? columnsPagos : columnsVentas}
            data={tags === "pagos" ? facturasPago : facturasVentas}
            enablePagination={true}
            enableFilter={true}
          />
        </div>
      </div>
    </>
  );
};

export default SalesInvoiceTable;
