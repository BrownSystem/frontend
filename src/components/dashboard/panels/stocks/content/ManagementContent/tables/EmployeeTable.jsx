import { useState } from "react";
import { Edit } from "../../../../../../../assets/icons";
import { GenericTable } from "../../../../../widgets";

const initialClients = [
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
  const [clientes, setClientes] = useState(initialClients);

  const columns = [
    { key: "nombre", label: "NOMBRE" },
    { key: "razonSocial", label: "FRENTE A I.V.A" },
    { key: "documento", label: "DOCUMENTO" },
    { key: "correo", label: "EMAIL" },
    { key: "telefono", label: "TÉLEFONO" },
    {
      key: "accion",
      label: "EDITAR",
      render: (_, row, index) => (
        <div className="w-full flex justify-center">
          <Edit color="#3a3835" />
        </div>
      ),
    },
  ];

  return (
    <div className="w-full h-full overflow-x-auto">
      {/* Título y Buscador */}
      <div className="flex flex-col md:flex-row justify-center items-center w-full px-4 ">
        <h2 className="text-2xl  font-semibold text-[#2c2b2a]">
          EDITAR CLIENTES
        </h2>
      </div>
      {/* Tabla */}
      <div>
        <GenericTable
          columns={columns}
          data={clientes}
          enableFilter={true}
          enablePagination={true}
        />
      </div>
    </div>
  );
};

export default EditClient;
