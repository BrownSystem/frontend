import { useState, useMemo } from "react";
import { useAuthStore } from "../../../../../../api/auth/auth.store";
import { usePaginatedTableData } from "../../../../../../hooks/usePaginatedTableData";
import { GenericTable, StockStatus } from "../../../../widgets";
import { searchProductsByBranches } from "../../../../../../api/products/products.api";

const ProductTable = () => {
  const user = useAuthStore((state) => state.user);
  const branchId = user?.branchId;

  const [search, setSearch] = useState("");
  const limit = 150;

  const {
    data: rawProducts,
    page,
    setPage,
    isLoading,
    totalPages,
  } = usePaginatedTableData({
    fetchFunction: searchProductsByBranches,
    queryKeyBase: "products-branches",
    search,
    branchId,
    limit,
    enabled: !!branchId,
  });

  // Obtenemos nombres únicos de sucursales
  const branchNames = useMemo(() => {
    const branches = rawProducts.flatMap(
      (item) => item.inventoryByBranch || []
    );
    return Array.from(new Set(branches.map((b) => b.branchName)));
  }, [rawProducts]);

  // Mapeamos productos incluyendo inventario por sucursal
  const products = useMemo(() => {
    return rawProducts.map(({ product, inventoryByBranch }) => ({
      code: product?.code,
      name: product?.description,
      color: "N/A",
      inventoryByBranch,
      ...product,
    }));
  }, [rawProducts]);

  // Generamos columnas dinámicas
  const columns = useMemo(() => {
    const baseColumns = [
      { key: "code", label: "CÓDIGO" },
      { key: "name", label: "DESCRIPCIÓN" },
    ];

    const branchColumns = branchNames.map((branchName) => ({
      key: branchName,
      label: branchName,
      render: (_, row) => {
        const match = row.inventoryByBranch?.find(
          (b) => b.branchName === branchName
        );
        return <StockStatus value={match?.stock ?? "-"} />;
      },
    }));

    return [...baseColumns, ...branchColumns];
  }, [branchNames]);

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
            (Stock por sucursal)
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
        enableFilter={false}
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
