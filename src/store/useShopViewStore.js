import { create } from "zustand";

export const useShopViewStore = create((set, get) => ({
  // state
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
}));
