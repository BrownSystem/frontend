import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useReportsFiltersStore = create(
  persist(
    (set) => ({
      // 🗓️ Valores iniciales
      selectedMonth: new Date().getMonth() + 1,
      selectedYear: new Date().getFullYear(),
      selectedBranch: null,
      branch: "",
      contactId: {
        clienteId: "",
        proveedorId: "",
      },
      selectedIds: "",
      selectedProductIds: "",

      // 🧭 Setters
      setSelectedMonth: (month) => set({ selectedMonth: month }),
      setSelectedYear: (year) => set({ selectedYear: year }),
      setSelectedBranch: (branchId) => set({ selectedBranch: branchId }),
      setBranch: (branchName) => set({ branch: branchName }),
      setContactId: (contact) => set({ contactId: contact }),

      // ✅ Setea voucher y limpia producto
      setSelectedIds: (ids) =>
        set({
          selectedIds: ids,
          selectedProductIds: "", // limpia el otro
        }),

      // ✅ Setea producto y limpia voucher
      setSelectedProductIds: (ids) =>
        set({
          selectedProductIds: ids,
          selectedIds: "", // limpia el otro
        }),

      // 🧹 Limpiar filtros
      clearFilters: () =>
        set({
          selectedMonth: new Date().getMonth() + 1,
          selectedYear: new Date().getFullYear(),
          selectedBranch: null,
          branch: "",
          contactId: {
            clienteId: "",
            proveedorId: "",
          },
          selectedIds: "",
          selectedProductIds: "",
        }),
    }),
    {
      name: "reports-filters-storage", // clave en localStorage
    }
  )
);
