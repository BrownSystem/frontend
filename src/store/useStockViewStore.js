import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useStockViewStore = create(
  persist(
    (set, get) => ({
      view: {
        name: "products",
        props: null,
      },

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
      name: "stock-view-storage", // clave en localStorage
      getStorage: () => localStorage, // opcional, por defecto es localStorage
    }
  )
);
