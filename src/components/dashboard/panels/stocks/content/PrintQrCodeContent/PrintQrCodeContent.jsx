import { useMemo, useState } from "react";
import { useAuthStore } from "../../../../../../api/auth/auth.store";
import { usePaginatedTableData } from "../../../../../../hooks/usePaginatedTableData";
import { useDownloadPdfQrs } from "../../../../../../api/products/products.queries";
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

  const limit = 10;

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
    setShowModal(false); // opcional, si querés cerrar el modal
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
            className="w-16 text-center border rounded px-2"
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
    <div className="w-full flex flex-col gap-4 py-2 rounded-lg">
      <div className="w-full mt-1 flex justify-around items-center">
        <div className="text-3xl font-semibold text-[#3c2f1c]">
          DESCARGAR QR
          <span className="text-[18px] text-[var(--brown-ligth-400)]">
            {" "}
            (Seleccionar para crear pdf)
          </span>
        </div>
        <button
          onClick={handleOpenModal}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
        >
          Visualizar Selección
        </button>
      </div>
      <input
        type="text"
        placeholder="Buscar producto..."
        className="border px-2 py-1 rounded w-full max-w-md mx-auto"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
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

      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-2xl">
            <h2 className="text-xl font-semibold mb-4 flex justify-center w-full">
              DESCARGAR PDF
            </h2>
            <ul className="space-y-2 max-h-60 overflow-y-auto px-2">
              {Object.values(selectedProducts).map((product) => (
                <li
                  key={product.code}
                  className="flex justify-between border-b pb-1"
                >
                  <span>
                    {product.name} -{" "}
                    <span className="text-gray-500">{product.code}</span>
                  </span>
                  <span className="font-semibold flex gap-2">
                    Cantidad:{" "}
                    <p className="text-green-600">{product.quantity}</p>
                  </span>
                  <button
                    onClick={() => handleRemoveProduct(product.code)}
                    title="Eliminar producto"
                    className="text-red-600 hover:text-red-800 cursor-pointer"
                  >
                    <Delete />
                    {/* O si tenés un icono: <DeleteIcon /> */}
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleClearSelection}
                className="bg-[var(--brown-dark-900)] hover:bg-[var(--brown-dark-700)] text-white px-4 py-2 rounded cursor-pointer"
              >
                Borrar selección
              </button>
              <button
                onClick={handlePrint}
                disabled={isPending}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer"
              >
                {isPending ? "Generando..." : "Confirmar descarga"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrintQrCodeContent;
