import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useBoxDailyStore = create(
  persist(
    (set) => ({
      activeView: "current_box", // Vista por defecto
      selectedBranch: "", // Sucursal seleccionada

      setActiveView: (view) => set({ activeView: view }),
      setSelectedBranch: (branchId) => set({ selectedBranch: branchId }),
    }),
    {
      name: "box-daily-store", // clave en localStorage (para persistencia entre recargas)
    }
  )
);
