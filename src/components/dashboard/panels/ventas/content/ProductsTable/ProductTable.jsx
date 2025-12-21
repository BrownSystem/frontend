import { useState, useMemo } from "react";
import { useAuthStore } from "../../../../../../api/auth/auth.store";
import { usePaginatedTableData } from "../../../../../../hooks/usePaginatedTableData";
import { GenericTable, StockStatus } from "../../../../widgets";
import { searchProductsByBranches } from "../../../../../../api/products/products.api";
import { Duplicate, Edit, Save } from "../../../../../../assets/icons";
import { PasswordConfirmModal } from "../../../../../common";
import { useVerifyPassword } from "../../../../../../api/auth/auth.queries";
import { useUpdateStockFromList } from "../../../../../../api/products/products.queries";

const ProductTable = () => {
  const user = useAuthStore((state) => state.user);
  const branchId = user?.branchId;

  const [search, setSearch] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [editedStocks, setEditedStocks] = useState({});
  const [tempPassword, setTempPassword] = useState("");
  const [modalConfirmation, setModalConfirmation] = useState(false);

  const limit = 20;

  const {
    data: rawProducts = [],
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

  const { mutate: updateStock, isLoadingProducts } = useUpdateStockFromList({
    onSuccess: () => {
      toast.success("Stock actualizado correctamente");
    },
    onError: () => {
      toast.error("Error actualizando stock");
    },
  });

  const {
    mutate: verifyPassword,
    isLoading: verifying,
    error: verifyError,
  } = useVerifyPassword();

  const confirmPasswordAndEdit = (password) => {
    verifyPassword(
      { email: user.email, password },
      {
        onSuccess: () => {
          setModalConfirmation(false);
          setIsEditMode(true);
        },
        onError: () => {
          setIsEditMode(false);
        },
      }
    );
  };

  /* ==============================
     MANEJO DE EDICIÓN DE STOCK
  =============================== */

  const handleRowClick = (productId) => {
    if (!isEditMode) return;
    setEditingRow((prev) => (prev === productId ? null : productId));
  };

  const handleStockChange = (productId, branchId, newValue) => {
    setEditedStocks((prev) => ({
      ...prev,
      [productId]: {
        ...(prev[productId] || {}),
        [branchId]: Number(newValue),
      },
    }));
  };

  const handleSaveRow = (productId) => {
    const stocksByBranch = editedStocks[productId];
    if (!stocksByBranch) return;

    const payload = Object.entries(stocksByBranch).map(([branchId, stock]) => ({
      productId: products.find((p) => p.id === productId)?.id,
      branchId,
      stock,
    }));

    // 👉 Acá iría tu mutation
    // updateProductStock(payload)

    updateStock(payload);

    setEditingRow(null);
  };

  /* ==============================
     SUCURSALES
  =============================== */

  const branchNames = useMemo(() => {
    const branches = rawProducts.flatMap(
      (item) => item.inventoryByBranch || []
    );
    return Array.from(new Set(branches.map((b) => b.branchName)));
  }, [rawProducts]);

  const products = useMemo(() => {
    return rawProducts.map(({ product, inventoryByBranch }) => ({
      code: product?.code,
      name: product?.description,
      inventoryByBranch,
      ...product,
    }));
  }, [rawProducts]);

  /* ==============================
     COLUMNAS
  =============================== */

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

        if (!match) return <StockStatus value={0} />;

        const stockValue =
          editedStocks[row.id]?.[match.branchId] ?? match.stock ?? 0;

        if (isEditMode && editingRow === row.id) {
          return (
            <input
              type="text"
              value={stockValue}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || value === "-" || /^-?\d*$/.test(value)) {
                  handleStockChange(row.id, match.branchId, value);
                }
              }}
              onBlur={(e) => {
                if (e.target.value === "-") {
                  handleStockChange(row.id, match.branchId, 0);
                }
              }}
              className="w-[80px] text-center border border-[var(--brown-ligth-200)] rounded-md"
            />
          );
        }

        return <StockStatus value={stockValue} />;
      },
    }));

    const editColumn = isEditMode
      ? [
          {
            key: "actions",
            label: "ACCIONES",
            render: (_, row) => {
              const isRowEditing = editingRow === row.id;
              return (
                <button
                  disabled={!isEditMode}
                  onClick={() =>
                    isRowEditing
                      ? handleSaveRow(row.id)
                      : handleRowClick(row.id)
                  }
                  className={`p-2 rounded-md transition ${
                    isRowEditing
                      ? "bg-[var(--brown-ligth-300)]"
                      : "hover:bg-[var(--brown-ligth-200)]"
                  }`}
                >
                  {isRowEditing ? (
                    <Save />
                  ) : (
                    <Edit color={"var(--brown-dark-800)"} />
                  )}
                </button>
              );
            },
          },
        ]
      : [];

    return [...baseColumns, ...branchColumns, ...editColumn];
  }, [branchNames, isEditMode, editingRow, editedStocks]);

  if (!branchId) {
    return (
      <div className="text-center text-red-500 mt-8">
        No se encontró una sucursal asociada al usuario.
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col p-4 rounded-lg">
      {modalConfirmation && (
        <PasswordConfirmModal
          password={tempPassword}
          onPasswordChange={setTempPassword}
          onCancel={() => {
            setModalConfirmation(false);
            setTempPassword("");
          }}
          onConfirm={confirmPasswordAndEdit}
          isLoading={verifying}
          error={verifyError?.message}
        />
      )}

      <div className="pb-2">
        <div className="text-3xl font-semibold text-[#3c2f1c]">
          PRODUCTOS{" "}
          <span className="text-[18px] text-[var(--brown-ligth-400)]">
            (Stock por sucursal)
          </span>
        </div>

        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Buscar producto..."
            className="mt-2 w-full sm:w-1/2 h-[42px] border border-[var(--brown-ligth-200)] px-3 rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {user?.role === "ADMIN" && (
            <button
              onClick={() => setModalConfirmation(true)}
              className={`w-[50px] h-[40px] mt-2 rounded-md flex justify-center items-center ${
                isEditMode
                  ? "bg-[var(--brown-ligth-400)]"
                  : "bg-[var(--brown-dark-700)]"
              }`}
            >
              <Duplicate />
            </button>
          )}
        </div>
      </div>

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
  );
};

export default ProductTable;
