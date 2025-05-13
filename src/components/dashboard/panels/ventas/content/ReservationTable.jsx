import React from "react";
import { SearchIcon, ShowEyes } from "../../../../../assets/icons";
import { FiltroDropdown } from "../../../widgets";

const products = [
  {
    code: "PD12949UXLM",
    color: "0030854",
    priceGene: 300.311,
    stock: 0,
    descripcion: "180 x 180 x 69cm",
    name: "Mesa de Roble Macizo",
    entrega: {
      cliente: "Juan M.",
      cantidad: 1,
      estado: "Pendiente",
      fechaReserva: "2025-05-01",
    },
  },
  {
    code: "PD54892LKJE",
    color: "0047123",
    priceGene: 499.99,
    stock: 3,
    descripcion: "Silla ergonómica de oficina con respaldo alto",
    name: "Silla Ergonómica Pro",
    entrega: {
      cliente: "Lucía F.",
      cantidad: 2,
      estado: "Entregado",
      fechaReserva: "2025-04-28",
    },
  },
  {
    code: "PD98214XZOT",
    color: "0078009",
    priceGene: 1299.0,
    stock: 5,
    descripcion: "Sofá de 3 plazas, tapizado en lino gris",
    name: "Sofá Moderno",
    entrega: {
      cliente: "Carlos G.",
      cantidad: 1,
      estado: "Pendiente",
      fechaReserva: "2025-05-03",
    },
  },
  {
    code: "PD00213RMNS",
    color: "0056234",
    priceGene: 215.75,
    stock: 10,
    descripcion: "Mesa de noche con dos cajones",
    name: "Mesa de Noche Clara",
    entrega: {
      cliente: "María L.",
      cantidad: 4,
      estado: "Entregado",
      fechaReserva: "2025-04-20",
    },
  },
  {
    code: "PD77431QLWO",
    color: "0065411",
    priceGene: 890.5,
    stock: 2,
    descripcion: "Cama King Size de madera natural",
    name: "Cama Oslo",
    entrega: {
      cliente: "Santiago V.",
      cantidad: 1,
      estado: "Pendiente",
      fechaReserva: "2025-05-05",
    },
  },
];

const options = [
  "Cliente",
  "Fecha",
  "Codigo de Producto",
  "Nombre",
  "Pendiente",
  "Entregado",
];

const ReservationTable = () => {
  return (
    <>
      <div className="w-full h-full bg-white rounded-lg shadow overflow-x-auto p-1">
        <div className="w-full mt-2">
          <div className="flex text-[15px] font-medium rounded-t-lg overflow-hidden ">
            <div className="w-full cursor-pointer px-4 py-2 flex items-center justify-center transition-all duration-200 text-xl text-center bg-white text-[#3c2f1c] border-t-2 border-x-2 border-[#e8d5a2] rounded-t-md shadow-md">
              Productos Reservados
            </div>
            <div className="w-full cursor-pointer px-4 py-2 transition-all duration-200 text-xl text-center text-[#3c2f1c] border-b-2 border-[#e8d5a2] rounded-t-md shadow-md ">
              <div className="w-full flex items-center justify-end gap-2">
                <div className="flex items-center bg-[#fcf5e9] border-[2px] border-[#f5e6c9] rounded-md px-3 py-1 w-[280px] font-medium">
                  <SearchIcon color="#5c4c3a" className="text-[#5c4c3a]" />
                  <input
                    type="text"
                    placeholder="Buscar "
                    className="bg-transparent outline-none w-full text-[#5c4c3a] placeholder-[#5c4c3a] text-[15px]"
                  />
                </div>
                <FiltroDropdown opciones={options} />
              </div>
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white px-4 mt-3 rounded-b-lg shadow-sm ">
          <table className="w-full s text-[#3c2f1c] text-md text-center">
            <thead>
              <tr className="grid grid-cols-6   font-medium px-4 py-2 border-b border-[#e6d8be] bg-white">
                <th>Fecha</th>
                <th>Reservado Por</th>
                <th>Descripción</th>
                <th>Cantidad</th>
                <th>Color de tela</th>
                <th>Entrega</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr
                  key={index}
                  className={`grid grid-cols-6 items-center px-4 py-3 ${
                    index % 2 === 0 ? "bg-white" : "bg-[#fefaf3]"
                  }`}
                >
                  <td>{product.entrega.fechaReserva}</td>
                  <td>
                    <div className="flex flex-col">
                      <span>→ {product.entrega.cliente}</span>
                    </div>
                  </td>
                  <td>{product.name}</td>
                  <td>{product.entrega.cantidad}</td>
                  <td>{product.color}</td>
                  <td>
                    <span
                      className={`text-sm font-semibold px-3 py-1 rounded-full ${
                        product.entrega.estado === "Pendiente"
                          ? "bg-[var(--bg-state-red)] text-[var(--text-state-red)]"
                          : "bg-[var(--bg-state-green)] text-[var(--text-state-green)]"
                      }`}
                    >
                      {product.entrega.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ReservationTable;
