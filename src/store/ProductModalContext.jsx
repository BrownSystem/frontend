/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
const ProductModalContext = createContext(null);

export const ProductModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState(null);

  const openProductDetail = (product) => {
    setProduct(product);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setProduct(null);
  };

  return (
    <ProductModalContext.Provider
      value={{ isOpen, product, openProductDetail, closeModal }}
    >
      {children}
    </ProductModalContext.Provider>
  );
};

export const useProductModal = () => useContext(ProductModalContext);
