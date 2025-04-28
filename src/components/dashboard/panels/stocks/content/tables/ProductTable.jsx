import React from "react";
import { useProductModal } from "../../../../../../store/ProductModalContext";
import { FiltroDropdown, Search, StockStatus } from "../../../../widgets";
import { SearchIcon, ShowEyes } from "../../../../../../assets/icons";

const products = [
  {
    code: "PD12949UXLM",
    color: "Rojo",
    priceGene: 300.311,
    stock: 5,
    description: "Mesa de Roble Macizo",
  },
  {
    code: "FS12945UFLM",
    color: "Verde",
    priceGene: 300.311,
    stock: 1,
    description: "Silla Tapizada de Cuero",
  },
  {
    code: "TT32945TMLM",
    color: "Amarillo",
    priceGene: 475.5,
    stock: 12,
    description: "Sofá Esquinero de Lino",
  },
  {
    code: "FS12945UFLM",
    color: "Rosa",
    priceGene: 300.311,
    stock: 7,
    description: "Silla Tapizada de Cuero",
  },
];

const opciones = ["Todos", "Precio", "Por Color"];

const ProductTable = () => {
  const { openProductDetail } = useProductModal();

  const handleClick = (product) => {
    openProductDetail(product);
  };

  return (
    <>
      <div className="w-full h-full bg-white rounded-lg shadow overflow-x-auto p-4">
        <div className="w-full mt-4">
          <div className="flex text-[15px] font-medium rounded-t-lg overflow-hidden ">
            <div className="w-full cursor-pointer px-4 py-2 flex items-center justify-center transition-all duration-200 text-xl text-center bg-white text-[#3c2f1c] border-t-2 border-x-2 border-[#e8d5a2] rounded-t-md shadow-md">
              Productos a agotar
            </div>
            <div className="w-full cursor-pointer px-4 py-2 transition-all duration-200 text-xl text-cente text-[#3c2f1c] border-b-2 border-[#e8d5a2] rounded-t-md shadow-md ">
              <div className="w-full flex items-center  justify-between gap-2">
                <div className="flex items-center bg-[#fcf5e9] border-[2px] border-[#f5e6c9] rounded-md px-3 py-1 w-[280px] font-medium">
                  <SearchIcon color="#5c4c3a" className="text-[#5c4c3a]" />
                  <input
                    type="text"
                    placeholder="Buscar productos"
                    className="bg-transparent outline-none w-full text-[#5c4c3a] placeholder-[#5c4c3a] text-[15px]"
                  />
                </div>
                <FiltroDropdown opciones={opciones} />
              </div>
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white px-4 py-2 rounded-b-lg shadow-sm mt-4 overflow-y-hidden h-auto">
          <table className="w-full text-left text-[#3c2f1c] text-md">
            <thead>
              <tr className="grid grid-cols-6 font-medium px-4 py-2 border-b border-[#e6d8be] ">
                <th>Código</th>
                <th>Descripción</th>
                <th className="text-center">Stock</th>
                <th>Color Tela</th>
                <th>Precio</th>
                <th className="text-center">Ver</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr
                  key={index}
                  onClick={() => handleClick(product)}
                  className={`grid grid-cols-6 items-center px-4 py-3 cursor-pointer transition ${
                    index % 2 === 0 ? "bg-white" : "bg-[#f7ecd9]"
                  } hover:bg-[#fff3e4]`}
                >
                  <td className="font-medium  pl-2">{product.code}</td>
                  <td>{product.description}</td>
                  <td className="flex justify-center items-center gap-2">
                    <StockStatus value={product.stock} />
                  </td>
                  <td>{product.color}</td>
                  <td>${product.priceGene}</td>
                  <td className="flex items-center justify-center gap-2">
                    <ShowEyes />
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

export default ProductTable;
