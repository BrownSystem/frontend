import React from "react";
import { SearchIcon, ShowEyes } from "../../../../../../../assets/icons";
import { FiltroDropdown } from "../../../../../widgets";
import InvoicePaymentModal from "../../../../../../common/Modal/InvoicePaymentModal";
const facturas = [
  {
    proveedor: "Tapicerías del Centro",
    factura: "FC1-0000678",
    fecha: "15/04/2025",
    fecha_venc: "02/05/2025",
    monto: 1540.5,
    montoPagado: 1000,
    estado: "Pendiente",
  },
  {
    proveedor: "Curtiembre Fina",
    factura: "A0067",
    fecha: "10/04/2025",
    fecha_venc: "22/04/2025",
    monto: 956.0,
    montoPagado: 0,
    estado: "Pendiente",
  },
  {
    proveedor: "Gómez e Hijos",
    factura: "B0004",
    fecha: "02/04/2025",
    fecha_venc: "22/05/2025",
    monto: 624.19,
    montoPagado: 0,
    estado: "Pendiente",
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

const opciones = ["Todos", "Vencida", "Disponible", "Por vencer"];

const AccountsPayable = () => {
  const [show, setShow] = React.useState(false);

  return (
    <>
      {show ? <InvoicePaymentModal onClose={() => setShow(false)} /> : <></>}
      <div className="w-full mt-1">
        <div className="flex text-[15px] font-medium rounded-t-lg overflow-hidden ">
          <div className="w-full cursor-pointer px-4 py-2 flex items-center justify-center transition-all duration-200 text-xl text-center bg-white text-[#3c2f1c] border-t-2 border-x-2 border-[#e8d5a2] rounded-t-md shadow-md">
            Facturas por pagar
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
              <FiltroDropdown opciones={opciones} id={"AccountsPayable"} />
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-y-hidden h-auto">
        <table className="w-full text-left text-[#3c2f1c] text-md">
          <thead>
            <tr className="grid grid-cols-7 font-medium px-4 py-2 border-b border-[#e6d8be]">
              <th>Proveedor</th>
              <th>Factura</th>
              <th>Fecha</th>
              <th>Vencimiento</th>
              <th>Monto/Abonado </th>
              <th className="text-center">Estado</th>
              <th className="text-center">Detalles</th>
            </tr>
          </thead>
          <tbody>
            {facturas.map((factura, index) => {
              const estado = calcularEstado(factura);

              return (
                <tr
                  key={index}
                  className={`grid grid-cols-7 items-center px-1 py-3 transition ${
                    index % 2 === 0 ? "bg-white" : "bg-[#faf3e7]"
                  } hover:bg-[#f7eed5] cursor-pointer`}
                >
                  <td className="font-medium pl-2">{factura.proveedor}</td>
                  <td className="text-center">{factura.factura}</td>
                  <td>{factura.fecha}</td>
                  <td>{factura.fecha_venc}</td>
                  <td>
                    $
                    {factura.monto.toLocaleString("es-AR", {
                      minimumFractionDigits: 2,
                    })}
                    /
                    <span className="text-green-700">
                      {factura.montoPagado.toLocaleString("es-AR", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </td>

                  <td className="flex items-center justify-center gap-2">
                    {estado === "Vencida" && (
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700">
                        {estado}
                      </span>
                    )}
                    {estado === "Por vencer" && (
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-700">
                        {estado}
                      </span>
                    )}
                    {estado === "Disponible" && (
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                        {estado}
                      </span>
                    )}
                  </td>
                  <td
                    className="flex justify-center"
                    onClick={() => setShow(true)}
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

export default AccountsPayable;
