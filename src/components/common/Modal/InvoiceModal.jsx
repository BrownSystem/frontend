import React from "react";
import { Download } from "../../../assets/icons";

const productos = [
  {
    codigo: "PD12949ULM",
    descripcion: "Mesa de Roble Macizo",
    cantidad: 5,
    precio: 3200,
    iva: 21.5,
  },
  {
    codigo: "FS12945ULFM",
    descripcion: "Silla Tapizada de Cuero",
    cantidad: 1,
    precio: 3000,
    iva: 10.5,
  },
  {
    codigo: "LK52948ULNM",
    descripcion: "Lámpara de Pie Minimalista",
    cantidad: 2,
    precio: 400,
    iva: 21.5,
  },
];

const factura = {
  numero: "00001",
  fecha: "12/04/2025",
  cliente: "Juan Perez",
  direccion: "Calle 123, Ciudad, País",
  total: 1000,
};

const InvoiceModal = ({ onCancel, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-[var(--brown-ligth-400)]/20 flex items-center justify-center z-50 top-8">
      <div className="bg-[#fefcf9] rounded-2xl shadow-lg w-[600px]  p-6 border border-[#e0d2bb]">
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-[#b68239] text-white p-2 rounded-lg">
              <i className="fas fa-warehouse"></i>
            </div>
            <span className="font-bold text-[#5b3e0f]">
              FACTURA N°:{" "}
              <span className="text-[var(--brown-ligth-400)]">
                {factura.numero}
              </span>
            </span>
          </div>
          <span className="font-bold text-[#5b3e0f]">
            FECHA:{" "}
            <span className="text-[var(--brown-ligth-400)]">
              {factura.fecha}
            </span>
          </span>
        </div>

        {/* Origen y destino */}
        <div className="mb-4 text-MD">
          <p className="font-semibold text-[#3a2b19]">
            Hyper S.A <span className="text-[#c49653]">(Res. Inscripto)</span>
          </p>
          <p className="text-[#3a2b19]">
            Gran Empresa S.A{" "}
            <span className="text-[#c49653]">(Res. Inscripto)</span>
          </p>
        </div>

        {/* Tabla de productos */}
        <table className="w-full text-left text-md mb-4">
          <thead className=" ">
            <tr className="border-b border-[#ddd] grid grid-cols-5 items-center">
              <th className="py-2 text-[#3a2b19]">Producto</th>
              <th className="py-2 text-center text-[#3a2b19]">Cantidad</th>
              <th className="py-2 text-center text-[#3a2b19]">Precio</th>
              <th className="py-2 text-center text-[#3a2b19]">Iva</th>
              <th className="py-2 text-center text-[#3a2b19]">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p, i) => (
              <tr
                key={i}
                className="border-b border-[#eee] grid grid-cols-5 items-center  "
              >
                <td className="py-2">
                  <div className="font-medium text-[#3a2b19]">{p.codigo}</div>
                  <div className="text-[#6d5b3e]">{p.descripcion}</div>
                </td>
                <td className="py-2 text-right font-normal text-[#3a2b19]">
                  <p className="flex justify-center items-center gap-2">
                    {p.cantidad}
                  </p>
                </td>
                <td className="py-2 text-center font-normal text-[#3a2b19]">
                  <p className="flex justify-center items-center gap-2">
                    ${p.precio}
                  </p>
                </td>
                <td className="py-2 text-center font-normal text-[#3a2b19]">
                  <p className="flex justify-center items-center gap-2">
                    {p.iva}%
                  </p>
                </td>

                <td className="py-2 text-center font-normal text-[#3a2b19]">
                  <p className="flex justify-center items-center gap-2">
                    ${(p.precio * p.cantidad * (1 + p.iva / 100)).toFixed(2)}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Botones */}
        <div className="flex justify-between items-center gap-2">
          <p className="font-medium text-[var(--brown-dark-950)] text-xl">
            Total:{" "}
            <span className="text-[#b68239] text-[18px] font-medium">
              ${productos.reduce((acc, p) => acc + p.precio, 0)}
            </span>
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="!bg-[#1a1a1a] text-white px-4 py-2 rounded-md hover:bg-[#ede5d9] cursor-pointer"
            >
              Cerrar
            </button>
            <button
              onClick={onConfirm}
              className="!bg-[#b68239] text-white px-4 py-2 rounded-md !hover:bg-[#a46f2f] flex gap-1 cursor-pointer"
            >
              <Download />
              Descargar PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default InvoiceModal;
