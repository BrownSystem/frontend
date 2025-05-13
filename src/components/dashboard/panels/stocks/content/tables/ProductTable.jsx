import React from "react";
import { useProductModal } from "../../../../../../store/ProductModalContext";
import { StockStatus } from "../../../../widgets";
import { SearchIcon, ShowEyes } from "../../../../../../assets/icons";

const products = [
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
            <div className="w-full cursor-pointer px-4 py-2 flex items-center justify-center transition-all duration-200 text-xl text-center bg-white text-[var(--brown-dark-900)] border-t-2 border-x-2 border-[var(--brown-ligth-300)] rounded-t-md shadow-md">
              Productos a agotar
            </div>
            <div className="w-full cursor-pointer px-4 py-2 transition-all duration-200 text-xl text-center text-[var(--brown-dark-900)] border-b-2 border-[var(--brown-ligth-300)] rounded-t-md shadow-md ">
              <div className="w-full flex items-center justify-end gap-2">
                <div className="flex items-center bg-[var(--brown-ligth-100)] border-[2px] border-[var(--brown-ligth-300)] rounded-md px-3 py-1 w-[280px] font-medium h-auto">
                  <SearchIcon
                    color="#211c5f"
                    className="text-[var(--brown-dark-900)]"
                  />
                  <input
                    type="text"
                    placeholder="Buscar productos"
                    className="bg-transparent outline-none w-full text-[var(--brown-dark-900)] placeholder-[var(--brown-dark-900)] text-[15px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white px-4 py-2 rounded-b-lg shadow-sm mt-4 overflow-y-hidden h-auto">
          <table className="w-full text-left  text-md">
            <thead className="text-[var(--brown-dark-900)]">
              <tr className="grid grid-cols-6 font-medium px-4 py-2 border-b border-[var(--brown-ligth-300)] ">
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
                    index % 2 === 0 ? "bg-white" : "bg-[var(--brown-ligth-100)]"
                  } hover:bg-[var(--brown-ligth-50)]`}
                >
                  <td className="font-medium  pl-2">{product.code}</td>
                  <td>{product.name}</td>
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
