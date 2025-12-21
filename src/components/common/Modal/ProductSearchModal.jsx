import { useState, useEffect, useRef } from "react";
import { useSearchProducts } from "../../../api/products/products.store";
import { useCreateProduct } from "../../../api/products/products.queries";
import { Button } from "../../dashboard/widgets";
import VoucherProducts from "../../dashboard/panels/voucher/Containers/Products/VoucherProducts";
import { ProductsIcon } from "../../../assets/icons";

const ProductSearchModal = ({ isOpen, branchId, onClose, onSelect, index }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const [search, setSearch] = useState("");

  const inputRef = useRef(null);

  // Hook para buscar productos dinámicamente según "search"
  const { data: productosFiltrados, refetch } = useSearchProducts({
    search,
    branchId,
    limit: 25,
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
          productId: result.id,
          branchId,
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
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] flex justify-center items-center z-999999 ">
      <div className="bg-[var(--brown-ligth-100)] rounded-3xl py-6 px-8 w-full max-w-3xl max-h-[85vh] ">
        {/* Header */}
        <div className="flex gap-4 justify-between items-center mb-4 border-b-[1px] p-4 border-[var(--brown-ligth-200)]">
          <div className="flex gap-4 items-center">
            <div className="bg-[var(--brown-ligth-300)] p-2 rounded-full">
              <ProductsIcon size={36} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--brown-dark-900)]">
                BUSCAR PRODUCTOS
              </h3>
              <p className="text-[14px] text-[var(--brown-dark-700)] font-normal">
                Selecciona los productos para agregar
              </p>
            </div>
          </div>
          <div>
            {/* Botón para agregar nuevo producto */}
            <div className="flex justify-end mb-4 mt-2 gap-2">
              <Button
                onClick={() => setIsAddModalOpen(true)}
                text="Añadir producto"
              />
              <Button onClick={() => onClose(true)} text="Cerrar" />
            </div>
          </div>
        </div>

        {/* Buscador */}
        <input
          ref={inputRef}
          type="text"
          placeholder="Filtrar productos por nombre o código"
          className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2 bg-[var(--brown-ligth-50)]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Lista de productos como tarjetas */}
        <div className="grid grid-cols-1  gap-4 max-h-[200px] overflow-y-auto mt-2">
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
              >
                <VoucherProducts
                  data={producto}
                  icon={<ProductsIcon size={28} />}
                  color={200}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-[var(--brown-dark-800)] mt-4">
              {search
                ? "No se encontraron productos"
                : "Empieza a escribir para buscar productos"}
            </div>
          )}
        </div>

        {/* Sub-modal para agregar producto */}
        {/* Sub-modal para agregar producto */}
        {isAddModalOpen && (
          <div className="fixed inset-0  bg-[var(--brown-dark-950)]/80 flex justify-center items-center z-[1000000]">
            <div className="bg-[var(--brown-ligth-100)] rounded-3xl py-6 px-8 w-full max-w-3xl max-h-[85vh] transition-all">
              {/* Header */}
              <div className="flex gap-4 justify-between items-center mb-4 border-b-[1px] p-4 border-[var(--brown-ligth-200)]">
                <div className="flex gap-4 items-center">
                  <div className="bg-[var(--brown-ligth-300)] p-2 rounded-full">
                    <ProductsIcon size={36} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--brown-dark-900)]">
                      CREAR PRODUCTO
                    </h3>
                    <p className="text-[14px] text-[var(--brown-dark-700)] font-normal">
                      Completa la descripción para agregarlo.
                    </p>
                  </div>
                </div>
              </div>

              {/* Input */}
              <input
                type="text"
                placeholder="Descripción del producto"
                className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2 bg-[var(--brown-ligth-50)]"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />

              {/* Botones */}
              <div className="flex justify-center gap-5 mt-3">
                <Button onClick={handleAddProduct} text={"Agregar"} />
                <Button
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setNewDescription("");
                  }}
                  text={"Cancelar"}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSearchModal;
