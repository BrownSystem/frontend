import { useState } from "react";
import { EditProductModal } from "../../../../../../common";
import { Edit, SearchIcon } from "../../../../../../../assets/icons";
import { GenericTable } from "../../../../../widgets";

const initialProducts = [
  {
    code: "PD12949UXLM",
    color: "0030854",
    priceGene: 300.311,
    stock: 0,
    descripcion: "180 x 180 x 69cm",
    name: "Mesa de Roble Macizo",
  },
  {
    code: "FS12945UFLM",
    color: "0030854",
    priceGene: 300.311,
    stock: 1,
    descripcion: "180 x 180 x 69cm",
    name: "Silla Tapizada de Cuero",
  },
  {
    code: "TT32945TMLM",
    color: "0030854",
    priceGene: 475.5,
    stock: 1,
    descripcion: "180 x 180 x 69cm",
    name: "Sofá Esquinero de Lino",
  },
  {
    code: "FS12945UFLM",
    color: "0030854",
    priceGene: 300.311,
    stock: 2,
    descripcion: "180 x 180 x 70cm",
    name: "Silla Tapizada de Cuero",
  },
];

const EditProductTable = () => {
  const [products, setProducts] = useState(initialProducts);
  const [showModal, setShowModal] = useState(false);

  const columns = [
    { key: "code", label: "CÓDIGO" },
    { key: "name", label: "DESCRIPCIÓN" },
    { key: "color", label: "COLOR" },

    {
      key: "ver",
      label: "EDITAR",
      render: (_, row, index) => (
        <span
          className="flex items-center justify-center gap-2 cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          <Edit color="#333332" />
        </span>
      ),
    },
  ];

  return (
    <div className="w-full h-full  overflow-x-auto py-2">
      {showModal && <EditProductModal onClose={() => setShowModal(false)} />}

      {/* Título y filtro */}
      <div className="flex flex-col md:flex-row justify-center items-center w-full px-4 ">
        <h2 className="text-2xl  font-semibold text-[#2c2b2a]">
          EDITAR PRODUCTOS
        </h2>
      </div>

      {/* Tabla */}
      <div className="mt-4">
        <GenericTable
          columns={columns}
          data={products}
          enableFilter={true}
          enablePagination={true}
        />
      </div>
    </div>
  );
};

export default EditProductTable;
