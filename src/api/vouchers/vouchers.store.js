// voucher.store.js
import { create } from "zustand";

export const useVoucherStore = create((set) => ({
  isModalOpen: false,
  selectedVoucher: null,

  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),

  setSelectedVoucher: (voucher) => set({ selectedVoucher: voucher }),
  clearSelectedVoucher: () => set({ selectedVoucher: null }),
}));
