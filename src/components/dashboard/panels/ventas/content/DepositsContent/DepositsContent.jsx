import { useQueryClient } from "@tanstack/react-query";

import { BsEye } from "react-icons/bs";
import { useState } from "react";
import { useAuthStore } from "../../../../../../api/auth/auth.store";
import { useShopViewStore } from "@store/useShopViewStore";
import { motion } from "framer-motion";

import {
  useCreateBranch,
  useFindAllBranch,
  useUpdateBranch,
} from "../../../../../../api/branch/branch.queries";
import { GenericTable, Message } from "../../../../widgets";
import {
  Delete,
  Edit,
  HideEyes,
  ShowEyes,
} from "../../../../../../assets/icons";
import { useMessageStore } from "../../../../../../store/useMessage";

const DepositsContent = () => {
  const queryClient = useQueryClient();
  const { data: branches = [], isLoading } = useFindAllBranch();
  const setView = useShopViewStore((state) => state.setViewSafe);
  const { setMessage } = useMessageStore();

  const setUser = useAuthStore((state) => state.user);
  const isAdmin = setUser?.role === "ADMIN";
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
            <motion.div
              className="cursor-pointer"
              initial="closed"
              whileHover="open"
              onClick={() => handleRowClick(row)}
            >
              <div className="flex items-center justify-center relative w-7 h-7">
                {/* Ojo cerrado */}
                <motion.div
                  key="closed"
                  variants={{
                    closed: { opacity: 1, scale: 1 },
                    open: { opacity: 0, scale: 0.8 },
                  }}
                  transition={{ duration: 0.2 }}
                  className="absolute"
                >
                  <HideEyes size={28} />
                </motion.div>

                {/* Ojo abierto */}
                <motion.div
                  key="open"
                  variants={{
                    closed: { opacity: 0, scale: 0.8 },
                    open: { opacity: 1, scale: 1 },
                  }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-[0.5px] left-[0.5px]"
                >
                  <ShowEyes size={30} />
                </motion.div>
              </div>
            </motion.div>
            {isAdmin && (
              <>
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
              </>
            )}
          </div>
        ),
    },
  ];

  return (
    <div className="w-full flex flex-col gap-4 p-4 rounded-lg">
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
