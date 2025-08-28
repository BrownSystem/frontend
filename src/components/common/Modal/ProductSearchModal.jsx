import { useState, useEffect, useRef } from "react";
import { useSearchProducts } from "../../../api/products/products.store";
import { useCreateProduct } from "../../../api/products/products.queries";

const ProductSearchModal = ({ isOpen, branchId, onClose, onSelect, index }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const [search, setSearch] = useState("");

  const inputRef = useRef(null);

  // Hook para buscar productos dinámicamente según "search"
  const { data: productosFiltrados, refetch } = useSearchProducts({
    search,
    branchId,
    limit: 150,
    offset: 1,
  });

  const createProductMutation = useCreateProduct();

  // Enfocar buscador automáticamente al abrir modal
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [isOpen]);

  const handleAddProduct = async () => {
    if (!newDescription.trim()) return;

    try {
      const result = await createProductMutation.mutateAsync({
        description: newDescription,
      });

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
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] flex justify-center items-center z-999999 transition-opacity">
      <div className="bg-[#fffdf8] rounded-3xl shadow-2xl py-6 px-8 w-full max-w-3xl max-h-[85vh] overflow-auto transition-all">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[var(--brown-dark-900)]">
            Seleccionar Producto
          </h2>
          <button
            onClick={onClose}
            className="text-red-600 font-bold text-3xl hover:text-red-700 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Buscador */}
        <input
          ref={inputRef}
          type="text"
          placeholder="Filtrar productos por nombre o código"
          className="w-full mb-6 h-12 px-4 rounded-xl border border-[var(--brown-ligth-200)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--brown-dark-700)] transition"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Botón para agregar nuevo producto */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[var(--brown-dark-700)] hover:bg-[var(--brown-dark-800)] text-white font-medium px-5 py-2 rounded-xl shadow transition"
          >
            + Añadir producto
          </button>
        </div>

        {/* Lista de productos como tarjetas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto">
          {productosFiltrados?.data?.length > 0 ? (
            productosFiltrados.data.map((producto) => (
              <div
                key={producto.product.id}
                onClick={() => {
                  onSelect(
                    {
                      productId: producto.product.id,
                      branchId,
                      descripcion: producto.product.description,
                    },
                    index
                  );
                  setSearch("");
                  onClose();
                }}
                className="p-4 bg-[#fefcf9] border border-[var(--brown-ligth-200)] rounded-2xl shadow hover:shadow-lg cursor-pointer relative transition-all flex flex-col justify-between"
              >
                <span className="font-semibold text-[var(--brown-dark-900)] mb-2">
                  {producto.product.description}
                </span>
                <span className="text-sm text-[var(--brown-ligth-400)]">
                  Código: {producto.product.code}
                </span>
                <span className="absolute bg-[var(--brown-ligth-400)] text-white rounded-full font-bold w-[20px] h-[22px] text-center right-0 top-0 ">
                  {producto.inventory.stock}
                </span>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 mt-4">
              {search
                ? "No se encontraron productos"
                : "Empieza a escribir para buscar productos"}
            </div>
          )}
        </div>

        {/* Sub-modal para agregar producto */}
        {/* Sub-modal para agregar producto */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-[rgba(0,0,0,0.55)] backdrop-blur-sm flex justify-center items-center z-[1000000]">
            <div className="bg-[#fffdf8] rounded-3xl shadow-2xl w-full max-w-lg p-8 animate-fade-in-up border border-[var(--brown-ligth-200)]">
              {/* Título */}
              <h3 className="text-2xl font-bold text-[var(--brown-dark-900)] mb-8 text-center">
                Agregar nuevo producto
              </h3>

              {/* Input */}
              <input
                type="text"
                placeholder="Descripción del producto"
                className="border border-[var(--brown-ligth-200)] px-5 py-3 rounded-2xl w-full mb-8 
                   focus:outline-none focus:ring-4 focus:ring-[var(--brown-dark-700)]/40
                   placeholder-gray-600 text-[var(--brown-dark-900)] transition"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />

              {/* Botones */}
              <div className="flex justify-center gap-5">
                <button
                  onClick={handleAddProduct}
                  className="bg-[var(--brown-dark-700)] hover:bg-[var(--brown-dark-800)] text-white 
                     font-semibold px-7 py-3 rounded-2xl transition shadow-md hover:shadow-lg"
                >
                  Agregar
                </button>
                <button
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setNewDescription("");
                  }}
                  className="bg-[var(--brown-ligth-400)] hover:bg-[var(--brown-dark-500)] text-white 
                     font-semibold px-7 py-3 rounded-2xl transition shadow-md hover:shadow-lg"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSearchModal;
