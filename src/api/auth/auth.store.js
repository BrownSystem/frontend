import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("auth");
      },
    }),
    {
      name: "auth", // clave en localStorage
    }
  )
);
