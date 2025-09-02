import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Dot,
} from "recharts";

const data = [
  { day: "Lun", value: 2000000 },
  { day: "Mar", value: 5000000 },
  { day: "Mie", value: 3000000 },
  { day: "Juev", value: 6500678 },
  // punto destacado
];

const SalesChart = ({ type, branchId }) => {
  return (
    <div className="bg-[var(--brown-ligth-100)] px-6 pt-6  pb-0 rounded-xl shadow-md font-[var(--font-outfit)] text-[var(--brown-dark-950)] w-[80%] ">
      {/* Título */}
      <div className="mb-4">
        <h2 className="text-sm font-normal text-[var(--brown-dark-950)]">
          {type === "income" ? "Total en caja" : "Total egresos"}
        </h2>
        <p className="text-2xl font-semibold text-[var(--brown-dark-900)]">
          $6,500,678
        </p>
      </div>

      {/* Gráfico */}
      <ResponsiveContainer width="100%" height={150}>
        <LineChart data={data}>
          <XAxis dataKey="day" fontSize={12} stroke="var(--brown-dark-700)" />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--brown-ligth-50)",
              border: "1px solid var(--brown-dark-200)",
              color: "var(--brown-dark-950)",
              fontFamily: "Outfit",
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--text-state-green)"
            strokeWidth={2}
            dot={({ cx, cy, value }) => {
              const isHighlighted = value >= 1800000;
              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHighlighted ? 4 : 3}
                  fill={
                    isHighlighted
                      ? "var(--text-state-yellow)"
                      : "var(--brown-dark-500)"
                  }
                  stroke="var(--brown-dark-950)"
                  strokeWidth={isHighlighted ? 2 : 1}
                />
              );
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;
