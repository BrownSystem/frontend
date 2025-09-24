import { Calender } from "../../../../../../assets/icons";
import { useFindAllBranch } from "../../../../../../api/branch/branch.queries";
import { useAuthStore } from "../../../../../../api/auth/auth.store";

import { DatePickerCustom } from "../../../../widgets";
import { useState } from "react";
import Income from "./View/Income/Income";
import Discharge from "./View/Discharge/Discharge";

const BoxDaily = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { data: branches } = useFindAllBranch();
  const user = useAuthStore((state) => state.user);

  // Estado para controlar qué vista está activa (default = "income")
  const [activeView, setActiveView] = useState("income");
  // Estado para la sucursal seleccionada
  const [selectedBranch, setSelectedBranch] = useState(user?.branchId || "");
  return (
    <div className="mt-4 flex justify-center w-full h-screen px-4">
      <div className="w-full h-full rounded-md lg:w-[90%] lg:mt-8">
        <div className="flex gap-4 mb-4 justify-between w-full">
          <div className="flex items-center gap-4">
            {/* Ingresos */}
            <div
              className="flex justify-center flex-col items-center cursor-pointer"
              onClick={() => setActiveView("income")}
            >
              <h2
                className={`text-md font-normal ${
                  activeView === "income"
                    ? "text-[var(--brown-dark-900)]"
                    : "text-[var(--brown-dark-700)]"
                }`}
              >
                Ingresos
              </h2>
              {activeView === "income" && (
                <div className="w-10 h-[2px] bg-[var(--brown-ligth-400)] mt-1 rounded-full"></div>
              )}
            </div>

            {/* Egresos */}
            <div
              className="flex justify-center flex-col items-center cursor-pointer"
              onClick={() => setActiveView("discharge")}
            >
              <h2
                className={`text-md font-normal ${
                  activeView === "discharge"
                    ? "text-[var(--brown-dark-900)]"
                    : "text-[var(--brown-dark-700)]"
                }`}
              >
                Egresos
              </h2>
              {activeView === "discharge" && (
                <div className="w-10 h-[2px] bg-[var(--brown-ligth-400)] mt-1 rounded-full"></div>
              )}
            </div>
          </div>

          {/* Filtros */}
          <div className="flex gap-6">
            {/* Seleccionar fecha */}
            <div className="flex gap-2 items-center cursor-pointer">
              <DatePickerCustom
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                Icon={Calender}
              />
            </div>

            {/* Seleccionar sucursal */}
            <div className="flex gap-2 items-center cursor-pointer">
              <select
                className="bg-[var(--brown-ligth-100)] text-[var(--brown-dark-900)] font-[var(--font-outfit)] px-3 py-1 rounded-md shadow-sm border border-[var(--brown-ligth-300)] focus:outline-none focus:ring-2 focus:ring-[var(--brown-dark-700)] transition"
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
              >
                {(branches || [])
                  .sort((a, b) => {
                    if (a.id === user?.branchId) return -1;
                    if (b.id === user?.branchId) return 1;
                    return 0;
                  })
                  .map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>

        {/* Renderiza según la vista activa */}
        {selectedBranch &&
          (activeView === "income" ? (
            <Income type={"income"} branch={selectedBranch} />
          ) : (
            <Discharge type={"discharge"} branch={selectedBranch} />
          ))}
      </div>
    </div>
  );
};

export default BoxDaily;
