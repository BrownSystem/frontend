const SalesChart = ({ type, branchId }) => {
  return (
    <div className="bg-[var(--brown-ligth-100)] px-6 pt-6  pb-0 rounded-xl shadow-md font-[var(--font-outfit)] text-[var(--brown-dark-950)] w-[80%] ">
      {/* Título */}
      <div className="mb-4">
        <h2 className="text-sm font-normal text-[var(--brown-dark-950)]">
          {type === "income" ? "INGRESO EN CAJA" : "EGRESO EN CAJA"}
        </h2>
        <p className="text-2xl font-semibold text-[var(--brown-dark-900)]">
          $6,500,678
        </p>
      </div>
    </div>
  );
};

export default SalesChart;
