import React, { memo } from "react";
import { DangerTriangle, Tick } from "../../../assets/icons";

const DepositCard = memo(
  ({
    name,
    location,
    productsTotal,
    wasRecentlyRestocked,
    canTransfer,
    onClick,
  }) => {
    return (
      <div className="min-w-auto min-h-auto bg-[var(--brown-ligth-50)] border-[1px] border-[var(--brown-dark-800)] rounded-md flex flex-col items-center p-2 pt-4 gap-1 shadow-md">
        <figure className="w-[40%] rounded-full mb-3 shadow-md border-[2px] border-white">
          <img
            className="w-full rounded-full"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzj00mTDRWomeiIY_ezq_EVu1H_1_9I7IRxA&s"
            alt=""
          />
        </figure>
        <p className="font-semibold text-[var(--brown-dark-950)] text-xl text-center">{`${name} (${location})`}</p>
        <p className="text-center  text-black/80">
          <span>
            {" "}
            Puede cubrir:{" "}
            <span className="text-green-600">{productsTotal}</span> de 5
            productos.
          </span>
        </p>
        {canTransfer ? (
          <p className=" flex items-center gap-1 text-black/80">
            <span>
              <Tick />
            </span>
            <span> Transferible. </span>
          </p>
        ) : (
          <p className=" flex items-center gap-1 text-black/80">
            <span>
              <DangerTriangle />
            </span>
            <span> No transferible.</span>
          </p>
        )}
        <p className=" text-center text-xs uppercase text-black/80">
          Reposición:{" "}
          <span
            className={wasRecentlyRestocked ? "text-green-600" : "text-red-700"}
          >
            {wasRecentlyRestocked ? "Actualizada" : "Desactualizada"}.
          </span>
        </p>
        <button
          className="w-full !border-t-[.5px] !border-0 !border-gray-300 !bg-transparent !text-black/80 !mt-2 !py-2 !px-8 !cursor-pointer hover:text-red-700"
          style={{ all: "unset" }}
          onClick={onClick}
        >
          Inspeccionar
        </button>
      </div>
    );
  }
);

export default DepositCard;
