import React, { useEffect, useState } from "react";
import { useSearchProducts } from "../../../api/products/products.store";
import { useFindAllBranch } from "../../../api/branch/branch.queries";

const ProductSearchModal = ({ isOpen, onClose, onSelect, index }) => {
  const [search, setSearch] = useState("");
  const [branchId, setBranchId] = useState("");
  const { data: branches } = useFindAllBranch();
  const { data: productosFiltrados } = useSearchProducts({
    search,
    branchId,
    limit: 5,
    offset: 1,
  });

  useEffect(() => {
    if (branches?.length > 0) {
      setBranchId(branches[0].id);
    }
  }, [branches]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.7)] flex justify-center items-center z-50">
      <div className="bg-white rounded-md shadow-lg p-6 w-full max-w-2xl min-h-[300px] max-h-[90vh] overflow-auto transition-all duration-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-brown-900">
            Buscar producto
          </h2>
          <button onClick={onClose} className="text-red-600 font-bold text-xl">
            ×
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Buscar por nombre o código"
            className="border px-3 py-2 rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="border px-3 py-2 rounded"
            value={branchId}
            onChange={(e) => setBranchId(e.target.value)}
          >
            {branches?.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <div className="min-h-[180px]">
          {productosFiltrados?.data?.length > 0 ? (
            <ul className="divide-y">
              {productosFiltrados.data.map((producto) => (
                <li
                  key={producto.product.id}
                  className="py-2 px-2 hover:bg-brown-100 cursor-pointer"
                  onClick={() => {
                    onSelect(
                      {
                        productId: producto.product.id,
                        branchId,
                        descripcion: producto.product.description,
                        precio: producto.product.price || 0,
                      },
                      index
                    );
                    onClose();
                  }}
                >
                  <div className="flex justify-between items-center text-sm">
                    <span>{producto.product.description}</span>
                    <span className="text-gray-500">
                      Stock: {producto.inventory.stock}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Código: {producto.product.code}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-500 text-sm mt-4">
              No se encontraron productos.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductSearchModal;
