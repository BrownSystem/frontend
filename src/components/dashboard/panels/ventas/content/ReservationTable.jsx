import React from "react";
import { SearchIcon } from "../../../../../assets/icons";
import { GenericTable } from "../../../widgets";

const reservas = [
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

const ReservationTable = () => {
  const columns = [
    {
      key: "fechaReserva",
      label: "FECHA",
      className: "text-center",
      render: (_, row) => row.entrega.fechaReserva,
    },
    {
      key: "cliente",
      label: "CLIENTE",
      className: "text-center",
      render: (_, row) => (
        <div className="flex flex-col">
          <span>{row.entrega.cliente}</span>
        </div>
      ),
    },
    {
      key: "name",
      label: "DESCRIPCIÓN",
      className: "text-center",
    },
    {
      key: "cantidad",
      label: "CANTIDAD",
      className: "text-center",
      render: (_, row) => row.entrega.cantidad,
    },
    {
      key: "color",
      label: "COLOR",
      className: "text-center",
    },
    {
      key: "estado",
      label: "ENTREGA",
      className: "text-center",
      render: (_, row) => (
        <span
          className={`text-sm font-semibold px-3 py-1 rounded-full ${
            row.entrega.estado === "Pendiente"
              ? "bg-[var(--bg-state-red)] text-[var(--text-state-red)]"
              : "bg-[var(--bg-state-green)] text-[var(--text-state-green)]"
          }`}
        >
          {row.entrega.estado}
        </span>
      ),
    },
  ];

  return (
    <div className="w-full h-full rounded-lg shadow overflow-x-auto p-1">
      {/* Título y Buscador */}
      <div className="flex flex-col md:flex-row justify-center items-center w-full px-4 ">
        <h2 className="text-2xl  font-semibold text-[#2c2b2a]">RESERVAS</h2>
      </div>

      {/* Tabla */}
      <div className="bg-white px-4 mt-3 rounded-b-lg shadow-sm">
        <GenericTable
          columns={columns}
          data={reservas}
          enablePagination={true}
          enableFilter={true}
        />
      </div>
    </div>
  );
};

export default ReservationTable;
