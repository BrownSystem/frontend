import { create } from "zustand";

export const useStockViewStore = create((set, get) => ({
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
}));
