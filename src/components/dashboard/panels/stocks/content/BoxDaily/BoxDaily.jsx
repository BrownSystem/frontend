import { useFindAllBranch } from "../../../../../../api/branch/branch.queries";
import { useAuthStore } from "../../../../../../api/auth/auth.store";
import { useMemo } from "react";
import { useFindAllBoxDaily } from "../../../../../../api/boxDaily/boxDaily.queries";
import { useBoxDailyStore } from "../../../../../../store/useBoxDailyStore";

// Vistas
import CurrentBox from "./View/CurrentBox/CurrentBox";
import PreviousBoxes from "./View/PreviousBoxes/PreviousBoxes";
import Reports from "./View/Reports/Reports";
import ProductHistory from "./View/ProductHistory/ProductHistory";

const BoxDaily = () => {
  const { data: branches } = useFindAllBranch();
  const user = useAuthStore((state) => state.user);
  const { activeView, selectedBranch, setActiveView, setSelectedBranch } =
    useBoxDailyStore();

  const { data: allBoxDaily } = useFindAllBoxDaily({ status: "OPEN" });

  // ✅ Ordenar sucursales
  const sortedBranches = useMemo(() => {
    return [...(branches || [])].sort((a, b) => {
      if (a.id === user?.branchId) return -1;
      if (b.id === user?.branchId) return 1;
      return 0;
    });
  }, [branches, user?.branchId]);

  // ✅ Obtener datos de la sucursal seleccionada
  const { currentBranchBox, branchName } = useMemo(() => {
    const box = allBoxDaily?.find((b) => b.branchId === selectedBranch) || null;
    const name =
      sortedBranches.find((b) => b.id === selectedBranch)?.name || "";
    return { currentBranchBox: box, branchName: name };
  }, [allBoxDaily, selectedBranch, sortedBranches]);

  // ✅ Diccionario de Vistas (Similar a un Router/Outlet)
  const views = {
    current_box: (
      <CurrentBox
        boxDaily={currentBranchBox}
        selectedBranchId={selectedBranch}
        selectedBranchName={branchName}
      />
    ),
    previous_boxes: <PreviousBoxes branch={selectedBranch} />,
    reports: <Reports />,
    historyProducts: <ProductHistory />, // Cambiar por el componente correspondiente cuando exista
  };

  // Sub-componente para los Tabs
  const TabItem = ({ id, label }) => {
    const isActive = activeView === id;
    return (
      <div
        className="flex justify-center flex-col items-center cursor-pointer"
        onClick={() => setActiveView(id)}
      >
        <h2
          className={`text-md font-normal ${isActive ? "text-[var(--brown-dark-900)]" : "text-[var(--brown-dark-700)]"}`}
        >
          {label}
        </h2>
        {isActive && (
          <div className="w-10 h-[2px] bg-[var(--brown-ligth-400)] mt-1 rounded-full" />
        )}
      </div>
    );
  };

  return (
    <div className="flex justify-center w-full h-screen px-4">
      <div className="w-full h-full rounded-md lg:w-[90%] lg:mt-8">
        <div className="flex flex-wrap gap-4 mb-4 justify-between w-full">
          <div className="flex items-center gap-4">
            <TabItem id="current_box" label="Caja Actual" />
            <TabItem id="previous_boxes" label="Cajas Anteriores" />
            <TabItem id="reports" label="Reportes" />
            <TabItem id="historyProducts" label="Historial productos" />
          </div>

          {/* Selector de sucursal - Solo visible en Caja Actual */}
          {activeView === "current_box" && (
            <select
              className="bg-[var(--brown-ligth-100)] text-[var(--brown-dark-900)] px-3 py-1 rounded-md shadow-sm border border-[var(--brown-ligth-300)] focus:outline-none focus:ring-2 focus:ring-[var(--brown-dark-700)]"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
            >
              {sortedBranches.map((branch) => {
                const isOpen = allBoxDaily?.some(
                  (b) => b.branchId === branch.id && b.status === "OPEN",
                );
                return (
                  <option
                    key={branch.id}
                    value={branch.id}
                    className={isOpen ? "text-green-600" : "text-red-600"}
                  >
                    {branch.name} {isOpen ? "(Abierta)" : "(Cerrada)"}
                  </option>
                );
              })}
            </select>
          )}
        </div>

        {/* Renderizado de la Vista Seleccionada (El "Outlet") */}
        <div className="flex-1 w-full">
          {selectedBranch ? (
            views[activeView]
          ) : (
            <div className="text-center mt-10 text-gray-500">
              Seleccione una sucursal para continuar
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BoxDaily;
