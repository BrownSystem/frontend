import { ProductModalProvider } from "./ProductModalContext";

export const GlobalProvider = ({ children }) => {
  return <ProductModalProvider>{children}</ProductModalProvider>;
};
