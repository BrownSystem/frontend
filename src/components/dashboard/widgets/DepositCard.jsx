import React from "react";
import { DangerTriangle, Tick } from "../../../assets/icons";

const DepositCard = ({
  name,
  location,
  productsTotal,
  wasRecentlyRestocked,
  canTransfer,
  onClick,
}) => {
  return (
    <div className="min-w-auto min-h-auto bg-white rounded-md flex flex-col items-center p-2 pt-4 gap-1">
      <figure className="w-[40%] rounded-bl-full mb-3">
        <img
          className="w-full rounded-full"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzj00mTDRWomeiIY_ezq_EVu1H_1_9I7IRxA&s"
          alt=""
        />
      </figure>
      <p className="font-semibold text-gray-700 text-xl text-center">{`${name} (${location})`}</p>
      <p className="text-center text-gray-500 ">
        <span>
          {" "}
          Puede cubrir: <span className="text-green-600">
            {productsTotal}
          </span>{" "}
          de 5 productos.
        </span>
      </p>
      {canTransfer ? (
        <p className=" text-gray-500 flex items-center gap-1">
          <span>
            <Tick />
          </span>
          <span> Transferible. </span>
        </p>
      ) : (
        <p className=" text-gray-500 flex items-center gap-1">
          <span>
            <DangerTriangle />
          </span>
          <span> No transferible.</span>
        </p>
      )}
      <p className="text-gray-500 text-center text-xs uppercase">
        Reposición:{" "}
        <span
          className={wasRecentlyRestocked ? "text-green-600" : "text-red-700"}
        >
          {wasRecentlyRestocked ? "Actualizada" : "Desactualizada"}.
        </span>
      </p>
      <button
        className="w-full !border-t-[.5px] !border-0 !border-gray-300 !bg-transparent !text-gray-500 !mt-2 !py-2 !px-8 !cursor-pointer hover:text-red-700"
        style={{ all: "unset" }}
        onClick={onClick}
      >
        Inspeccionar
      </button>
    </div>
  );
};

export default DepositCard;
