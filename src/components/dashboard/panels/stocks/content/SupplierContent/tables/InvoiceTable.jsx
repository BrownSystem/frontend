import React from "react";
import { FiltroDropdown } from "../../../../../widgets";
import { SearchIcon } from "../../../../../../../assets/icons";

const facturas = [
  {
    proveedor: "Tapicerías del Centro",
    factura: "FC1-0000678",
    fecha: "15/04/2025",
    fecha_venc: "02/04/2025",
    monto: 1540.5,
    estado: "Pendiente",
  },
  {
    proveedor: "Curtiembre Fina",
    factura: "A0067",
    fecha: "10/04/2025",
    fecha_venc: "02/04/2025",
    monto: 956.0,
    estado: "Pagada",
  },
  {
    proveedor: "Gómez e Hijos",
    factura: "B0004",
    fecha: "02/04/2025",
    fecha_venc: "02/04/2025",
    monto: 624.19,
    estado: "Pagada",
  },
];

const EstadoBadge = ({ estado }) => {
  const isPagada = estado === "Pagada";
  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold ${
        isPagada
          ? "bg-green-100 text-green-700"
          : "bg-yellow-100 text-yellow-700"
      }`}
    >
      {estado}
    </span>
  );
};

const opciones = ["Todos", "Pendientes", "Pagadas"];

const InvoiceTable = () => {
  return (
    <>
      <div className="w-full mt-4">
        <div className="flex text-[15px] font-medium rounded-t-lg overflow-hidden ">
          <div className="w-full cursor-pointer px-4 py-2 flex items-center justify-center transition-all duration-200 text-xl text-center bg-white text-[#3c2f1c] border-t-2 border-x-2 border-[#e8d5a2] rounded-t-md shadow-md">
            Facturas
          </div>
          <div className="w-full cursor-pointer px-4 py-2 transition-all duration-200 text-xl text-cente text-[#3c2f1c] border-b-2 border-[#e8d5a2] rounded-t-md shadow-md ">
            <div className="w-full flex items-center  justify-between gap-2">
              <div className="flex items-center bg-[#fcf5e9] border-[2px] border-[#f5e6c9] rounded-md px-3 py-1 w-[280px] font-medium">
                <SearchIcon color="#5c4c3a" className="text-[#5c4c3a]" />
                <input
                  type="text"
                  placeholder="Buscar facturas"
                  className="bg-transparent outline-none w-full text-[#5c4c3a] placeholder-[#5c4c3a] text-[15px]"
                />
              </div>
              <FiltroDropdown opciones={opciones} />
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-y-hidden h-auto">
        <table className="w-full text-left text-[#3c2f1c] text-md">
          <thead>
            <tr className="grid grid-cols-6 font-medium px-4 py-2 border-b border-[#e6d8be]">
              <th>Proveedor</th>
              <th>Factura</th>
              <th>Fecha</th>
              <th>Vencimiento</th>
              <th>Monto</th>
              <th className="text-center">Pago</th>
            </tr>
          </thead>
          <tbody>
            {facturas.map((factura, index) => (
              <tr
                key={index}
                className={`grid grid-cols-6 items-center px-4 py-3  transition ${
                  index % 2 === 0 ? "bg-white" : "bg-[#f7ecd9]"
                } ${
                  factura.estado === "Pendiente"
                    ? "hover:bg-[#f7eed5] cursor-pointer"
                    : ""
                } `}
              >
                <td className="font-medium pl-2">{factura.proveedor}</td>
                <td>{factura.factura}</td>
                <td>{factura.fecha}</td>
                <td>{factura.fecha_venc}</td>
                <td>
                  $
                  {factura.monto.toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td className="flex items-center justify-center gap-2">
                  <EstadoBadge estado={factura.estado} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default InvoiceTable;
