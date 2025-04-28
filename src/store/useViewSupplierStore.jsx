import { create } from "zustand";

export const useViewSupplierStore = create((set) => ({
  currentView: "invoiceTable",
  setView: (view) => set({ currentView: view }),
}));
