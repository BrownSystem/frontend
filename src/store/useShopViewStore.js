import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useShopViewStore = create(
  persist(
    (set, get) => ({
      // state inicial
      view: {
        name: "productos",
        props: null,
      },
      // actions
      setViewSafe: (newView) => {
        const { view } = get();
        const sameName = view.name === newView.name;
        const sameProps =
          JSON.stringify(view.props) === JSON.stringify(newView.props);

        if (sameName && sameProps) return;

        set({ view: newView });
      },
    }),
    {
      name: "shop-view-storage", // clave en localStorage
      getStorage: () => localStorage, // default, pero lo pongo explícito
    }
  )
);
