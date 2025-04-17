import React from "react";
import { useProductModal } from "../../../../../../context/ProductModalContext";
import { useStockView } from "../../../../../../context/StockViewContext";
import { HideEyes } from "../../../../../../assets/icons";
import { Search } from "../../../../widgets";

const suppliers = [
  {
    fecha: "10/04/2025",
    formaPago: "Transferencia Bancaria",
    estado: "Completado",
    importe: 125000,
  },
  {
    fecha: "08/04/2025",
    formaPago: "Efectivo",
    estado: "Pendiente",
    importe: 87500,
  },
  {
    fecha: "12/04/2025",
    formaPago: "Mercado Pago",
    estado: "En proceso",
    importe: 95620,
  },
  {
    fecha: "11/04/2025",
    formaPago: "Tarjeta de Crédito",
    estado: "Completado",
    importe: 45200,
  },
];

const SupplierTable = ({ title, span, backTo }) => {
  const { openProductDetail } = useProductModal();
  const { setView } = useStockView();

  const handleClick = (supplier) => openProductDetail(supplier);

  return (
    <>
      <div className="flex justify-between px-2">
        <h1 className="!text-3xl font-normal text-gray-700">
          {title} <span className="text-gray-500 text-[20px]">({span})</span>
        </h1>
        <div className="flex gap-2">
          <Search placeholder="Buscar productos" />
          {backTo && (
            <a
              href="#"
              onClick={() => setView({ name: "proveedores", props: null })}
              className="!text-white px-4 pt-3 rounded-lg bg-gradient-to-b from-[var(--brown-ligth-400)] to-[var(--brown-dark-800)]"
            >
              Volver
            </a>
          )}
        </div>
      </div>

      <table className="flex flex-col items-center w-[95%] justify-center  text-gray-700 border-separate border-spacing-y-2">
        <thead className="text-gray-800 rounded-lg flex flex-col gap-4">
          <tr>
            <th className="p-3 text-left font-normal">Fecha</th>
            <th className="p-3 text-left font-normal">Forma de Pago</th>
            <th className="p-3 text-left font-normal">Estado</th>
            <th className="p-3 text-left font-normal">Importe</th>
          </tr>
        </thead>

        <tbody className="max-h-auto overflow">
          {suppliers.map((supplier) => (
            <tr
              key={supplier.fecha}
              onClick={() => handleClick(supplier)}
              className="cursor-pointer bg-white shadow-md rounded-lg hover:bg-pink-50 transition"
            >
              <td className="p-3 rounded-l-lg border-l-4 border-[var(--brown-ligth-400)]">
                {supplier.fecha}
              </td>
              <td className="p-3">{supplier.formaPago}</td>
              <td className="p-3 flex justify-center items-center gap-2">
                {supplier.estado ? (
                  <span className="text-green-500">{supplier.estado}</span>
                ) : (
                  <span className="text-red-500">{supplier.estado}</span>
                )}
              </td>
              <td className="p-3">${supplier.importe}</td>
              <td className="p-3 rounded-r-lg">
                <a href="#">
                  <HideEyes />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default SupplierTable;
