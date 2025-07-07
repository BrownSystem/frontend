import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useBranchStore = create(
  persist(
    (set) => ({
      branch: null,
      setBranch: (branch) => set({ branch }),
    }),
    {
      name: "branch",
    }
  )
);
