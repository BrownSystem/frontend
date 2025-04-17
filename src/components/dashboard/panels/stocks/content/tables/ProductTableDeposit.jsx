import React, { useState } from "react";
import { useStockView } from "../../../../../../context/StockViewContext";
import { Search, StockStatus } from "../../../../widgets";
import RemitoModal from "../../../../widgets/RemiModal";

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
  // const { openProductDetail } = useProductModal();
  const { setView } = useStockView();

  const [products, setProducts] = useState(initialProducts);
  const [quantities, setQuantities] = useState(
    initialProducts.reduce((acc, p) => ({ ...acc, [p.code]: 0 }), {})
  );
  const [selectedProduct, setSelectedProduct] = useState({});

  const handleQuantityChange = (code, delta) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => {
        if (p.code === code) {
          const newQuantity = Math.max(0, (quantities[code] || 0) + delta);

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

  // const handleClick = (product) => openProductDetail(product);

  const [showModal, setShowModal] = useState(false);

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
          <button
            href="#"
            onClick={() => setShowModal(true)}
            className="!text-white px-4 pt-3 rounded-lg bg-gradient-to-b from-[var(--brown-ligth-400)] to-[var(--brown-dark-800)]"
          >
            Pedir
          </button>
        </div>
      </div>

      <table className="w-full text-gray-700 border-separate border-spacing-y-2">
        <thead className="text-gray-800 rounded-lg">
          <tr>
            <th className="p-3 text-left font-normal">Código</th>
            <th className="p-3 text-left font-normal">Descripción</th>
            <th className="p-3 text-left font-normal">Mi deposito</th>
            <th className="p-3 text-left font-normal">Stock</th>
            <th className="p-3 text-left font-normal">Color Tela</th>
            <th className="p-3 text-left font-normal">Cantidad</th>
            <th className="p-3 text-left font-normal">Pedir</th>
          </tr>
        </thead>

        <tbody className="w-full max-h-auto overflow">
          {products.map((product) => (
            <tr
              key={product.code}
              className="cursor-pointer bg-white shadow-md rounded-lg hover:bg-pink-50 transition"
            >
              <td className="p-3 rounded-l-lg border-l-4 border-[var(--brown-ligth-400)]">
                {product.code}
              </td>
              <td className="p-3">{product.description}</td>

              <td className="p-3">
                <span className="flex justify-center items-center">
                  <StockStatus value={product.myDeposit} />
                </span>
              </td>

              <td className="p-3 flex justify-center items-center gap-2">
                <StockStatus value={product.stock} />
              </td>

              <td className="p-3">{product.color}</td>

              <td className="p-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuantityChange(product.code, -1)}
                    className="!text-[var(--brown-ligth-400)] !font-bold !text-1xl p-4"
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
                      className="!text-[var(--brown-ligth-400)] !font-bold !text-1xl p-4"
                      style={{ all: "unset" }}
                    >
                      +
                    </button>
                  )}
                </div>
              </td>

              <td className="p-3 rounded-r-lg">
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

      {showModal ? (
        <RemitoModal
          productos={productos}
          onCancel={() => setShowModal(false)}
          onConfirm={() => {
            alert("Pedido confirmado");
            setShowModal(true);
          }}
        />
      ) : (
        ""
      )}
    </>
  );
};

export default ProductTableDeposit;
