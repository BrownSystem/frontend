import { useMemo, useState } from "react";
import { useAuthStore } from "../../../../../../../api/auth/auth.store";
import { usePaginatedTableData } from "../../../../../../../hooks/usePaginatedTableData";
import { searchProducts } from "../../../../../../../api/products/products.api";
import { Edit } from "../../../../../../../assets/icons";
import { GenericTable } from "../../../../../widgets";
import { EditProductModal } from "../../../../../../common";

const EditProductTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const user = useAuthStore((state) => state.user);
  const branchId = user?.branchId;

  const limit = 6;

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

  const products = useMemo(() => {
    return rawProducts.map(({ product }) => ({
      code: product?.code,
      name: product?.description,
      color: product?.color || "N/A",
      ...product,
    }));
  }, [rawProducts]);

  const columns = [
    { key: "code", label: "CÓDIGO" },
    { key: "name", label: "DESCRIPCIÓN" },
    { key: "color", label: "COLOR" },
    {
      key: "ver",
      label: "EDITAR",
      render: (_, row) => (
        <span
          className="flex items-center justify-center gap-2 cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          <Edit color="#333332" />
        </span>
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
    <div className="w-full h-full overflow-x-auto py-2">
      {showModal && <EditProductModal onClose={() => setShowModal(false)} />}

      <div className="flex flex-col md:flex-row justify-center items-center w-full px-4">
        <h2 className="text-2xl font-semibold text-[#2c2b2a]">
          EDITAR PRODUCTOS
        </h2>
      </div>

      <div className="mt-2 flex justify-center">
        <input
          type="text"
          placeholder="Buscar producto..."
          className="border px-2 py-1 rounded w-full max-w-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="mt-4">
        <GenericTable
          columns={columns}
          data={products}
          enableFilter={false}
          enablePagination
          externalPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          paginationDisabled={isLoading}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default EditProductTable;
