import React from "react";
import { useProductModal } from "../../../../../../context/ProductModalContext";
import { useStockView } from "../../../../../../context/StockViewContext";
import { Search, StockStatus } from "../../../../widgets";
import { StockIcon } from "../../../../../../assets/icons/Icon";
import { HideEyes } from "../../../../../../assets/icons";

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
    code: "LK52948UJLM",
    color: "Marron",
    priceGene: 210.0,
    stock: 8,
    description: "Lámpara de Pie Minimalista",
  },
];

const ProductTable = ({ title, span, backTo }) => {
  const { openProductDetail } = useProductModal();
  const { setView } = useStockView();

  const handleClick = (product) => openProductDetail(product);

  return (
    <>
      <div className="flex justify-between px-2">
        <h1 className="!text-3xl font-normal text-gray-700">
          {title} <span className="text-gray-500 text-[20px]">({span})</span>
        </h1>
        <div className="flex gap-2">
          <Search placeholder="Buscar productos" />
          {backTo && (
            <a
              href="#"
              onClick={() => setView({ name: "depositos", props: null })}
              className="!text-white px-4 pt-3 rounded-lg bg-gradient-to-b from-[var(--brown-ligth-400)] to-[var(--brown-dark-800)]"
            >
              Volver
            </a>
          )}
        </div>
      </div>

      <table className="w-full text-gray-700 border-separate border-spacing-y-2">
        <thead className="text-gray-800 rounded-lg">
          <tr>
            <th className="p-3 text-left font-normal">Código</th>
            <th className="p-3 text-left font-normal">Descripción</th>
            <th className="p-3 text-left font-normal">Stock</th>
            <th className="p-3 text-left font-normal">Color Tela</th>
            <th className="p-3 text-left font-normal">Precio</th>
            <th className="p-3 text-left font-normal">Ver</th>
          </tr>
        </thead>

        <tbody className="w-full max-h-auto overflow">
          {products.map((product) => (
            <tr
              key={product.code}
              onClick={() => handleClick(product)}
              className="cursor-pointer bg-white shadow-md rounded-lg hover:bg-pink-50 transition"
            >
              <td className="p-3 rounded-l-lg border-l-4 border-[var(--brown-ligth-400)]">
                {product.code}
              </td>
              <td className="p-3">{product.description}</td>
              <td className="p-3 flex justify-center items-center gap-2">
                <StockStatus value={product.stock} />
              </td>
              <td className="p-3">{product.color}</td>
              <td className="p-3">${product.priceGene}</td>
              <td className="p-3 rounded-r-lg">
                <a href="#">
                  <HideEyes />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ProductTable;
