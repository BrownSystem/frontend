import { create } from "zustand";

export const useSalesViewShopStore = create((set, get) => ({
  tags: "ventas", // estado inicial
  setTags: (newTags) => set({ tags: newTags }),
}));

export const useSalesViewStockStore = create((set, get) => ({
  tags: "remito", // estado inicial
  setTags: (newTags) => set({ tags: newTags }),
}));
