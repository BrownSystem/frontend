import React from "react";

const SupplierCard = ({
  name,
  location,
  lastRestock,
  nextRestock,
  phone,
  onClick,
}) => {
  return (
    <div className="min-w-auto min-h-auto bg-white rounded-md flex flex-col items-center p-2 pt-4 gap-1">
      <figure className="w-[40%] rounded-bl-full mb-3">
        <img
          className="w-full rounded-full"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzj00mTDRWomeiIY_ezq_EVu1H_1_9I7IRxA&s"
          alt="Logo proveedor"
        />
      </figure>

      <p className="font-semibold text-gray-700 text-lg text-center">{`${name} (${location})`}</p>

      <p className="text-gray-500 text-sm">
        📦 Última reposición: <strong>{lastRestock}</strong>
      </p>

      <p className="text-gray-500 text-sm">
        🗓 Próxima reposición: <strong>{nextRestock}</strong>
      </p>

      <p className="text-gray-500 text-sm">
        ☎️ Contacto: <strong>{phone}</strong>
      </p>

      <button
        className="w-full !border-t-[.5px] !border-0 !border-gray-300 !bg-transparent !text-gray-500 !mt-2 !py-2 !px-8 !cursor-pointer hover:text-red-700"
        style={{ all: "unset" }}
        onClick={onClick}
      >
        Ver detalles
      </button>
    </div>
  );
};

export default SupplierCard;
