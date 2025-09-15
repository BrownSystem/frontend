import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useQrStore = create(
  persist(
    (set, get) => ({
      selectedProducts: {},

      // Establecer todo el objeto de productos
      setSelectedProducts: (products) => set({ selectedProducts: products }),

      // Agregar o actualizar un producto
      addOrUpdateProduct: (product, quantity = 1) => {
        set((state) => ({
          selectedProducts: {
            ...state.selectedProducts,
            [product.code]: { ...product, quantity },
          },
        }));
      },

      // Actualizar solo la cantidad de un producto existente
      updateQuantity: (code, quantity) => {
        set((state) => ({
          selectedProducts: {
            ...state.selectedProducts,
            [code]: {
              ...state.selectedProducts[code],
              quantity: Number(quantity),
            },
          },
        }));
      },

      // Eliminar un producto individualmente
      removeProduct: (code) => {
        set((state) => {
          const updated = { ...state.selectedProducts };
          delete updated[code];
          return { selectedProducts: updated };
        });
      },

      // Limpiar todo
      clearProducts: () => set({ selectedProducts: {} }),
    }),
    { name: "qr-store" }
  )
);
