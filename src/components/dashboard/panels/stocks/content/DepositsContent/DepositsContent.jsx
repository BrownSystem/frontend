import { useState } from "react";
import { useStockViewStore } from "@store/useStockViewStore";
import { BsEye } from "react-icons/bs";
import { GenericTable } from "../../../../widgets";

const DepositsContent = () => {
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [deposits, setDeposits] = useState([
    {
      name: "Hiper",
      location: "Córdoba",
      productsTotal: 1,
      canTransfer: false,
      wasRecentlyRestocked: true,
    },
    {
      name: "Castro barros",
      location: "Córdoba",
      productsTotal: 2,
      canTransfer: true,
      wasRecentlyRestocked: false,
    },
    {
      name: "Jesús María",
      location: "Córdoba",
      productsTotal: 4,
      canTransfer: true,
      wasRecentlyRestocked: true,
    },
  ]);

  const setView = useStockViewStore((state) => state.setViewSafe);
  const renderContent = useStockViewStore((state) => state.renderContent);

  const handleRowClick = (deposit) => {
    setSelectedDeposit(deposit);
    setView({
      name: "products_of_deposit",
      props: {
        title: deposit?.name,
        span: deposit?.location,
        backTo: true,
      },
    });
  };

  const handleAddDeposit = () => {
    const newDeposit = {
      name: "",
      location: "",
      productsTotal: 0,
      canTransfer: false,
      wasRecentlyRestocked: false,
      isEditing: true,
    };

    setDeposits((prev) => [newDeposit, ...prev]);
  };

  const handleEditCell = (index, key, value) => {
    setDeposits((prev) => {
      const updated = [...prev];
      updated[index][key] = value;
      return updated;
    });
  };

  const handleSaveRow = (index) => {
    setDeposits((prev) => {
      const updated = [...prev];
      updated[index].isEditing = false;
      return updated;
    });
  };

  const handleCancelAdd = (index) => {
    setDeposits((prev) => prev.filter((_, i) => i !== index));
  };

  const columns = [
    { key: "name", label: "NOMBRE", editable: true },
    { key: "location", label: "UBICACIÓN", editable: true },
    {
      key: "actions",
      label: "INSPECCIONAR",
      render: (_, row, index) => (
        <span className="flex justify-center gap-2">
          {row.isEditing ? (
            <>
              <button
                onClick={() => handleSaveRow(index)}
                className="text-green-600 text-xl cursor-pointer"
                title="Guardar"
              >
                ✔
              </button>
              <button
                onClick={() => handleCancelAdd(index)}
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
          )}
        </span>
      ),
    },
  ];

  if (selectedDeposit) return renderContent();

  return (
    <div className="w-full  flex flex-col gap-4  p-4 rounded-lg">
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
        onEditCell={handleEditCell}
        onSaveRow={handleSaveRow}
        onRowClick={handleRowClick}
      />
    </div>
  );
};

export default DepositsContent;
