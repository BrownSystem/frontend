import React from "react";
import { FiltroDropdown } from "../../../../../widgets";
import { SearchIcon, ShowEyes } from "../../../../../../../assets/icons";
import InvoiceModal from "../../../../../../common/Modal/InvoiceModal";

const facturas = [
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

const opciones = ["Cheque", "Cheque de Tercero", "Efectivo"];

const InvoiceTable = () => {
  const [showModal, setShowModal] = React.useState(false);

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

      <div className="w-full mt-4 relative">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-2xl font-bold text-[#3c2f1c]">
            Facturas Pagadas
          </h2>
          <div className="flex gap-2">
            <div className="flex items-center bg-[#fcf5e9] border-[2px] border-[#f5e6c9] rounded-md px-3 py-1 w-[280px] font-medium">
              <SearchIcon color="#5c4c3a" />
              <input
                type="text"
                placeholder="Buscar facturas"
                className="bg-transparent outline-none w-full text-[#5c4c3a] placeholder-[#5c4c3a] text-[15px]"
              />
            </div>
            <FiltroDropdown opciones={opciones} id="InvoiceTable" />
          </div>
        </div>

        <table className="w-full text-left text-[#3c2f1c] text-md">
          <thead>
            <tr className="grid grid-cols-9 font-medium px-4 py-2 border-b border-[#e6d8be]">
              <th className="text-center">Proveedor</th>
              <th className="text-center">Factura</th>
              <th className="text-center">Fecha</th>
              <th className="text-center">Monto</th>
              <th className="text-center">Monto Pagado</th>
              <th className="text-center">Saldo</th>
              <th className="text-center">Forma de Pago</th>
              <th className="text-center">Estado</th>
              <th className="text-center">Detalles</th>
            </tr>
          </thead>
          <tbody>
            {facturas.map((factura, index) => {
              const saldo = factura.monto - factura.montoPagado;
              return (
                <tr
                  key={index}
                  className={`grid grid-cols-9 items-center text-center px-4 py-3 ${
                    index % 2 === 0 ? "bg-white" : "bg-[#f7ecd9]"
                  }`}
                >
                  <td className="font-medium pl-2">{factura.proveedor}</td>
                  <td>{factura.factura}</td>
                  <td>{factura.fecha}</td>
                  <td>
                    $
                    {factura.monto.toLocaleString("es-AR", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td>
                    $
                    {factura.montoPagado.toLocaleString("es-AR", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td>
                    $
                    {saldo.toLocaleString("es-AR", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="">
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                      {factura.formaDePago}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        factura.estado === "Pagada"
                          ? "bg-green-200 text-green-900"
                          : "bg-yellow-200 text-yellow-900"
                      }`}
                    >
                      {factura.estado}
                    </span>
                  </td>
                  <td
                    className="flex items-center justify-center cursor-pointer"
                    onClick={() => setShowModal(true)}
                  >
                    <ShowEyes />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default InvoiceTable;
