import { create } from "zustand";

export const useFiltersStore = create((set) => ({
  filters: {},
  setFilter: (key, value) =>
    set((state) => ({
      filters: {
        ...state.filtros,
        [key]: value,
      },
    })),
}));
