import { useState } from "react";
import { useStockView } from "../../../../../context/StockViewContext";
import { Search, SupplierCard } from "../../../widgets";

const SuppliersContent = () => {
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const { view, setView, renderContent } = useStockView();

  const handleCardClick = (supplier) => {
    setSelectedSupplier(supplier);
    setView({
      name: "supplier_table",
      props: {
        title: supplier.name,
        span: supplier.location,
        backTo: true,
      },
    });
  };

  if (selectedSupplier) {
    return renderContent();
  }

  return (
    <>
      <div className="flex justify-between px-2">
        <h1 className="!text-3xl font-normal text-gray-700">
          Provedores{" "}
          <span className="text-gray-500 text-[20px]">(Seleccionar)</span>
        </h1>
        <div className="flex gap-2">
          <Search placeholder="Buscar Proveedor" />
        </div>
      </div>
      <div className="w-full flex mt-5 gap-4">
        {[
          {
            name: "Montes Pedro",
            location: "Córdoba",
            lastRestock: "10/04/2025",
            nextRestock: "15/04/2025",
            phone: "351-1234567",
            wasRecentlyRestocked: true,
          },
          {
            name: "Amoblamientos",
            location: "BA",
            lastRestock: "01/04/2025",
            nextRestock: "16/04/2025",
            phone: "351-7654321",
            wasRecentlyRestocked: false,
          },
          {
            name: "Mesauiti",
            location: "Córdoba",
            lastRestock: "08/04/2025",
            nextRestock: "14/04/2025",
            phone: "3525-223344",
            wasRecentlyRestocked: true,
          },
        ].map((supplier) => (
          <SupplierCard
            key={supplier.name}
            {...supplier}
            onClick={() => handleCardClick(supplier)}
          />
        ))}
      </div>
    </>
  );
};

export default SuppliersContent;
