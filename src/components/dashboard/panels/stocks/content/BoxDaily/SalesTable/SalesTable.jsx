import React, { useState } from "react";
import {
  ArrowDown,
  Calender,
  Dollar,
  InvoiceIcon,
} from "../../../../../../../assets/icons";
import { DatePickerCustom } from "../../../../../widgets";
import SalesItems from "./SalesItems";

const SalesTable = ({ employee }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="flex flex-col gap-2 mb-4">
      <div className="bg-[var(--brown-ligth-100)] px-6 pt-3 pb-1 rounded-xl shadow-md font-[var(--font-outfit)] text-[var(--brown-dark-950)] w-full">
        <div className="flex justify-between items-start ">
          {/* Info empleado */}
          <div>
            <h2 className="text-sm font-normal text-[var(--brown-dark-950)]">
              Ventas de: {employee?.name || "Juan Melian"}
            </h2>
            <p className="text-2xl font-semibold text-[var(--brown-dark-900)]">
              ${employee?.sales || "1,200,000"}
            </p>
          </div>

          {/* Date Picker */}
          <DatePickerCustom
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            Icon={Calender} // le paso el icono que ya usas
          />
        </div>
      </div>
      <div className="  font-[var(--font-outfit)] text-[var(--brown-dark-950)] w-full flex flex-col gap-2">
        <SalesItems />
        <SalesItems />
        <SalesItems />
      </div>
    </div>
  );
};

export default SalesTable;
