import { DailyBox } from "../../../../../../../../assets/icons";
import { Button } from "../../../../../../widgets";

const SalesChart = ({ branchId }) => {
  return (
    <div className="bg-[var(--brown-ligth-100)] px-6 rounded-xl shadow-md font-[var(--font-outfit)] text-[var(--brown-dark-950)] w-full h-full flex flex-col">
      {/* Header */}
      <div className="flex gap-4 items-center border-b-[1px] p-4 border-[var(--brown-ligth-200)]">
        <div className="bg-[var(--brown-ligth-300)] p-2 rounded-full">
          <DailyBox color={"#33363F"} size={31} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[var(--brown-dark-900)]">
            RESUMEN DE CAJA{" "}
            <span className="text-[var(--brown-dark-700)]">#0004</span>
          </h3>
          <p className="text-[14px] text-[var(--brown-dark-700)] font-normal">
            Abierto Hoy <span>(09:35)</span>
          </p>
        </div>
      </div>

      {/* Contenido flexible */}
      <div className="flex-1 flex flex-col  mt-2">
        {/* FLUJO DE CAJA */}
        <p className="text-2xl font-semibold text-[var(--brown-dark-900)]">
          $2.532.500,40
        </p>
        {/* SALDO INICIAL */}
        <p>
          Saldo inicial:{" "}
          <span className="text-[var(--text-state-green)] font-semibold">
            $ 30.000,00
          </span>
        </p>
        {/* TOTAL EN VENTAS */}
        <p>
          Total en ventas:{" "}
          <span className="text-[var(--text-state-green)] font-semibold">
            $ 5.005.000,00
          </span>
        </p>
        {/* TOTAL EN GASTOS */}
        <p>
          Gastos:{" "}
          <span className="text-[var(--text-state-red)] font-semibold">
            $ 2.502.500,00
          </span>
        </p>
      </div>

      {/* Footer */}
      <div className="flex gap-2 justify-center py-4">
        <Button text={"Ingresar Dinero"} />
        <Button text={"Agregar Gastos"} />
      </div>
    </div>
  );
};

export default SalesChart;
