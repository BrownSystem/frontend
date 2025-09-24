// store/useMessageStore.js
import { create } from "zustand";

export const useMessageStore = create((set) => ({
  message: "info", // { text: '', type: 'success' | 'error' }
  setMessage: (msg) => set({ message: msg }),
  clearMessage: () => set({ message: null }),
}));
