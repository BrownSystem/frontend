import { memo, useMemo } from "react";
import Money from "./Money";
import Transactions from "./Transactions/Transactions";
import CashSummary from "./CashSummary/CashSummary";

const CurrentBox = ({ boxDaily, selectedBranchId, selectedBranchName }) => {
  const {
    saldoInicial,
    totalVentas,
    gastos,
    flujoCaja,
    openTime,
    boxNumber,
    transactions,
    estado,
    id,
    branchId,
    branchName,
  } = useMemo(() => {
    if (!boxDaily) {
      return {
        saldoInicial: 0,
        totalVentas: 0,
        gastos: 0,
        flujoCaja: 0,
        openTime: null,
        boxNumber: "----",
        transactions: [],
        estado: "",
        id: "",
        branchId: "",
        branchName: "",
      };
    }

    return {
      saldoInicial: boxDaily.openingAmount || 0,
      totalVentas: boxDaily.totalSales || 0,
      gastos: boxDaily.totalExpenses || 0,
      flujoCaja:
        (boxDaily.openingAmount || 0) +
        (boxDaily.income || 0) -
        (boxDaily.totalExpenses || 0),
      openTime: boxDaily.openedAt || null,
      boxNumber: `0${boxDaily.number}` || "----",
      transactions: boxDaily.transactions || [],
      estado: boxDaily.status,
      id: boxDaily.id,
      branchId: boxDaily.branchId,
      branchName: boxDaily.branchName,
    };
  }, [boxDaily]);

  return (
    <div className="flex gap-4 h-auto w-full">
      <div className="w-full h-full flex flex-col gap-2">
        {/* Resumen de caja */}
        <div className="w-full h-full">
          <CashSummary
            saldoInicial={saldoInicial}
            totalVentas={totalVentas}
            gastos={gastos}
            flujoCaja={flujoCaja}
            openTime={openTime}
            boxNumber={boxNumber}
            estado={estado}
            id={id}
            branchId={branchId}
            branchName={branchName}
            selectedBranchId={selectedBranchId}
            selectedBranchName={selectedBranchName}
          />
        </div>

        {/* Métodos de pago */}
        <div className="w-full h-full flex justify-center items-center">
          <Money boxDaily={boxDaily} selectedBranchId={selectedBranchId} />
        </div>
      </div>

      {/* Transacciones */}
      <div className="col-start-2 row-start-1 row-span-2 w-full h-full">
        <Transactions
          transactions={transactions}
          saldoInicial={saldoInicial}
          branchId={selectedBranchId}
        />
      </div>
    </div>
  );
};

export default memo(CurrentBox);
