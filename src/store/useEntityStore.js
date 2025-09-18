import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useEntityStore = create(
  persist(
    (set) => ({
      selectedEntidadName: "",
      selectedEntidadNameSeller: "",
      setSelectedEntidadName: (name) => set({ selectedEntidadName: name }),
      setSelectedEntidadNameSeller: (name) =>
        set({ selectedEntidadNameSeller: name }),
      resetEntidad: () =>
        set({ selectedEntidadName: "", selectedEntidadNameSeller: "" }),
    }),
    {
      name: "entidad-storage", // clave en localStorage
    }
  )
);
