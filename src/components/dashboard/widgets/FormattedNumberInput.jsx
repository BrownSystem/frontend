import React from "react";
import { Controller } from "react-hook-form";

const FormattedNumberInput = ({
  name,
  control,
  label,
  rules,
  decimals = 0, // default sin decimales, configurable
  className = "",
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => {
        const handleChange = (e) => {
          let raw = e.target.value;

          // quitamos todo lo que no sea número o coma
          raw = raw.replace(/[^\d,]/g, "");

          // convertimos coma a punto para el número real
          const numericValue = raw.replace(/\./g, "").replace(",", ".");

          // guardamos en el form como número real
          if (!isNaN(parseFloat(numericValue))) {
            field.onChange(parseFloat(numericValue));
          } else {
            field.onChange(null);
          }

          // mostramos con separador de miles mientras escribe
          const parts = raw.split(",");
          const intPart = parts[0].replace(/\./g, "");
          let formatted = new Intl.NumberFormat("es-AR").format(intPart);

          if (parts.length > 1) {
            formatted += "," + parts[1]; // mantenemos los decimales que el usuario teclea
          }

          e.target.value = formatted;
        };

        return (
          <div className="flex flex-col w-full">
            {label && (
              <label className="mb-1 text-sm font-medium text-gray-700">
                {label}
              </label>
            )}
            <input
              type="text"
              defaultValue={`${
                field.value
                  ? new Intl.NumberFormat("es-AR", {
                      minimumFractionDigits: decimals,
                      maximumFractionDigits: decimals,
                    }).format(field.value)
                  : 0
              }`}
              onChange={handleChange}
              className={`border border-[var(--brown-ligth-400)] rounded px-2 py-1 !text-left ${className}`}
            />
          </div>
        );
      }}
    />
  );
};

export default FormattedNumberInput;
