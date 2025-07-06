import { useState } from "react";
import { ShowEyes } from "../../../../../../../assets/icons";
import InvoicePaymentModal from "../../../../../../common/Modal/InvoicePaymentModal";
import { GenericTable } from "../../../../../widgets";
import { BsEye } from "react-icons/bs";

const initialFacturas = [
  {
    proveedor: "Tapicerías del Centro",
    factura: "FC1-0000678",
    fecha: "15/04/2025",
    fecha_venc: "02/05/2025",
    monto: 1540.5,
    montoPagado: 1000,
  },
  {
    proveedor: "Curtiembre Fina",
    factura: "A0067",
    fecha: "10/04/2025",
    fecha_venc: "22/04/2025",
    monto: 956.0,
    montoPagado: 0,
  },
  {
    proveedor: "Gómez e Hijos",
    factura: "B0004",
    fecha: "02/04/2025",
    fecha_venc: "22/05/2025",
    monto: 624.19,
    montoPagado: 0,
  },
];

const calcularEstado = (factura) => {
  const hoy = new Date();
  const vencimiento = new Date(
    factura.fecha_venc.split("/").reverse().join("-")
  );

  if (vencimiento < hoy) return "Vencida";
  const diferenciaDias = (vencimiento - hoy) / (1000 * 60 * 60 * 24);
  if (diferenciaDias <= 7) return "Por vencer";
  return "Disponible";
};

const AccountsPayable = () => {
  const [facturas] = useState(initialFacturas);
  const [show, setShow] = useState(false);

  const columns = [
    { key: "proveedor", label: "PROVEEDOR" },
    { key: "factura", label: "FACTURA" },
    { key: "fecha", label: "FECHA" },
    { key: "fecha_venc", label: "VENCIMIENTO" },
    {
      key: "monto",
      label: "Monto / Abonado",
      render: (_, row) => (
        <>
          ${row.monto.toLocaleString("es-AR", { minimumFractionDigits: 2 })}/
          <span className="text-green-700">
            {row.montoPagado.toLocaleString("es-AR", {
              minimumFractionDigits: 2,
            })}
          </span>
        </>
      ),
    },
    {
      key: "estado",
      label: "ESTADO",
      render: (_, row) => {
        const estado = calcularEstado(row);
        const baseStyle = "px-3 py-1 rounded-full text-sm font-semibold";
        if (estado === "Vencida")
          return (
            <span
              className={`${baseStyle} bg-[var(--bg-state-red)] text-[var(--text-state-red)]`}
            >
              {estado}
            </span>
          );
        if (estado === "Por vencer")
          return (
            <span
              className={`${baseStyle} bg-[var(--bg-state-yellow)] text-[var(--text-state-yellow)]`}
            >
              {estado}
            </span>
          );
        return (
          <span
            className={`${baseStyle} bg-[var(--bg-state-green)] text-[var(--text-state-green)]`}
          >
            {estado}
          </span>
        );
      },
    },
    {
      key: "acciones",
      label: "DETALLES",
      render: () => (
        <div className="flex justify-center" onClick={() => setShow(true)}>
          <BsEye className="w-6 h-6 cursor-pointer" />
        </div>
      ),
    },
  ];

  return (
    <>
      {show && <InvoicePaymentModal onClose={() => setShow(false)} />}

      <div className="w-full flex flex-col ">
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

export default AccountsPayable;
