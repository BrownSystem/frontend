import React from "react";
import { useViewStore } from "../../../store/useViewStore";

const OptionCard = ({ children, text, onClick, name }) => {
  const currentView = useViewStore((state) => state.currentView);

  const isActive = currentView === name;

  return (
    <div
      onClick={onClick}
      className={`bg-[var(--brown-ligth-50)] border-[1px]  ${
        isActive
          ? "border-[var(--brown-dark-800)] !hover:border-[var(--brown-dark-800)] shadow-lg shadow-amber-100"
          : "border-[var(--brown-ligth-400)]"
      } max-w-auto text-center h-[80px] rounded-md flex flex-col gap-1 justify-center items-center px-[.2rem] shadow-md  hover:bg-[var(--brown-ligth-100)] hover:shadow-1xl cursor-pointer transition-all duration-300 `}
    >
      <div className="-gradient-to-b from-[var(--brown-ligth-400)] bg-[var(--brown-dark-800)] p-2 rounded-md">
        {children}
      </div>
      <span className={`font-medium text-[15px] text-[var(--brown-dark-800)]`}>
        {text}
      </span>
    </div>
  );
};

export default OptionCard;
