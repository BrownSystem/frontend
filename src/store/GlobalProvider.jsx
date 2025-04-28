import React from "react";
import { ProductModalProvider } from "./ProductModalContext";

export const GlobalProvider = ({ children }) => {
  return <ProductModalProvider>{children}</ProductModalProvider>;
};
