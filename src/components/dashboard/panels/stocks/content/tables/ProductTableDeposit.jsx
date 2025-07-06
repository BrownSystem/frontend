import React, { useState } from "react";
import { useStockViewStore } from "@store/useStockViewStore";
import { GenericTable, StockStatus } from "../../../../widgets";
import { ShowEyes } from "../../../../../../assets/icons";

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
    code: "PD12949UXLM",
    color: "0030854",
    priceGene: 300.311,
    stock: 0,
    descripcion: "180 x 180 x 69cm",
    name: "Mesa de Roble Macizo",
  },
];

const ProductTableDeposit = ({ title, span, backTo }) => {
  const setView = useStockViewStore((state) => state.setViewSafe);
  const [products, setProducts] = useState(initialProducts);
  const columns = [
    { key: "code", label: "CÓDIGO" },
    { key: "name", label: "DESCRIPCIÓN" },
    {
      key: "stock",
      label: "STOCK",
      render: (value) => <StockStatus value={value} />,
    },
    { key: "color", label: "COLOR TELA" },
    {
      key: "actions",
      label: "",
      render: (_, row) => <ShowEyes data={row} />,
    },
  ];

  return (
    <div className="w-full  rounded-lg shadow overflow-x-auto p-4 relative">
      {/* Encabezado */}
      <div className="w-full mt-1 flex justify-center items-center">
        <div className="text-3xl font-semibold text-[#3c2f1c]">
          {title}{" "}
          <span className="text-[18px] text-[var(--brown-ligth-400)]">
            ({span})
          </span>
        </div>
      </div>
      <div className="absolute top-5 left-25">
        {backTo && (
          <button
            onClick={() => setView({ name: "depositos" })}
            className="px-4 py-2 bg-black text-white rounded-md"
          >
            Volver
          </button>
        )}
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

export default ProductTableDeposit;
