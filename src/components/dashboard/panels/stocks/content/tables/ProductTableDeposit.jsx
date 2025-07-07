import React, { useState, useMemo } from "react";
import { useStockViewStore } from "@store/useStockViewStore";
import { GenericTable, StockStatus } from "../../../../widgets";
import { ShowEyes } from "../../../../../../assets/icons";
import { usePaginatedTableData } from "../../../../../../hooks/usePaginatedTableData";
import { searchProducts } from "../../../../../../api/products/products.api";

const ProductTableDeposit = ({ title, span, backTo, branchId }) => {
  const setView = useStockViewStore((state) => state.setViewSafe);
  const [search, setSearch] = useState("");

  // Usamos el hook de paginación y búsqueda
  const {
    data: rawProducts,
    page,
    setPage,
    isLoading,
    totalPages,
  } = usePaginatedTableData({
    fetchFunction: searchProducts, // o la función que filtre productos por sucursal
    queryKeyBase: "products_of_branch",
    search,
    branchId,
    limit: 6,
    enabled: !!branchId,
  });

  // Mapear productos para la tabla
  const products = useMemo(() => {
    return rawProducts.map(({ product, inventory }) => ({
      code: product?.code,
      name: product?.description,
      stock: inventory?.stock ?? 0,
      color: product?.color || "N/A",
      ...product,
    }));
  }, [rawProducts]);

  const columns = useMemo(
    () => [
      { key: "code", label: "CÓDIGO" },
      { key: "name", label: "DESCRIPCIÓN" },
      {
        key: "stock",
        label: "STOCK",
        render: (value) => <StockStatus value={value} />,
      },
      { key: "color", label: "COLOR TELA" },
      {
        key: "actions",
        label: "",
        render: (_, row) => <ShowEyes data={row} />,
      },
    ],
    []
  );

  if (!branchId) {
    return (
      <div className="text-center text-red-500 mt-8">
        No se encontró una sucursal asociada.
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg shadow overflow-x-auto p-4 relative">
      {/* Header */}
      <div className="w-full mt-1 flex justify-center items-center">
        <div className="text-3xl font-semibold text-[#3c2f1c]">
          {title}{" "}
          <span className="text-[18px] text-[var(--brown-ligth-400)]">
            ({span})
          </span>
        </div>
      </div>

      {/* Back button */}
      <div className="absolute top-5 left-6">
        {backTo && (
          <button
            onClick={() => setView({ name: "depositos" })}
            className="px-4 py-2 bg-black text-white rounded-md"
          >
            Volver
          </button>
        )}
      </div>

      {/* Search input */}
      <div className="mt-4 max-w-md mx-auto">
        <input
          type="text"
          placeholder="Buscar producto..."
          className="border px-2 py-1 rounded w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Tabla */}
      <div className="mt-4">
        <GenericTable
          columns={columns}
          data={products}
          enableFilter={false} // Ya haces búsqueda externa
          enablePagination={true}
          externalPagination={true}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(newPage) => setPage(newPage)}
          paginationDisabled={isLoading}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ProductTableDeposit;
