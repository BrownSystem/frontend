import { useState } from "react";
import { DailyBox } from "../../../../../../../../../assets/icons";
import { Button } from "../../../../../../../widgets";
import ClosedBoxModal from "./ClosedBoxModal";
import { useAuthStore } from "../../../../../../../../../api/auth/auth.store";

import { format, parseISO, isValid } from "date-fns";
import { es } from "date-fns/locale";
import { useMessageStore } from "../../../../../../../../../store/useMessage";
import ExpenseModal from "./ExpenseModal/ExpenseModal";

const CashSummary = ({
  flujoCaja,
  saldoInicial,
  totalVentas,
  gastos,
  boxNumber,
  openTime,
  estado,
  id,
  branchId,
  branchName,
  selectedBranchName,
  selectedBranchId,
}) => {
  const [showClosedBoxModal, setShowClosedBoxModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  let dia = "";
  let numeroDia = "";
  let mes = "";
  if (openTime) {
    const fecha = parseISO(openTime);
    if (isValid(fecha)) {
      dia = format(fecha, "EEEE", { locale: es });

      numeroDia = format(fecha, "d"); // 3
      mes = format(fecha, "MMMM", { locale: es }); // "octubre"
      mes = mes.charAt(0).toUpperCase() + mes.slice(1); // "Octubre"
    }
  }
  const user = useAuthStore((state) => state.user);
  return (
    <div className="bg-[var(--brown-ligth-100)] px-6 pb-6 rounded-xl shadow-md font-[var(--font-outfit)] text-[var(--brown-dark-950)] w-full h-full flex flex-col">
      {/* MODAL DE GASTOS */}
      <ExpenseModal
        setShowExpenseModal={setShowExpenseModal}
        showExpenseModal={showExpenseModal}
        boxId={id}
        selectedBranchId={selectedBranchId}
        selectedBranchName={selectedBranchName}
      />

      <ClosedBoxModal
        setShowClosedBoxDaily={setShowClosedBoxModal}
        showClosedBoxDaily={showClosedBoxModal}
        id={id}
        flujoCaja={flujoCaja}
        closedBy={user?.name}
        branchId={branchId}
        branchName={branchName}
        estado={estado}
        selectedBranchId={selectedBranchId}
        selectedBranchName={selectedBranchName}
      />

      {/* Header */}
      <div className="flex gap-4 items-center border-b-[1px] p-4 border-[var(--brown-ligth-200)]">
        <div className="bg-[var(--brown-ligth-300)] p-2 rounded-full">
          <DailyBox color={"#33363F"} size={31} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[var(--brown-dark-900)]">
            RESUMEN DE CAJA{" "}
            <span className="text-[var(--brown-dark-700)]">#{boxNumber}</span>
          </h3>
          <p className="text-[14px] text-[var(--brown-dark-700)] ">
            {openTime && (
              <span>
                Abierto:{" "}
                <b>
                  {dia} {numeroDia} de {mes}
                </b>{" "}
                ({new Date(openTime).toLocaleTimeString("es-AR")})
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Contenido flexible */}
      <div className="flex-1 flex flex-col mt-2">
        {/* FLUJO DE CAJA */}
        <p className="text-2xl font-semibold text-[var(--brown-dark-900)]">
          ${flujoCaja.toLocaleString("es-AR")}
        </p>
        {/* SALDO INICIAL */}
        <p>
          Saldo inicial:{" "}
          <span className="text-[var(--text-state-green)] font-semibold">
            ${saldoInicial.toLocaleString("es-AR")}
          </span>
        </p>
        {/* TOTAL EN VENTAS */}
        <p>
          Total en ventas:{" "}
          <span className="text-[var(--text-state-green)] font-semibold">
            ${totalVentas.toLocaleString("es-AR")}
          </span>
        </p>
        {/* TOTAL EN GASTOS */}
        <p>
          Gastos:{" "}
          <span className="text-[var(--text-state-red)] font-semibold">
            ${gastos.toLocaleString("es-AR")}
          </span>
        </p>
      </div>

      {/* Footer */}
      <div className="flex flex-col px-2 gap-2 mt-10">
        {/* Footer fijo abajo */}
        <div className="flex justify-center">
          <Button
            disabled={true}
            text={estado === "OPEN" ? "Cerrar Caja" : "Abrir Caja"}
            width={"w-full"}
            onClick={() => setShowClosedBoxModal(true)}
          />
        </div>
        <div className="flex gap-2 justify-center">
          <Button
            disabled={true}
            text={"Agregar Gastos"}
            width={"w-full"}
            onClick={() => setShowExpenseModal(true)}
          />
        </div>
      </div>
    </div>
  );
};

export default CashSummary;
