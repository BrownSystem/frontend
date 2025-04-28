import React from "react";
import { useViewSupplierStore } from "../../../store/useViewSupplierStore";

const SupplierOptionCard = ({ children, text, onClick, name }) => {
  const currentView = useViewSupplierStore((state) => state.currentView);

  const isActive = currentView === name;

  return (
    <div
      onClick={onClick}
      className={`bg-[var(--brown-ligth-50)] border-[1px] ${
        isActive
          ? "border-[var(--brown-dark-800)] !hover:border-[var(--brown-dark-800)]"
          : "border-[var(--brown-ligth-300)]"
      } max-w-[80px] text-center h-[100px] rounded-md flex flex-col gap-2 justify-center items-center px-2 shadow-md  hover:bg-[var(--brown-ligth-100)] hover:shadow-1xl cursor-pointer transition-all duration-300 `}
    >
      <div className="bg-gradient-to-b from-[var(--brown-ligth-400)] to-[var(--brown-dark-800)] p-2 rounded-md">
        {children}
      </div>
      <span className={`font-medium text-[15px] text-[var(--brown-dark-800)]`}>
        {text}
      </span>
    </div>
  );
};

export default SupplierOptionCard;
