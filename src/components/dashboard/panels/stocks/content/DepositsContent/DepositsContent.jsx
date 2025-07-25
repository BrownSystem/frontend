import { useStockViewStore } from "@store/useStockViewStore";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCreateBranch,
  useFindAllBranch,
  useUpdateBranch,
} from "../../../../../../api/branch/branch.queries";
import { BsEye } from "react-icons/bs";
import { GenericTable, Message } from "../../../../widgets";
import { useState } from "react";
import { Delete, Edit } from "../../../../../../assets/icons";

const DepositsContent = () => {
  const queryClient = useQueryClient();
  const { data: branches = [], isLoading } = useFindAllBranch();
  const setView = useStockViewStore((state) => state.setViewSafe);
  const [message, setMessage] = useState({ text: "", type: "success" });

  const createBranchMutation = useCreateBranch();
  const updateBranchMutation = useUpdateBranch();

  const [editingRowId, setEditingRowId] = useState(null);
  const [editedRowData, setEditedRowData] = useState({});

  const handleAddDeposit = () => {
    const newDeposit = {
      id: `temp-${Date.now()}`,
      name: "",
      location: "",
      productsTotal: 0,
      canTransfer: false,
      wasRecentlyRestocked: false,
      isNew: true,
    };

    queryClient.setQueryData(["branch"], (old = []) => [
      newDeposit,
      ...(old || []),
    ]);
    setEditingRowId(newDeposit.id);
    setEditedRowData(newDeposit);
  };

  const handleEditCell = (id, key, value) => {
    if (id === editingRowId) {
      setEditedRowData((prev) => ({
        ...prev,
        [key]: value,
      }));
    }
  };

  const handleSaveRow = async () => {
    const { name, location, isNew } = editedRowData;
    try {
      if (isNew) {
        await createBranchMutation.mutateAsync({ name, location });
        setMessage({ text: "Sucursal o Depósito creado.", type: "success" });
      } else {
        await updateBranchMutation.mutateAsync({
          id: editedRowData.id,
          name,
          location,
        });
        setMessage({
          text: "Sucursal actualizada correctamente.",
          type: "success",
        });
      }
    } catch {
      setMessage({ text: "Error al guardar los datos.", type: "error" });
    } finally {
      setEditingRowId(null);
      setEditedRowData({});
      queryClient.invalidateQueries(["branch"]);
    }
  };

  const handleCancelEdit = () => {
    if (editedRowData.isNew) {
      queryClient.setQueryData(["branch"], (old = []) =>
        old.filter((item) => item.id !== editedRowData.id)
      );
    }
    setEditingRowId(null);
    setEditedRowData({});
  };

  const handleEditBranch = (row) => {
    setEditingRowId(row.id);
    setEditedRowData({ ...row });
  };

  const handleDeleteBranch = async (row) => {
    try {
      await updateBranchMutation.mutateAsync({ id: row.id, available: false });
      setMessage({
        text: "Sucursal eliminada correctamente.",
        type: "success",
      });
      queryClient.invalidateQueries(["branch"]);
    } catch {
      setMessage({ text: "Error al eliminar sucursal.", type: "error" });
    }
  };

  const handleRowClick = (deposit) => {
    if (editingRowId === deposit.id) return;
    setView({
      name: "products_of_deposit",
      props: {
        title: deposit?.name,
        span: deposit?.location,
        backTo: true,
        branchId: deposit?.id,
      },
    });
  };

  const deposits = branches.map((branch) => {
    if (branch.id === editingRowId) {
      return { ...editedRowData };
    }
    return branch;
  });

  const columns = [
    {
      key: "name",
      label: "NOMBRE",
      editable: true,
      render: (_, row) =>
        row.id === editingRowId ? (
          <input
            type="text"
            className="border rounded px-2 py-1 w-full"
            value={editedRowData.name || ""}
            onChange={(e) => handleEditCell(row.id, "name", e.target.value)}
          />
        ) : (
          row.name
        ),
    },
    {
      key: "location",
      label: "UBICACIÓN",
      editable: true,
      render: (_, row) =>
        row.id === editingRowId ? (
          <input
            type="text"
            className="border rounded px-2 py-1 w-full"
            value={editedRowData.location || ""}
            onChange={(e) => handleEditCell(row.id, "location", e.target.value)}
          />
        ) : (
          row.location
        ),
    },
    {
      key: "actions",
      label: "INSPECCIONAR",
      render: (_, row) =>
        row.id === editingRowId ? (
          <div className="flex justify-center gap-2">
            <button
              onClick={handleSaveRow}
              disabled={
                createBranchMutation.isLoading || updateBranchMutation.isLoading
              }
              className="text-green-600 text-xl cursor-pointer"
              title="Guardar"
            >
              ✔
            </button>
            <button
              onClick={handleCancelEdit}
              className="text-red-600 text-xl cursor-pointer"
              title="Cancelar"
            >
              ✖
            </button>
          </div>
        ) : (
          <div className="flex gap-2 justify-center items-center">
            <BsEye
              className="w-6 h-6 cursor-pointer"
              onClick={() => handleRowClick(row)}
              title="Inspeccionar productos"
            />
            <button
              onClick={() => handleDeleteBranch(row)}
              className="text-red-600"
              title="Eliminar depósito"
            >
              <Delete />
            </button>
            <button
              onClick={() => handleEditBranch(row)}
              className="text-gray-700"
              title="Editar depósito"
            >
              <Edit color="black" />
            </button>
          </div>
        ),
    },
  ];

  return (
    <div className="w-full flex flex-col gap-4 p-4 rounded-lg">
      <Message
        message={message.text}
        type={message.type}
        onClose={() => setMessage({ text: "" })}
        duration={3000}
      />
      <div className="w-full mt-1 flex flex-col justify-center items-center">
        <div className="text-3xl font-semibold text-[#3c2f1c]">
          DEPÓSITOS{" "}
          <span className="text-[18px] text-[var(--brown-ligth-400)]">
            (Seleccionar para inspeccionar)
          </span>
        </div>
      </div>

      <GenericTable
        columns={columns}
        data={deposits}
        enableFilter={true}
        enablePagination={true}
        showAddButton={true}
        onAddRow={handleAddDeposit}
        isLoading={
          isLoading ||
          createBranchMutation.isLoading ||
          updateBranchMutation.isLoading
        }
      />
    </div>
  );
};

export default DepositsContent;
