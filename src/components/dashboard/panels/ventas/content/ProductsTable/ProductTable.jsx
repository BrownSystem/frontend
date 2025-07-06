import { useState, useMemo } from "react";
import { useAuthStore } from "../../../../../../api/auth/auth.store";
import { usePaginatedTableData } from "../../../../../../hooks/usePaginatedTableData";
import { searchProducts } from "../../../../../../api/products/products.api";
import { GenericTable, StockStatus } from "../../../../widgets";
import { ShowEyes } from "../../../../../../assets/icons";
const ProductTable = () => {
  const user = useAuthStore((state) => state.user);
  const branchId = user?.branchId;

  const [search, setSearch] = useState("");
  const limit = 6;

  // Usamos hook reutilizable para manejar paginación, búsqueda y peticiones
  const {
    data: rawProducts,
    page,
    setPage,
    isLoading,
    totalPages,
  } = usePaginatedTableData({
    fetchFunction: searchProducts,
    queryKeyBase: "products",
    search,
    branchId,
    limit,
    enabled: !!branchId,
  });

  // Mapeamos la data para la tabla
  const products = useMemo(() => {
    return rawProducts.map(({ product, inventory }) => ({
      code: product?.code,
      name: product?.description,
      stock: inventory?.stock ?? 0,
      color: "N/A",
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
        No se encontró una sucursal asociada al usuario.
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4 p-4 rounded-lg">
      <div className="w-full mt-1 flex justify-center items-center">
        <div className="text-3xl font-semibold text-[#3c2f1c]">
          PRODUCTOS{" "}
          <span className="text-[18px] text-[var(--brown-ligth-400)]">
            (Seleccionar para inspeccionar)
          </span>
        </div>
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
        data={products}
        enableFilter={false} // Ya hacemos búsqueda fuera, con debounce
        enablePagination={true}
        externalPagination={true}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
        paginationDisabled={isLoading}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProductTable;
