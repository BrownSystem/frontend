import { useStockViewStore } from "@store/useStockViewStore";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCreateBranch,
  useFindAllBranch,
  useUpdateBranch,
} from "../../../../../../api/branch/branch.queries";
import { BsEye } from "react-icons/bs";
import { GenericTable } from "../../../../widgets";

const DepositsContent = () => {
  const queryClient = useQueryClient();
  const { data: branches = [], isLoading } = useFindAllBranch();
  const setView = useStockViewStore((state) => state.setViewSafe);
  const renderContent = useStockViewStore((state) => state.renderContent);

  const createBranchMutation = useCreateBranch();
  const updateBranchMutation = useUpdateBranch();

  const handleAddDeposit = () => {
    const newDeposit = {
      _id: `temp-${Date.now()}`,
      name: "",
      location: "",
      productsTotal: 0,
      canTransfer: false,
      wasRecentlyRestocked: false,
      isEditing: true,
      isNew: true,
    };

    queryClient.setQueryData(["branch"], (old = []) => [
      newDeposit,
      ...(old || []),
    ]);
  };

  const handleEditCell = (id, key, value) => {
    queryClient.setQueryData(["branch"], (old = []) =>
      old.map((item) => (item._id === id ? { ...item, [key]: value } : item))
    );
  };

  const handleSaveRow = async (row) => {
    const { name, location } = row;
    if (row.isNew) {
      await createBranchMutation.mutateAsync({
        name: name,
        location: location,
      });
    } else {
      await updateBranchMutation.mutateAsync({
        name: name,
        location: location,
      });
    }

    queryClient.invalidateQueries(["branch"]);
  };

  const handleCancelEdit = (row) => {
    if (row.isNew) {
      queryClient.setQueryData(["branch"], (old = []) =>
        old.filter((item) => item._id !== row._id)
      );
    } else {
      queryClient.invalidateQueries(["branch"]);
    }
  };

  const handleRowClick = (deposit) => {
    console.log(deposit);
    if (deposit.isEditing) return;
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

  const deposits = branches.map((branch) => ({
    ...branch,
    isEditing: branch.isEditing || false,
  }));

  const columns = [
    { key: "name", label: "NOMBRE", editable: true },
    { key: "location", label: "UBICACIÓN", editable: true },
    {
      key: "actions",
      label: "INSPECCIONAR",
      render: (_, row) =>
        row.isEditing ? (
          <>
            <button
              onClick={() => handleSaveRow(row)}
              disabled={
                createBranchMutation.isLoading || updateBranchMutation.isLoading
              }
              className="text-green-600 text-xl cursor-pointer"
              title="Guardar"
            >
              ✔
            </button>
            <button
              onClick={() => handleCancelEdit(row)}
              className="text-red-600 text-xl cursor-pointer"
              title="Cancelar"
            >
              ✖
            </button>
          </>
        ) : (
          <BsEye
            className="w-6 h-6 cursor-pointer"
            onClick={() => handleRowClick(row)}
          />
        ),
    },
  ];

  return (
    <div className="w-full flex flex-col gap-4 p-4 rounded-lg">
      <div className="w-full mt-1 flex flex-col justify-center items-center">
        <div className="text-3xl font-semibold text-[#3c2f1c]">
          DEPOSITOS{" "}
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
        onEditCell={(index, key, value) => {
          const row = deposits[index];
          handleEditCell(row._id, key, value);
        }}
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
