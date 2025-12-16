import { useFindAllBranch } from "../../../../../../api/branch/branch.queries";
import { useAuthStore } from "../../../../../../api/auth/auth.store";
import { useMemo, useState } from "react";
import CurrentBox from "./View/CurrentBox/CurrentBox";
import PreviousBoxes from "./View/PreviousBoxes/PreviousBoxes";
import { useFindAllBoxDaily } from "../../../../../../api/boxDaily/boxDaily.queries";
import Reports from "./View/Reports/Reports";
import { useBoxDailyStore } from "../../../../../../store/useBoxDailyStore";

const BoxDaily = () => {
  const { data: branches } = useFindAllBranch();
  const user = useAuthStore((state) => state.user);

  const { activeView, selectedBranch, setActiveView, setSelectedBranch } =
    useBoxDailyStore();

  // ✅ Ordenar branches: primero la del usuario
  const sortedBranches = useMemo(() => {
    return (branches || []).sort((a, b) => {
      if (a.id === user?.branchId) return -1;
      if (b.id === user?.branchId) return 1;
      return 0;
    });
  }, [branches, user?.branchId]);

  // Traemos todas las cajas abiertas
  const { data: allBoxDaily, isLoading } = useFindAllBoxDaily({
    status: "OPEN",
  });

  // ✅ Filtramos la caja actual según la sucursal seleccionada
  const currentBranchBox = useMemo(() => {
    if (!allBoxDaily || !selectedBranch) return null;
    return allBoxDaily.find((box) => box.branchId === selectedBranch) || null;
  }, [allBoxDaily, selectedBranch]);

  const branchName = useMemo(() => {
    if (!selectedBranch) return "";
    return sortedBranches.find((b) => b.id === selectedBranch)?.name || "";
  }, [selectedBranch, sortedBranches]);

  return (
    <div className=" flex justify-center w-full h-screen px-4">
      <div className="w-full h-full rounded-md lg:w-[90%] lg:mt-8">
        <div className="flex gap-4 mb-4 justify-between w-full">
          <div className="flex items-center gap-4">
            {/* Caja Actual */}
            <div
              className="flex justify-center flex-col items-center cursor-pointer"
              onClick={() => setActiveView("current_box")}
            >
              <h2
                className={`text-md font-normal ${
                  activeView === "current_box"
                    ? "text-[var(--brown-dark-900)]"
                    : "text-[var(--brown-dark-700)]"
                }`}
              >
                Caja Actual
              </h2>
              {activeView === "current_box" && (
                <div className="w-10 h-[2px] bg-[var(--brown-ligth-400)] mt-1 rounded-full"></div>
              )}
            </div>

            {/* Caja Anteriores */}
            <div
              className="flex justify-center flex-col items-center cursor-pointer"
              onClick={() => setActiveView("previous_boxes")}
            >
              <h2
                className={`text-md font-normal ${
                  activeView === "previous_boxes"
                    ? "text-[var(--brown-dark-900)]"
                    : "text-[var(--brown-dark-700)]"
                }`}
              >
                Caja Anteriores
              </h2>
              {activeView === "previous_boxes" && (
                <div className="w-10 h-[2px] bg-[var(--brown-ligth-400)] mt-1 rounded-full"></div>
              )}
            </div>

            {/* Reportes */}
            <div
              className="flex justify-center flex-col items-center cursor-pointer"
              onClick={() => setActiveView("reports")}
            >
              <h2
                className={`text-md font-normal ${
                  activeView === "reports"
                    ? "text-[var(--brown-dark-900)]"
                    : "text-[var(--brown-dark-700)]"
                }`}
              >
                Reportes
              </h2>
              {activeView === "reports" && (
                <div className="w-10 h-[2px] bg-[var(--brown-ligth-400)] mt-1 rounded-full"></div>
              )}
            </div>
          </div>

          {/* Selector de sucursal */}
          {activeView === "current_box" && (
            <div className="flex gap-6">
              <div className="flex gap-2 items-center cursor-pointer">
                <select
                  className="bg-[var(--brown-ligth-100)] text-[var(--brown-dark-900)] font-[var(--font-outfit)] px-3 py-1 rounded-md shadow-sm border border-[var(--brown-ligth-300)] focus:outline-none focus:ring-2 focus:ring-[var(--brown-dark-700)] transition"
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                >
                  {sortedBranches.map((branch) => {
                    const box = allBoxDaily?.find(
                      (b) => b.branchId === branch.id
                    );
                    const isOpen = box?.status === "OPEN"; // true si tiene caja abierta
                    return (
                      <option
                        key={branch.id}
                        value={branch.id}
                        className={
                          isOpen
                            ? "text-[var(--text-state-green)]"
                            : "text-[var(--text-state-red)]"
                        }
                      >
                        {branch.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Render según vista activa */}
        {selectedBranch &&
          (activeView === "current_box" ? (
            <CurrentBox
              boxDaily={currentBranchBox}
              selectedBranchId={selectedBranch}
              selectedBranchName={branchName}
            />
          ) : activeView === "reports" ? (
            <Reports />
          ) : (
            <PreviousBoxes branch={selectedBranch} />
          ))}
      </div>
    </div>
  );
};

export default BoxDaily;
