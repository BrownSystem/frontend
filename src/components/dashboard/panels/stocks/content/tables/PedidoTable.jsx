// PedidoTable.tsx
import { useState } from "react";
import { FiltroDropdown } from "../../../../widgets";
import { SearchIcon, ShowEyes } from "../../../../../../assets/icons";
import { ConfirmationModalRemito } from "../../../../../common";

const productos = [
  { codigo: "PD12949ULM", descripcion: "Mesa de Roble Macizo", cantidad: 5 },
  {
    codigo: "FS12945ULFM",
    descripcion: "Silla Tapizada de Cuero",
    cantidad: 1,
  },
  {
    codigo: "LK52948ULNM",
    descripcion: "Lámpara de Pie Minimalista",
    cantidad: 2,
  },
];

const pedidosRealizados = [
  {
    fecha: "12/04/2025",
    origen: "Castro Barros",
    destino: "Depósito Jesús María",
    productos: 3,
    estado: "Confirmado",
  },
  {
    fecha: "16/04/2025",
    origen: "Depósito Alta Córdoba",
    destino: "Depósito Hyper",
    productos: 4,
    estado: "Pendiente",
  },
  {
    fecha: "16/04/2025",
    origen: "Depósito Alta Córdoba",
    destino: "Depósito Hyper",
    productos: 4,
    estado: "Pendiente",
  },
  {
    fecha: "16/04/2025",
    origen: "Depósito Alta Córdoba",
    destino: "Depósito Hyper",
    productos: 4,
    estado: "Confirmado",
  },
];

const pedidosAConfirmar = [
  {
    fecha: "12/04/2025",
    origen: "Hyper ",
    destino: "Depósito Jesús María",
    productos: 2,
    estado: "Pendiente",
  },
  {
    fecha: "12/04/2025",
    origen: "Hyper ",
    destino: "Depósito Jesús María",
    productos: 2,
    estado: "Confirmado",
  },
  {
    fecha: "16/04/2025",
    origen: "Depósito Alta Córdoba",
    destino: "Depósito Hyper",
    productos: 1,
    estado: "Pendiente",
  },
  {
    fecha: "16/04/2025",
    origen: "Depósito Alta Córdoba",
    destino: "Depósito Hyper",
    productos: 1,
    estado: "Confirmado",
  },
];

const opciones = ["Todos", "Pendiente", "Confirmado"];

const PedidoTable = () => {
  const [tags, onCambiar] = useState("realizados");
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="w-full h-full bg-white rounded-lg shadow overflow-x-auto p-4">
      <div className="w-full flex justify-between">
        <div className="flex items-center bg-[var(--brown-ligth-50)] border-[2px] border-[#f5e6c9] rounded-md px-3 py-2 w-[280px] font-medium">
          <SearchIcon color="#5c4c3a" className="text-[#5c4c3a]" />
          <input
            type="text"
            placeholder="Buscar pedidos"
            className="bg-transparent outline-none w-full text-[#5c4c3a] placeholder-[#5c4c3a] text-[15px]"
          />
        </div>
        <FiltroDropdown opciones={opciones} id={"PedidoTable"} />
      </div>

      <div className="w-full mt-4">
        <div className="flex text-[15px] font-medium rounded-t-lg overflow-hidden bg-[#ffefd4]">
          <div
            className={`w-full cursor-pointer px-4 py-2 transition-all duration-200 text-xl text-center ${
              tags === "realizados"
                ? "bg-white text-[#3c2f1c] border-t-2 border-x-2 border-[#e8d5a2] rounded-t-md shadow-md"
                : "text-[#8a775a] border-b-2 border-[#e8d5a2]"
            }`}
            onClick={() => onCambiar("realizados")}
          >
            Pedidos enviados
          </div>
          <div
            className={`w-full px-4 py-2 transition-all duration-200 text-xl text-center cursor-pointer ${
              tags === "confirmar"
                ? "bg-white text-[#3c2f1c] border-t-2 border-x-2 border-[#e8d5a2] rounded-t-md shadow-md"
                : "text-[#8a775a] border-b-2 border-[#e8d5a2]"
            }`}
            onClick={() => onCambiar("confirmar")}
          >
            Pedidos recibidos
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white p-4 rounded-b-lg shadow-sm">
        <table className="w-full text-left text-[#3c2f1c] text-md">
          <thead>
            <tr className="grid grid-cols-5 font-medium px-4 py-2 border-b border-[#e6d8be] bg-white">
              <th>Fecha</th>
              <th>Origen y destino</th>
              <th>Productos</th>
              <th>Estado</th>
              <th>Detalles</th>
            </tr>
          </thead>
          <tbody>
            {tags === "realizados"
              ? pedidosRealizados.map((pedido, index) => (
                  <tr
                    key={index}
                    className={`grid grid-cols-5 items-center px-4 py-3 ${
                      index % 2 === 0 ? "bg-white" : "bg-[#fefaf3]"
                    }`}
                  >
                    <td>{pedido.fecha}</td>
                    <td>
                      <div className="flex flex-col">
                        <span>{pedido.origen}</span>
                        <span className="text-xs text-[#86734f]">
                          → {pedido.destino}
                        </span>
                      </div>
                    </td>
                    <td>
                      {pedido.productos ? `${pedido.productos} productos` : "-"}
                    </td>
                    <td>
                      <span
                        className={`text-sm font-semibold px-3 py-1 rounded-full ${
                          pedido.estado === "Confirmado"
                            ? "bg-[var(--bg-state-green)] text-[var(--text-state-green)]"
                            : "bg-[var(--bg-state-yellow)] text-[var(--text-state-yellow)]"
                        }`}
                      >
                        {pedido.estado}
                      </span>
                    </td>
                    <td
                      className="flex items-center gap-2"
                      onClick={() => setShowModal(true)}
                    >
                      <ShowEyes />
                    </td>
                  </tr>
                ))
              : pedidosAConfirmar.map((pedido, index) => (
                  <tr
                    key={index}
                    className={`grid grid-cols-5 items-center px-4 py-3 ${
                      index % 2 === 0 ? "bg-white" : "bg-[#fefaf3]"
                    }`}
                  >
                    <td>{pedido.fecha}</td>
                    <td>
                      <div className="flex flex-col">
                        <span>{pedido.origen}</span>
                        <span className="text-xs text-[#86734f]">
                          → {pedido.destino}
                        </span>
                      </div>
                    </td>
                    <td>
                      {pedido.productos ? `${pedido.productos} productos` : "-"}
                    </td>
                    <td>
                      <span
                        className={`text-sm font-semibold px-3 py-1 rounded-full ${
                          pedido.estado === "Confirmado"
                            ? "bg-[var(--bg-state-green)] text-[var(--text-state-green)]"
                            : "bg-[var(--bg-state-yellow)] text-[var(--text-state-yellow)]"
                        }`}
                      >
                        {pedido.estado}
                      </span>
                    </td>
                    <td className="flex gap-2">
                      <span
                        className="cursor-pointe"
                        onClick={() => setShowModal(true)}
                      >
                        <ShowEyes />
                      </span>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      {/* Tabla */}

      {showModal ? (
        <ConfirmationModalRemito
          productos={productos}
          onCancel={() => setShowModal(false)}
          onConfirm={() => {
            alert("Pedido confirmado");
            setShowModal(false); // Cerrar modal después de confirmar
          }}
        />
      ) : null}
    </div>
  );
};

export default PedidoTable;
