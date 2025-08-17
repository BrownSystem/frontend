import { useMemo, useState } from "react";
import { useAuthStore } from "../../../../../../api/auth/auth.store";
import { usePaginatedTableData } from "../../../../../../hooks/usePaginatedTableData";
import {
  useDownloadPdfProducts,
  useDownloadPdfQrs,
} from "../../../../../../api/products/products.queries";
import { GenericTable } from "../../../../widgets";
import { Delete } from "../../../../../../assets/icons";
import { searchProductsByBranches } from "../../../../../../api/products/products.api";

const PrintQrCodeContent = () => {
  const user = useAuthStore((state) => state.user);
  const branchId = user?.branchId;

  const [search, setSearch] = useState("");
  const [selectedProducts, setSelectedProducts] = useState({});
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const { mutate: downloadPdf, isPending } = useDownloadPdfQrs();
  const { mutate: downloadPdfProducts, isPendingPdfProducts } =
    useDownloadPdfProducts();

  const limit = 150;

  const {
    data: products,
    page,
    setPage,
    isLoading,
    totalPages,
  } = usePaginatedTableData({
    fetchFunction: searchProductsByBranches,
    queryKeyBase: "products",
    search,
    branchId,
    limit,
    enabled: !!branchId,
  });

  const mappedProducts = useMemo(() => {
    return products.map(({ product }) => ({
      code: product?.code,
      priceGene: product?.priceGene,
      stock: product?.stock,
      descripcion: product?.description,
      name: product?.description,
    }));
  }, [products]);

  const handleToggleSelect = (product) => {
    setSelectedProducts((prev) => {
      const exists = !!prev[product.code];
      if (exists) {
        const updated = { ...prev };
        delete updated[product.code];
        return updated;
      }
      return { ...prev, [product.code]: { ...product, quantity: 1 } };
    });
  };

  const handleClearSelection = () => {
    setSelectedProducts({});
    setShowModal(false);
  };

  const handleQuantityChange = (code, quantity) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [code]: { ...prev[code], quantity: Number(quantity) },
    }));
  };

  const handleRemoveProduct = (code) => {
    setSelectedProducts((prev) => {
      const updated = { ...prev };
      delete updated[code];
      return updated;
    });
  };

  const allVisibleSelected =
    visibleProducts.length > 0 &&
    visibleProducts.every((p) => selectedProducts[p.code]);

  const handleToggleAll = () => {
    const updated = { ...selectedProducts };

    if (allVisibleSelected) {
      visibleProducts.forEach((p) => {
        delete updated[p.code];
      });
    } else {
      visibleProducts.forEach((p) => {
        updated[p.code] = {
          ...p,
          quantity: selectedProducts[p.code]?.quantity || 1,
        };
      });
    }

    setSelectedProducts(updated);
  };

  const handleOpenModal = () => {
    const toPrint = Object.values(selectedProducts).filter(
      (p) => p.quantity > 0
    );

    if (toPrint.length === 0) {
      alert("Seleccione al menos un producto con cantidad válida.");
      return;
    }

    setShowModal(true);
  };

  const handlePrint = () => {
    const filtered = Object.values(selectedProducts).filter(
      (p) => p.quantity > 0
    );

    const toPrint = filtered.map((p) => ({
      code: p.code,
      quantity: p.quantity,
    }));

    downloadPdf(
      { products: toPrint },
      {
        onSuccess: () => {
          setShowModal(false);
        },
        onError: () => {
          alert("Hubo un error al generar el PDF.");
        },
      }
    );
  };

  const handleDownloadProducts = () => {
    const filtered = Object.values(selectedProducts).filter(
      (p) => p.quantity > 0
    );

    const toPrint = filtered.map((p) => ({
      code: p.code,
      quantity: p.quantity,
    }));

    downloadPdfProducts(
      { products: toPrint },
      {
        onSuccess: () => {
          setShowModal(false);
        },
        onError: () => {
          alert("Hubo un error al generar el PDF.");
        },
      }
    );
  };

  const columns = [
    { key: "code", label: "CÓDIGO" },
    { key: "name", label: "DESCRIPCIÓN" },
    {
      key: "quantity",
      label: "CANTIDAD",
      render: (_, row) =>
        selectedProducts[row.code] ? (
          <input
            type="number"
            min={1}
            value={selectedProducts[row.code]?.quantity || ""}
            onChange={(e) => handleQuantityChange(row.code, e.target.value)}
            className="w-20 text-center border border-[var(--brown-ligth-200)] rounded-lg px-2 py-1 shadow-sm focus:ring-2 focus:ring-[var(--brown-dark-700)] outline-none transition"
          />
        ) : (
          "-"
        ),
    },
    {
      key: "select",
      label: (
        <input
          type="checkbox"
          checked={allVisibleSelected}
          onChange={handleToggleAll}
          title="Seleccionar todos visibles"
        />
      ),
      render: (_, row) => (
        <input
          type="checkbox"
          checked={!!selectedProducts[row.code]}
          onChange={() => handleToggleSelect(row)}
        />
      ),
    },
  ];

  if (!branchId) {
    return (
      <div className="text-center text-red-500 mt-8">
        No se encontró una sucursal asociada al usuario.
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 py-6 px-4 bg-[#fffdf8]">
      {/* Header */}
      <div className="w-full flex justify-around items-center">
        <h1 className="text-3xl font-bold text-[var(--brown-dark-900)]">
          DESCARGAR QR
          <span className="block text-base font-normal text-[var(--brown-ligth-400)]">
            Selecciona productos para crear un PDF
          </span>
        </h1>
        <button
          onClick={handleOpenModal}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-xl shadow transition"
        >
          Visualizar Selección
        </button>
      </div>

      {/* Search input */}
      <input
        type="text"
        placeholder="🔍 Buscar producto por nombre o código..."
        className="border border-[var(--brown-ligth-200)] px-4 py-3 rounded-xl shadow-sm w-full max-w-lg focus:outline-none focus:ring-2 focus:ring-[var(--brown-dark-700)] transition mx-auto"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Table */}
      <GenericTable
        columns={columns}
        data={mappedProducts}
        onVisibleDataChange={setVisibleProducts}
        enablePagination
        externalPagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
        paginationDisabled={isLoading}
        isLoading={isLoading}
      />

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-[95%] max-w-3xl animate-fade-in-up">
            <h2 className="text-2xl font-bold text-center text-[var(--brown-dark-900)] mb-6">
              Productos Seleccionados
            </h2>

            <ul className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {Object.values(selectedProducts).map((product) => (
                <li
                  key={product.code}
                  className="flex justify-between items-center border-b border-gray-200 pb-2"
                >
                  <span className="text-[var(--brown-dark-900)] font-medium">
                    {product.name}{" "}
                    <span className="text-[var(--brown-ligth-400)] text-sm">
                      ({product.code})
                    </span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="font-semibold text-green-600">
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
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded-xl shadow transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleClearSelection}
                className="bg-[var(--brown-dark-900)] hover:bg-[var(--brown-dark-700)] text-white px-5 py-2 rounded-xl shadow transition"
              >
                🗑 Borrar selección
              </button>
              <button
                onClick={handlePrint}
                disabled={isPending}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl shadow transition disabled:opacity-50"
              >
                {isPending ? "Generando..." : "Descargar QRs"}
              </button>
              <button
                onClick={handleDownloadProducts}
                disabled={isPendingPdfProducts}
                className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-xl shadow transition disabled:opacity-50"
              >
                {isPendingPdfProducts ? "Generando..." : "Exportar Catálogo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrintQrCodeContent;
