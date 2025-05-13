import { create } from "zustand";

export const useShopViewStore = create((set, get) => ({
  // state
  view: {
    name: "registerSales",
  },
  // actions
  setViewSafe: (newView) => {
    const { view } = get();
    const sameName = view.name === newView.name;
    if (sameName) return;
    set({ view: newView });

    if (sameName) return;

    set({ view: newView });
  },
}));
