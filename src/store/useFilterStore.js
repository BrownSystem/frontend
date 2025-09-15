import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useFilterStore = create(
  persist(
    (set) => ({
      dateFrom: " ",
      dateUntil: " ",
      selectedContactName: " ",
      contactId: " ",
      branch: " ",
      montoMin: "",
      montoMax: "",

      setDateFrom: (value) => set({ dateFrom: value }),
      setDateUntil: (value) => set({ dateUntil: value }),
      setContactId: (value) => set({ contactId: value }),
      setSelectedContactName: (value) => set({ selectedContactName: value }),
      setBranch: (value) => set({ branch: value }),
      setMontoMin: (value) => set({ montoMin: value }),
      setMontoMax: (value) => set({ montoMax: value }),

      resetFilters: () =>
        set({
          dateFrom: "",
          dateUntil: "",
          contactId: "",
          selectedContactName: "",
          branch: "",
          montoMin: "",
          montoMax: "",
        }),
    }),
    { name: "sales-filter" } // nombre en localStorage
  )
);
