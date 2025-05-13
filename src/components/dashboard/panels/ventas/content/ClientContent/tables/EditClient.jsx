import React from "react";
import { Edit, SearchIcon } from "../../../../../../../assets/icons";
import { FiltroDropdown } from "../../../../../widgets";

const clientes = [
  {
    nombre: "Juan M.",
    razonSocial: "Monotributista",
    documento: "20-12345678-9",
    correo: "juan@mail.com",
    telefono: "1123456789",
    fechaAlta: "2025-01-15",
  },
  {
    nombre: "Lucía F.",
    razonSocial: "Responsable Inscripto",
    documento: "27-87654321-0",
    correo: "lucia@mail.com",
    telefono: "1198765432",
    fechaAlta: "2024-11-02",
  },
  // ...
];

const EditClient = () => {
  return (
    <div className="w-full h-full bg-white rounded-lg shadow overflow-x-auto">
      {/* Título y Buscador */}
      <div className="w-full mt-2">
        <div className="flex text-[15px] font-medium rounded-t-lg overflow-hidden">
          <div className="w-full cursor-pointer px-4 py-2 flex items-center justify-center transition-all duration-200 text-xl text-center bg-white text-[#3c2f1c] border-t-2 border-x-2 border-[#e8d5a2] rounded-t-md shadow-md">
            Clientes
          </div>
          <div className="w-full cursor-pointer px-4 py-2 transition-all duration-200 text-xl text-center text-[#3c2f1c] border-b-2 border-[#e8d5a2] rounded-t-md shadow-md">
            <div className="w-full flex items-center justify-end gap-2">
              <div className="flex items-center bg-[#fcf5e9] border-[2px] border-[#f5e6c9] rounded-md px-3 py-1 w-[280px] font-medium">
                <SearchIcon color="#5c4c3a" className="text-[#5c4c3a]" />
                <input
                  type="text"
                  placeholder="Buscar"
                  className="bg-transparent outline-none w-full text-[#5c4c3a] placeholder-[#5c4c3a] text-[15px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-b-lg shadow-sm mt-2">
        <table className="w-full text-[#3c2f1c] text-md text-center">
          <thead>
            <tr className="grid grid-cols-7 font-medium px-4 py-2 border-b border-[#e6d8be] bg-white">
              <th>Fecha de Alta</th>
              <th>Nombre</th>
              <th>Razón Social / Frente al IVA</th>
              <th>CUIT / CUIL / DNI</th>
              <th>Correo Electrónico</th>
              <th>Teléfono</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody className="">
            {clientes.map((cliente, index) => (
              <tr
                key={index}
                className={`grid grid-cols-7 items-center px-4 py-3 text-center ${
                  index % 2 === 0 ? "bg-white" : "bg-[#fefaf3]"
                }`}
              >
                <td>{cliente.fechaAlta}</td>
                <td>{cliente.nombre}</td>
                <td>{cliente.razonSocial}</td>
                <td>{cliente.documento}</td>
                <td>{cliente.correo}</td>
                <td>{cliente.telefono}</td>
                <td className="w-full flex justify-center">
                  <Edit color={"#bd8535"} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EditClient;
