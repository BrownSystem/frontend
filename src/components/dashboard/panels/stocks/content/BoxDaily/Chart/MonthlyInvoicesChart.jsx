import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const data = [
  { mes: "Ene", monto: 1200000 },
  { mes: "Feb", monto: 500000 },
  { mes: "Mar", monto: 950000 },
  { mes: "Abr", monto: 1100000 },
  { mes: "May", monto: 1400000 },
  { mes: "Jun", monto: 1700000 },
  { mes: "Jul", monto: 3940000 }, // destacado
  { mes: "Ago", monto: 1600000 },
  { mes: "Sep", monto: 1000000 },
  { mes: "Oct", monto: 0 },
  { mes: "Nov", monto: 0 },
  { mes: "Dic", monto: 0 },
];

const MonthlyInvoicesChart = ({ type }) => {
  return (
    <div className="bg-[var(--brown-ligth-100)] p-6 rounded-xl shadow-md font-[var(--font-outfit)] text-[var(--brown-dark-950)] w-full">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-sm font-normal text-[var(--brown-dark-950)]">
            {type === "income" ? "Ventas Mensuales" : "Gastos Mensuales"}
          </h2>
          <p className="text-2xl font-semibold text-[var(--brown-dark-900)]">
            {type === "income" ? "$1,000,000" : "$500,000"}
          </p>
        </div>
      </div>

      {/* Gráfico */}
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={data}>
          <XAxis
            dataKey="mes"
            stroke="var(--brown-dark-900)"
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip cursor={false} />
          <Bar dataKey="monto" radius={[8, 8, 8, 8]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  entry.monto >= 1200000
                    ? "var(--brown-dark-700)"
                    : "var(--brown-ligth-300)"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyInvoicesChart;
