import React from "react";
import { Social } from "../../../../../../assets/icons";

const ItemBranch = ({ branch }) => {
  return (
    <div className="bg-[var(--brown-ligth-100)] p-3 rounded-xl shadow-sm flex gap-4 font-[var(--font-outfit)] max-w-[500px] w-full">
      {/* Ícono */}
      <div className="bg-[var(--brown-ligth-300)] p-2 flex justify-center items-center rounded-full shrink-0 w-[60px] h-[60px]">
        <Social size={30} />
      </div>

      {/* Texto */}
      <div className="flex-1 leading-tight">
        <h3 className="text-lg font-medium text-[var(--brown-dark-700)]">
          {branch?.name}
        </h3>
        <p className="text-sm font-bold text-[var(--brown-dark-900)] break-words">
          {branch?.location}
        </p>
      </div>
    </div>
  );
};

export default ItemBranch;
