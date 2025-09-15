import { Delete, Products } from "../../../assets/icons";
import { Button } from "../../dashboard/widgets";

const SelecetedProductsQrModal = ({
  setShowModal,
  selectedProducts,
  handleClearSelection,
  handlePrint,
  isPending,
  handleDownloadProducts,
  isPendingPdfProducts,
  handleRemoveProduct,
}) => {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center">
      <div className="bg-[var(--brown-ligth-100)] rounded-3xl shadow-2xl py-6 px-8 w-full max-w-3xl max-h-[85vh] transition-all">
        {/* Header */}
        <div className="flex gap-4 justify-between items-center mb-4 border-b-[1px] p-4 border-[var(--brown-ligth-200)]">
          <div className="flex gap-4 items-center">
            <div className="bg-[var(--brown-ligth-300)] p-2 rounded-full">
              <Products size={36} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--brown-dark-900)]">
                PRODUCTOS SELECCIONADOS
              </h3>
              <p className="text-[14px] text-[var(--brown-dark-700)] font-normal">
                Puedes eliminar los productos que no desees incluir.
              </p>
            </div>
          </div>
        </div>

        <ul className="space-y-3 max-h-80 overflow-y-auto pr-2">
          {Object.values(selectedProducts).map((product) => (
            <li
              key={product.code}
              className="flex justify-between items-center border-b border-gray-200 pb-2"
            >
              <span className="text-[var(--brown-dark-900)] font-medium">
                {product.name}{" "}
                <span className="text-[var(--brown-dark-700)] text-sm">
                  ({product.code})
                </span>
              </span>
              <span className="flex items-center gap-2">
                <span className="font-semibold text-[var(--brown-dark-700)]">
                  x{product.quantity}
                </span>
                <button
                  onClick={() => handleRemoveProduct(product.code)}
                  title="Eliminar producto"
                  className="text-red-600 hover:text-red-800 transition"
                >
                  <Delete />
                </button>
              </span>
            </li>
          ))}
        </ul>

        {/* Modal Actions */}
        <div className="flex flex-wrap justify-end gap-4 mt-8">
          <Button text="Cancelar" onClick={() => setShowModal(false)} />
          <Button text="Borrar Selección" onClick={handleClearSelection} />
          <Button
            text={isPending ? "Generando..." : "Descargar QRs"}
            onClick={handlePrint}
            disabled={isPending}
          />
          <Button
            text={isPendingPdfProducts ? "Generando..." : "Exportar Catálogo"}
            onClick={handleDownloadProducts}
            disabled={isPendingPdfProducts}
          />
        </div>
      </div>
    </div>
  );
};

export default SelecetedProductsQrModal;
