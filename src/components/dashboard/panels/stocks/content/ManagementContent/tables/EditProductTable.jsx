import { useMemo, useState } from "react";
import { useAuthStore } from "../../../../../../../api/auth/auth.store";
import { usePaginatedTableData } from "../../../../../../../hooks/usePaginatedTableData";
import { Delete, Edit } from "../../../../../../../assets/icons";
import { GenericTable, Message } from "../../../../../widgets";
import {
  useUploadProducts,
  useUpdateProduct,
  useCreateProduct,
} from "../../../../../../../api/products/products.queries";
import { useQueryClient } from "@tanstack/react-query";
import { searchProductsByBranches } from "../../../../../../../api/products/products.api";

const EditProductTable = () => {
  const [search, setSearch] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "success" });

  const [editingRowId, setEditingRowId] = useState(null);
  const [editedRowData, setEditedRowData] = useState({});
  const [tempProducts, setTempProducts] = useState([]);

  const user = useAuthStore((state) => state.user);
  const branchId = user?.branchId;

  const limit = 10;
  const queryClient = useQueryClient();

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
    limit,
    enabled: !!branchId,
  });

  const { mutate: uploadProducts } = useUploadProducts({
    onSuccess: () => {
      setMessage({ text: "Archivo subido correctamente ✅", type: "success" });
    },
    onError: () => {
      setMessage({ text: "Error al subir archivo ❌", type: "error" });
    },
  });

  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();

  const handleAddProduct = () => {
    const tempId = `temp-${Date.now()}`;
    const newProduct = {
      id: tempId,
      description: "",
      isNew: true,
    };

    setTempProducts((prev) => [newProduct, ...prev]);
    setEditingRowId(tempId);
    setEditedRowData(newProduct);
  };

  const handleEditCell = (id, key, value) => {
    if (id === editingRowId) {
      setEditedRowData((prev) => ({
        ...prev,
        [key]: value,
      }));
    }
  };

  const handleEditProduct = (row) => {
    setEditingRowId(row.id);
    setEditedRowData({ description: row.description });
  };

  const handleCancelEdit = () => {
    if (editedRowData.isNew) {
      setTempProducts((prev) =>
        prev.filter((product) => product.id !== editedRowData.id)
      );
    }

    setEditingRowId(null);
    setEditedRowData({});
  };

  const handleDelete = async (row) => {
    try {
      await updateProductMutation.mutateAsync({
        id: row.id,
        available: false,
      });

      setMessage({
        text: "Producto deshabilitado correctamente ✅",
        type: "success",
      });

      queryClient.invalidateQueries(["products"]);
    } catch (err) {
      console.log(err);
      setMessage({
        text: `${err.response?.data?.message || "Error al eliminar ❌"}`,
        type: "error",
      });
    }
  };

  const handleSaveProduct = async () => {
    try {
      if (editedRowData.isNew) {
        await createProductMutation.mutateAsync({
          description: editedRowData.description,
          available: true,
        });

        setMessage({
          text: "Producto creado correctamente ✅",
          type: "success",
        });

        // Eliminar el temporal una vez guardado
        setTempProducts((prev) =>
          prev.filter((p) => p.id !== editedRowData.id)
        );
      } else {
        await updateProductMutation.mutateAsync({
          id: editingRowId,
          description: editedRowData.description,
        });

        setMessage({
          text: "Producto actualizado correctamente ✅",
          type: "success",
        });
      }

      queryClient.invalidateQueries(["products"]);
    } catch (error) {
      setMessage({ text: "Error al guardar producto ❌", type: "error" });
    } finally {
      setEditingRowId(null);
      setEditedRowData({});
    }
  };

  const products = useMemo(() => {
    const fromApi = rawProducts.map(({ product }) => ({
      description: product?.description,
      ...product,
    }));

    return [...tempProducts, ...fromApi];
  }, [rawProducts, tempProducts]);

  const columns = [
    {
      key: "code",
      label: "CÓDIGO",
    },
    {
      key: "description",
      label: "DESCRIPCIÓN",
      render: (_, row) =>
        row.id === editingRowId ? (
          <input
            type="text"
            className="border px-2 py-1 rounded w-full"
            value={editedRowData.description || ""}
            onChange={(e) =>
              handleEditCell(row.id, "description", e.target.value)
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
        row.id === editingRowId ? (
          <div className="flex gap-2 justify-center items-center">
            <button
              onClick={handleSaveProduct}
              className="text-green-600 text-xl"
              title="Guardar"
            >
              ✔
            </button>
            <button
              onClick={handleCancelEdit}
              className="text-red-600 text-xl"
              title="Cancelar"
            >
              ✖
            </button>
          </div>
        ) : (
          <div className="flex gap-2 justify-center items-center">
            <button className="text-gray-700" title="Editar producto">
              <Edit color="black" onClick={() => handleEditProduct(row)} />
            </button>
            <button>
              <Delete onClick={() => handleDelete(row)} />
            </button>
          </div>
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
      <Message
        message={message.text}
        type={message.type}
        onClose={() => setMessage({ text: "" })}
        duration={5000}
      />

      <div className="flex flex-col md:flex-row justify-center items-center w-full px-4">
        <h2 className="text-2xl font-semibold text-[#2c2b2a]">
          EDITAR PRODUCTOS
        </h2>
      </div>

      <div className="mt-6 flex justify-around items-center w-[90%]">
        <input
          type="text"
          placeholder="Buscar producto..."
          className="border px-2 rounded w-full max-w-md"
          style={{ height: "40px" }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex items-center justify-center gap-4">
          <label
            htmlFor="fileUpload"
            className={`px-4 py-2 rounded cursor-pointer ${
              isLoading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-green-600 text-white hover:opacity-80"
            }`}
          >
            {isLoading ? "Subiendo archivo..." : "Subir archivo"}
          </label>

          <input
            id="fileUpload"
            type="file"
            className="hidden"
            disabled={isLoading}
            onChange={(e) => {
              const selectedFile = e.target.files[0];
              if (selectedFile) {
                setFile(selectedFile);
                uploadProducts(selectedFile);
              }
            }}
          />

          <button
            className="bg-[var(--brown-dark-800)] py-2 px-3 rounded text-white cursor-pointer"
            onClick={handleAddProduct}
          >
            + Añadir
          </button>
        </div>
      </div>

      <div className="mt-4">
        <GenericTable
          columns={columns}
          data={products}
          enableFilter={false}
          enablePagination={true}
          externalPagination={true}
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
