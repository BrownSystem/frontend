import React, { useState } from "react";

const DatePickerCustom = ({ selectedDate, setSelectedDate, Icon }) => {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState("day");

  const years = [2023, 2024, 2025, 2026];
  const months = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];

  return (
    <div className="relative">
      {/* Botón principal */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 cursor-pointer text-[var(--brown-dark-700)] hover:text-[var(--brown-dark-900)] transition-colors"
      >
        {Icon && <Icon color="#7a5c4c" size={24} />}
        <span className="text-xs font-medium">
          {selectedDate.toLocaleDateString("es-AR")}
        </span>
      </button>

      {/* Popup calendario */}
      {open && (
        <div className="absolute right-0 mt-2 p-3 bg-[var(--brown-ligth-50)] border border-[var(--brown-ligth-200)] text-[var(--brown-dark-900)] rounded-lg shadow-md w-56 z-50">
          {/* Tabs */}
          <div className="flex justify-between mb-2">
            {["year", "month", "day"].map((type) => (
              <button
                key={type}
                onClick={() => setView(type)}
                className={`flex-1 text-xs py-1 rounded transition-colors ${
                  view === type
                    ? "bg-[var(--brown-ligth-200)] font-semibold"
                    : "hover:bg-[var(--brown-ligth-100)]"
                }`}
              >
                {type === "year" && "Anual"}
                {type === "month" && "Mensual"}
                {type === "day" && "Diario"}
              </button>
            ))}
          </div>

          {/* Vistas */}
          {view === "year" && (
            <div className="grid grid-cols-3 gap-1">
              {years.map((y) => (
                <button
                  key={y}
                  className="text-sm py-1 rounded hover:bg-[var(--brown-ligth-100)]"
                  onClick={() => {
                    setSelectedDate(
                      new Date(
                        y,
                        selectedDate.getMonth(),
                        selectedDate.getDate()
                      )
                    );
                    setView("month");
                  }}
                >
                  {y}
                </button>
              ))}
            </div>
          )}

          {view === "month" && (
            <div className="grid grid-cols-3 gap-1">
              {months.map((m, idx) => (
                <button
                  key={m}
                  className="text-sm py-1 rounded hover:bg-[var(--brown-ligth-100)]"
                  onClick={() => {
                    setSelectedDate(
                      new Date(selectedDate.getFullYear(), idx, 1)
                    );
                    setView("day");
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          )}

          {view === "day" && (
            <div className="grid grid-cols-7 gap-1">
              {Array.from(
                {
                  length: new Date(
                    selectedDate.getFullYear(),
                    selectedDate.getMonth() + 1,
                    0
                  ).getDate(),
                },
                (_, i) => i + 1
              ).map((d) => (
                <button
                  key={d}
                  className="text-xs py-1 rounded hover:bg-[var(--brown-ligth-100)]"
                  onClick={() => {
                    setSelectedDate(
                      new Date(
                        selectedDate.getFullYear(),
                        selectedDate.getMonth(),
                        d
                      )
                    );
                    setOpen(false);
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DatePickerCustom;
