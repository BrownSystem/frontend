import React from "react";
import { useViewStore } from "../../../store/useViewStore";

const OptionCard = ({ children, text, onClick, name }) => {
  const currentView = useViewStore((state) => state.currentView);

  const isActive = currentView === name;

  return (
    <div
      onClick={onClick}
      className="flex flex-col justify-center items-center cursor-pointer transition-colors duration-300 pr-4"
    >
      <span
        className={`text-md font-normal mt-1  ${
          isActive
            ? "text-[var(--brown-dark-900)]"
            : "text-[var(--brown-dark-500)]"
        }`}
      >
        {text}
      </span>

      {isActive && (
        <div className="w-10 h-[2px] bg-[var(--brown-ligth-400)] mt-1 rounded-full"></div>
      )}
    </div>
  );
};

export default OptionCard;
