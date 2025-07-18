import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      setTokenValidated: () => {}, // se remueve del store
      resetTokenValidation: () => {}, // se remueve del store
      logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("auth");
        set({ user: null });
      },
    }),
    {
      name: "auth",
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);
