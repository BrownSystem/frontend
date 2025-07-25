import { useState } from "react";
import { useSearchProducts } from "../../../api/products/products.store";
import { useCreateProduct } from "../../../api/products/products.queries";
import { Edit } from "../../../assets/icons";

const ProductSearchModal = ({ isOpen, branchId, onClose, onSelect, index }) => {
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDescription, setNewDescription] = useState("");

  const { data: productosFiltrados } = useSearchProducts({
    search,
    branchId,
    limit: 5,
    offset: 1,
  });

  const createProductMutation = useCreateProduct();

  const handleAddProduct = async () => {
    if (!newDescription.trim()) return;

    try {
      const result = await createProductMutation.mutateAsync({
        description: newDescription,
      });

      // Seleccionar automáticamente el nuevo producto
      onSelect(
        {
          descripcion: result.description,
        },
        index
      );

      setNewDescription("");
      setIsAddModalOpen(false);
      onClose();
      refetch();
    } catch (err) {
      console.error("Error al crear producto:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.7)] flex justify-center items-center z-50">
      <div className="bg-white rounded-md shadow-lg py-2 px-6 w-full max-w-2xl min-h-[300px] max-h-[90vh] overflow-auto transition-all duration-200">
        <div className="flex justify-end items-start mb-1">
          <button onClick={onClose} className="text-red-600 font-bold text-xl">
            ×
          </button>
        </div>

        <div className="relative mb-4 w-full">
          <input
            type="text"
            placeholder="Buscar por nombre o código"
            className="border px-3 py-2 rounded w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span
            className="absolute right-2 top-2 cursor-pointer"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Edit color={"black"} />
          </span>
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
        {/* Sub-modal para agregar nuevo producto */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-white flex flex-col justify-center items-center rounded-md px-4 ">
            <h2 className="text-lg font-bold mb-4">Agregar nuevo producto</h2>
            <input
              type="text"
              placeholder="Descripción del producto"
              className="border px-3 py-2 rounded mb-3"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded"
                onClick={handleAddProduct}
              >
                Agregar
              </button>
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setNewDescription("");
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSearchModal;
