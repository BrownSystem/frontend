import React from "react";
import { ProductModalProvider } from "./ProductModalContext";
import { StockViewProvider } from "./StockViewContext";

export const GlobalProvider = ({ children }) => {
  return (
    <StockViewProvider>
      <ProductModalProvider>{children}</ProductModalProvider>
    </StockViewProvider>
  );
};
