import { useCallback, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../../../../../../api/auth/auth.store";
import { usePaginatedTableData } from "../../../../../../../hooks/usePaginatedTableData";
import {
  useUploadProducts,
  useUpdateProduct,
  useCreateProduct,
} from "../../../../../../../api/products/products.queries";
import { searchProductsByBranches } from "../../../../../../../api/products/products.api";
import { useMessageStore } from "../../../../../../../store/useMessage";
import { Button, GenericTable } from "../../../../../widgets";
import { Delete, Duplicate, Edit } from "../../../../../../../assets/icons";

/* =======================
   CONSTANTES
======================= */
const PAGE_LIMIT = 20;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/* =======================
   COMPONENTE
======================= */
const EditProductTable = () => {
  const queryClient = useQueryClient();
  const { setMessage } = useMessageStore();
  const user = useAuthStore((s) => s.user);
  const branchId = user?.branchId;

  /* =======================
     STATES
  ======================= */
  const [search, setSearch] = useState("");
  const [tempProducts, setTempProducts] = useState([]);
  const [editing, setEditing] = useState(null); // { id, description, isNew }

  const fileInputRef = useRef(null);

  /* =======================
     DATA
  ======================= */
  const {
    data: rawProducts,
    page,
    setPage,
    isLoading,
    totalPages,
  } = usePaginatedTableData({
    fetchFunction: searchProductsByBranches,
    queryKeyBase: "products",
    search,
    branchId,
    limit: PAGE_LIMIT,
    enabled: !!branchId,
  });

  /* =======================
     MUTATIONS
  ======================= */
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const { mutate: uploadProducts } = useUploadProducts({
    onSuccess: () =>
      setMessage({ text: "Archivo subido correctamente ✅", type: "success" }),
    onError: () =>
      setMessage({ text: "Error al subir archivo ❌", type: "error" }),
  });

  /* =======================
     HANDLERS
  ======================= */
  const startCreate = useCallback(() => {
    const tempId = `temp-${Date.now()}`;
    const newProduct = { id: tempId, description: "", isNew: true };

    setTempProducts((p) => [newProduct, ...p]);
    setEditing(newProduct);
  }, []);

  const startEdit = useCallback((row) => {
    setEditing({ id: row.id, description: row.description, isNew: false });
  }, []);

  const cancelEdit = useCallback(() => {
    if (editing?.isNew) {
      setTempProducts((p) => p.filter((x) => x.id !== editing.id));
    }
    setEditing(null);
  }, [editing]);

  const saveProduct = useCallback(async () => {
    if (!editing?.description?.trim()) {
      setMessage({ text: "La descripción es obligatoria", type: "error" });
      return;
    }

    try {
      if (editing.isNew) {
        await createProduct.mutateAsync({
          description: editing.description,
        });

        setMessage({ text: "Producto creado ✅", type: "success" });

        setTempProducts((p) => p.filter((x) => x.id !== editing.id));
      } else {
        await updateProduct.mutateAsync({
          id: editing.id,
          description: editing.description,
        });

        setMessage({ text: "Producto actualizado ✅", type: "success" });
      }

      queryClient.invalidateQueries({ queryKey: ["products"] });
    } catch (error) {
      setMessage({
        text: error?.response?.data?.message,
        type: "error",
      });
    } finally {
      setEditing(null);
    }
  }, [editing, createProduct, updateProduct, queryClient, setMessage]);

  const deleteProduct = useCallback(
    async (row) => {
      if (!confirm("¿Eliminar producto?")) return;

      try {
        await updateProduct.mutateAsync({
          id: row.id,
          available: false,
        });

        setMessage({ text: "Producto eliminado ✅", type: "success" });
        queryClient.invalidateQueries(["products"]);
      } catch (error) {
        console.log(error.response.data.message);
        setMessage({
          text: `Error: ${error.response.data.message} `,
          type: "error",
        });
      }
    },
    [updateProduct, queryClient, setMessage]
  );

  const duplicateProduct = useCallback((row) => {
    const tempId = `temp-${Date.now()}`;
    const duplicated = {
      id: tempId,
      description: row.description,
      isNew: true,
    };

    setTempProducts((p) => [duplicated, ...p]);
    setEditing(duplicated);
  }, []);

  /* =======================
     FILE UPLOAD
  ======================= */
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert("El archivo supera los 5MB");
      return;
    }

    uploadProducts(file);
    e.target.value = "";
  };

  /* =======================
     DATA NORMALIZADA
  ======================= */
  const products = useMemo(() => {
    const apiProducts = rawProducts.map(({ product }) => product);
    return [...tempProducts, ...apiProducts];
  }, [rawProducts, tempProducts]);

  /* =======================
     COLUMNS
  ======================= */
  const columns = [
    { key: "code", label: "CÓDIGO" },
    {
      key: "description",
      label: "DESCRIPCIÓN",
      render: (_, row) =>
        editing?.id === row.id ? (
          <input
            className="border px-2 py-1 rounded w-full"
            value={editing.description}
            onChange={(e) =>
              setEditing((p) => ({ ...p, description: e.target.value }))
            }
          />
        ) : (
          row.description
        ),
    },
    {
      key: "actions",
      label: "ACCIONES",
      render: (_, row) =>
        editing?.id === row.id ? (
          <div className="flex gap-2 justify-center">
            <button onClick={saveProduct}>✔</button>
            <button onClick={cancelEdit}>✖</button>
          </div>
        ) : (
          <div className="flex gap-2 justify-center">
            <Edit
              color={"var(--brown-dark-800)"}
              onClick={() => startEdit(row)}
            />
            <Duplicate
              color={"var(--brown-dark-800)"}
              onClick={() => duplicateProduct(row)}
            />
            <Delete onClick={() => deleteProduct(row)} />
          </div>
        ),
    },
  ];

  /* =======================
     RENDER
  ======================= */
  if (!branchId) {
    return (
      <div className="text-center text-red-500">
        Usuario sin sucursal asignada
      </div>
    );
  }

  return (
    <div className="w-full h-full py-4">
      <div className="flex justify-between items-center mb-4">
        <input
          placeholder="Buscar..."
          className="border px-2 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex gap-3">
          <Button
            text="Subir archivo"
            onClick={() => fileInputRef.current.click()}
          />
          <Button text="+ Añadir" onClick={startCreate} />
        </div>

        <input
          ref={fileInputRef}
          type="file"
          hidden
          accept=".csv,.xlsx"
          onChange={handleFileChange}
        />
      </div>

      <GenericTable
        columns={columns}
        data={products}
        enablePagination
        externalPagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        isLoading={isLoading}
      />
    </div>
  );
};

export default EditProductTable;
