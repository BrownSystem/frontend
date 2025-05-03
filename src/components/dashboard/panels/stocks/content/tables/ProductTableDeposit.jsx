import React, { useState } from "react";
import { useStockViewStore } from "@store/useStockViewStore";
import { StockStatus } from "../../../../widgets";
import { SearchIcon } from "../../../../../../assets/icons";
import RemitoModal from "../../../../../common/Modal/RemiModal";

const initialProducts = [
  {
    code: "PD12949UXLM",
    color: "Rojo",
    priceGene: 300.311,
    myDeposit: 2,
    stock: 5,
    description: "Mesa de Roble Macizo",
  },
  {
    code: "FS12945UFLM",
    color: "Verde",
    priceGene: 300.311,
    myDeposit: 1,
    stock: 1,
    description: "Silla Tapizada de Cuero",
  },
  {
    code: "TT32945TMLM",
    color: "Amarillo",
    priceGene: 475.5,
    myDeposit: 3,
    stock: 12,
    description: "Sofá Esquinero de Lino",
  },
  {
    code: "LK52948UJLM",
    color: "Marron",
    priceGene: 210.0,
    myDeposit: 2,
    stock: 8,
    description: "Lámpara de Pie Minimalista",
  },
];

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

const ProductTableDeposit = ({ title, span, backTo }) => {
  const setView = useStockViewStore((state) => state.setViewSafe);

  const [products, setProducts] = useState(initialProducts);
  const [quantities, setQuantities] = useState(
    initialProducts.reduce((acc, p) => ({ ...acc, [p.code]: 0 }), {})
  );
  const [selectedProduct, setSelectedProduct] = useState({});

  const handleQuantityChange = (code, delta) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => {
        if (p.code === code) {
          if (delta > 0 && p.stock === 0) return p;
          if (delta < 0 && quantities[code] === 0) return p;

          return {
            ...p,
            myDeposit: p.myDeposit + delta,
            stock: p.stock - delta,
          };
        }
        return p;
      })
    );

    setQuantities((prev) => {
      const newQty = Math.max(0, (prev[code] || 0) + delta);
      return { ...prev, [code]: newQty };
    });
  };

  const [showModal, setShowModal] = useState(false);

  return (
    <div className="w-full h-full bg-white rounded-lg shadow overflow-x-auto p-4">
      <div className="w-full mt-4">
        <div className="flex text-[15px] font-medium rounded-t-lg overflow-hidden ">
          <div className="w-full cursor-pointer px-4 py-2 flex items-center justify-center transition-all duration-200 text-2xl text-center bg-white text-[#3c2f1c] border-t-2 border-x-2 border-[#e8d5a2] rounded-t-md shadow-md">
            {title}
            <span className="ml-1 mt-1 text-[18px] text-[var(--brown-ligth-400)]">
              ({span})
            </span>
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

              <div
                className="flex items-center bg-[var(--brown-ligth-400)] border-[2px] border-[var(--brown-ligth-400)] rounded-md px-2 py-2 w-[60px] font-medium cursor-pointer"
                onClick={() => setShowModal(true)}
              >
                <p className="bg-transparent outline-none w-full text-white text-[15px]">
                  Pedir
                </p>
              </div>

              {backTo ? (
                <div
                  className="flex items-center bg-black border-[2px] border-black rounded-md px-2 py-2 w-auto font-medium cursor-pointer"
                  onClick={() => setView({ name: "depositos" })}
                >
                  <p className="bg-transparent outline-none w-full text-white text-[15px]">
                    Cancelar
                  </p>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white px-4 py-2 rounded-b-lg shadow-sm mt-4 overflow-y-hidden h-auto">
        <table className="w-full text-left text-[#3c2f1c] text-md">
          <thead>
            <tr className="grid grid-cols-7 font-medium px-4 py-2 border-b border-[#e6d8be] ">
              <th>Código</th>
              <th>Descripción</th>
              <th className="text-center">Mi depósito</th>
              <th className="text-center">Stock</th>
              <th>Color Tela</th>
              <th>Cantidad</th>
              <th className="text-center">Pedir</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.code}
                className="grid grid-cols-7 items-center px-4 py-3 cursor-pointer transition border-b border-[#f0e6d5] bg-white even:bg-[#f7ecd9] hover:bg-[#fff3e4]"
              >
                <td className="font-medium">{product.code}</td>
                <td>{product.description}</td>
                <td className="flex justify-center items-center">
                  <StockStatus value={product.myDeposit} />
                </td>
                <td className="flex justify-center items-center">
                  <StockStatus value={product.stock} />
                </td>
                <td>{product.color}</td>
                <td>
                  <div className="flex items-center gap-2 justify-center">
                    <button
                      onClick={() => handleQuantityChange(product.code, -1)}
                      className="text-[#b97a56] font-bold text-xl px-2"
                      style={{ all: "unset" }}
                    >
                      −
                    </button>
                    <span className="min-w-[20px] text-center">
                      {quantities[product.code]}
                    </span>
                    {product.stock > 0 && (
                      <button
                        onClick={() => handleQuantityChange(product.code, 1)}
                        className="text-[#b97a56] font-bold text-xl px-2"
                        style={{ all: "unset" }}
                      >
                        +
                      </button>
                    )}
                  </div>
                </td>
                <td className="flex justify-center">
                  <input
                    type="checkbox"
                    checked={!!selectedProduct[product.code]}
                    onChange={(e) =>
                      setSelectedProduct((prev) => ({
                        ...prev,
                        [product.code]: e.target.checked,
                      }))
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal ? (
        <RemitoModal
          productos={productos}
          onCancel={() => setShowModal(false)}
          onConfirm={() => {
            alert("Pedido confirmado");
            setShowModal(true);
          }}
        />
      ) : null}
    </div>
  );
};

export default ProductTableDeposit;
