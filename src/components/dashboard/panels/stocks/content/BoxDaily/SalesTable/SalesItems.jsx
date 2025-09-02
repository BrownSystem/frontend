import { ArrowDown, InvoiceIcon } from "../../../../../../../assets/icons";

const SalesItems = () => {
  return (
    <div className="bg-[var(--brown-ligth-100)] px-6 pt-3 pb-3 rounded-xl shadow-md flex justify-between items-start ">
      <div className="flex gap-4">
        {/* Ícono */}
        <div className="bg-[var(--brown-ligth-300)] p-2 rounded-full">
          <InvoiceIcon />
        </div>

        {/* Texto */}
        <div>
          <h3 className="text-xs font-medium text-[var(--brown-dark-700)]">
            P-0001
          </h3>
          <p className="text-md font-bold text-[var(--brown-dark-900)]">
            $500,000
          </p>
        </div>
      </div>
      <div className="pr-4 cursor-pointer">
        <p className="font-semibold bg-[var(--brown-ligth-300)] rounded-full w-[32px] h-[32px] flex items-center justify-center">
          <ArrowDown color={"var(--brown-dark-700)"} size={28} />
        </p>
      </div>
    </div>
  );
};

export default SalesItems;
