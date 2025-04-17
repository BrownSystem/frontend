import React, { createContext, useContext, useState } from "react";
import DepositsContent from "../components/dashboard/panels/stocks/content/DepositsContent";
import SuppliersContent from "../components/dashboard/panels/stocks/content/SuppliersContent";
import {
  SupplierTable,
  ProductTable,
  ProductTableDeposit,
  PedidoTable,
} from "../components/dashboard/panels/stocks/content/tables";

const StockViewContext = createContext();

export const StockViewProvider = ({ children }) => {
  const [view, setView] = useState({
    name: "products",
    props: null,
  });

  const renderContent = () => {
    switch (view.name) {
      case "productos":
        return (
          <ProductTable
            title={view.props?.title}
            span={view.props?.span}
            backTo={view.props?.backTo}
          />
        );
      case "depositos":
        return <DepositsContent />;
      case "proveedores":
        return <SuppliersContent />;
      case "supplier_table":
        return (
          <SupplierTable
            title="Registros"
            span="compras"
            backTo={view.props?.backTo}
          />
        );
      case "products_of_deposit":
        return (
          <ProductTableDeposit
            title={view.props?.title}
            span={view.props?.span}
            backTo={view.props?.backTo}
          />
        );
      case "pedidos":
        return <PedidoTable />;

      default:
        return (
          <ProductTable
            title={"Productos"}
            span={"proximo a agotar"}
            backTo={view.props?.backTo}
          />
        );
    }
  };

  return (
    <StockViewContext.Provider value={{ view, setView, renderContent }}>
      {children}
    </StockViewContext.Provider>
  );
};

export const useStockView = () => useContext(StockViewContext);
