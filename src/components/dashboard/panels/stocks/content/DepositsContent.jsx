import { useState } from "react";
import { DepositCard } from "../../../widgets";
import { useStockViewStore } from "@store/useStockViewStore";

const DepositsContent = () => {
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const setView = useStockViewStore((state) => state.setViewSafe);
  const renderContent = useStockViewStore((state) => state.renderContent);

  const handleCardClick = (deposit) => {
    setSelectedDeposit(deposit);
    setView({
      name: "products_of_deposit",
      props: {
        title: deposit?.name,
        span: deposit?.location,
        backTo: true,
      },
    });
  };

  if (selectedDeposit) {
    return renderContent();
  }

  return (
    <>
      <h1 className="!text-3xl font-normal text-gray-700">
        Depósitos{" "}
        <span className="text-gray-500 text-[20px]">
          (selecciona para gestionar transferencias)
        </span>
      </h1>

      <div className="w-full flex mt-5 gap-4">
        {[
          {
            name: "Hyper",
            location: "Córdoba",
            productsTotal: 1,
            canTransfer: false,
            wasRecentlyRestocked: true,
          },
          {
            name: "Castro barros",
            location: "Córdoba",
            productsTotal: 2,
            canTransfer: true,
            wasRecentlyRestocked: false,
          },
          {
            name: "Jesús María",
            location: "Córdoba",
            productsTotal: 4,
            canTransfer: true,
            wasRecentlyRestocked: true,
          },
        ].map((deposit) => (
          <DepositCard
            key={deposit.name}
            {...deposit}
            onClick={() => handleCardClick(deposit)}
          />
        ))}
      </div>
    </>
  );
};

export default DepositsContent;
