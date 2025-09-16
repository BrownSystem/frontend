import { DndContext } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { Social } from "../../../assets/icons";
import { Button } from "../../dashboard/widgets";

const ReorganizeBranchesModal = ({
  handleSaveBranchesOrder,
  sensors,
  closestCenter,
  handleDragEnd,
  removeStockZero,
  orderedBranches,
  verticalListSortingStrategy,
  setShowModalBranches,
  SortableBranch,
  setRemoveStockZero,
}) => {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center">
      <div className="bg-[var(--brown-ligth-100)] rounded-3xl shadow-2xl py-6 px-8 w-full max-w-3xl max-h-[85vh] transition-all">
        {/* Header */}
        <div className="flex gap-4 justify-between items-center mb-4 border-b-[1px] p-4 border-[var(--brown-ligth-200)]">
          <div className="flex gap-4 items-center">
            <div className="bg-[var(--brown-ligth-300)] p-2 rounded-full">
              <Social size={36} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--brown-dark-900)]">
                REORGANIZAR SUCURSALES
              </h3>
              <p className="text-[14px] text-[var(--brown-dark-700)] font-normal">
                Puedes arrastrar y soltar las sucursales para reordenarlas.
              </p>
            </div>
          </div>
        </div>

        <div className="max-h-[50vh] overflow-y-auto px-2">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className="w-full flex justify-center gap-2 bg-[var(--brown-ligth-200)] border-2 border-[var(--brown-dark-900)] rounded-xl shadow-md py-4 hover:bg-[var(--brown-ligth-200)]">
              <label
                htmlFor="removeStock"
                className="text-[var(--brown-dark-900)] text-md font-semibold"
              >
                ¿QUIERE QUITAR LOS PRODUCTOS CON STOCK 0?
              </label>
              <input
                type="checkbox"
                name="removeStock"
                id="removeStock"
                checked={removeStockZero} // 👈 input controlado
                onChange={(e) => setRemoveStockZero(e.target.checked)}
              />
            </div>

            <SortableContext
              items={orderedBranches.map((b) => b.id)}
              strategy={verticalListSortingStrategy}
            >
              {orderedBranches?.map((branch) => (
                <SortableBranch key={branch.id} branch={branch} />
              ))}
            </SortableContext>
          </DndContext>
        </div>

        <div className="flex justify-end mt-6 gap-2">
          <Button text={"Cerrar"} onClick={() => setShowModalBranches(false)} />
          <Button
            text={"Descargar PDF ordenado"}
            onClick={handleSaveBranchesOrder}
          />
        </div>
      </div>
    </div>
  );
};

export default ReorganizeBranchesModal;
