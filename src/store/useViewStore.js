import { create } from "zustand";

export const useViewStore = create((set) => ({
  currentView: null,
  setView: (view) => set({ currentView: view }),
}));
