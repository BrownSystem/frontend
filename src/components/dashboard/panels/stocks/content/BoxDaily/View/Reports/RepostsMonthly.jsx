import React, { useState, useMemo } from "react";
import { useExpensesByBranchAndDate } from "../../../../../../../../api/boxDaily/boxDaily.queries";
import {
  useSalesMonthlyVoucherByBranch,
  useSalesVoucherByBranch,
} from "../../../../../../../../api/vouchers/vouchers.queries";
import { useAuthStore } from "../../../../../../../../api/auth/auth.store";
import { useFindAllBranch } from "../../../../../../../../api/branch/branch.queries";
import VoucherAmountCard from "../../../../../voucher/Containers/Payments/VoucherAmountCard";
import { useReportsFiltersStore } from "../../../../../../../../store/useReportsFiltersStore";
import { GenericTable, LabelInvoice } from "../../../../../../widgets";
import { salesMonthlyVoucherByBranch } from "../../../../../../../../api/vouchers/vouchers.api";
import { usePaginatedTableData } from "../../../../../../../../hooks/usePaginatedTableData";

const RepostsMonthly = () => {
  const limit = 10;
  const user = useAuthStore((state) => state.user);
  const { data: branches = [] } = useFindAllBranch();
  const [selectedBranch, setSelectedBranch] = useState(user.branchId);

  const { selectedMonth, selectedYear, setSelectedMonth, setSelectedYear } =
    useReportsFiltersStore();

  const additionalParams = {
    ...(selectedMonth && { month: selectedMonth }),
    ...(selectedYear && { year: selectedYear }),
  };

  const {
    data: rawSalesMonthly,
    page: salesMonthlyPage,
    setPage: setSalesMonthlyPage,
    isLoading: isLoadingSalesMonthly,
    totalPages: totalSalesMonthlyPages,
  } = usePaginatedTableData({
    fetchFunction: salesMonthlyVoucherByBranch,
    queryKeyBase: "SalesMonthlyVoucherByBranch",
    additionalParams,
    limit,
    enabled: true,
  });

  const { data: expensesData } = useExpensesByBranchAndDate({
    branchId: selectedBranch,
    month: selectedMonth,
    year: selectedYear,
  });

  const expenses = expensesData?.groupedExpenses || [];

  // 📋 Columnas de tabla de ventas mensuales
  const columnsSalesMonthly = useMemo(
    () => [
      {
        key: "branchName",
        label: "SUCURSAL",
        className: "text-center",
        render: (value) => (
          <p className="bg-[var(--brown-ligth-100)] rounded-lg border-[1px] border-[var(--brown-dark-500)] text-center">
            {value}
          </p>
        ),
      },
      {
        key: "cobranzas",
        label: "COBRANZAS",
        className: "text-center",
        render: (value) =>
          `$${value?.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`,
      },
      {
        key: "ventas",
        label: "INGRESOS",
        className: "text-center",
        render: (value) =>
          `$${value?.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`,
      },
      {
        key: "cantidadComprobantes",
        label: "CANTIDAD COMPROBANTES",
        className: "text-center",
      },
    ],
    []
  );

  // 📋 Columnas de tabla de gastos mensuales
  const columnsExpenses = useMemo(
    () => [
      {
        key: "group",
        label: "GRUPO",
        className: "text-left font-medium",
      },
      {
        key: "total",
        label: "MONTO TOTAL",
        className: "text-right",
        render: (value) =>
          `$${value?.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`,
      },
      {
        key: "count",
        label: "CANTIDAD",
        className: "text-center",
      },
      {
        key: "percentage",
        label: "PORCENTAJE",
        className: "text-center",
        render: (value) => `${value?.toFixed(2)}%`,
      },
    ],
    []
  );

  return (
    <>
      {/* VENTAS MENSUALES */}
      <div className="flex flex-col px-5 self-start p-4 bg-[var(--brown-ligth-100)] rounded-md w-full mt-4 gap-3">
        <div>
          <span className="text-[var(--brown-dark-950)] font-semibold">
            INFORMACIÓN DE VENTAS MENSUALES
          </span>
          <p className="text-[var(--brown-dark-800)]">
            Seleccione el mes y año para ver las ventas mensuales.
          </p>
        </div>
        <div className="flex w-full justify-center gap-5">
          {/* INPUT PARA CAMBIAR EL MES */}
          <div className="w-full">
            <LabelInvoice text="Mes" />
            <select
              id="month"
              name="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2 bg-[var(--brown-ligth-50)]"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i + 1}>
                  {new Date(0, i)
                    .toLocaleString("es-AR", { month: "long" })
                    .toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* INPUT PARA CAMBIAR EL AÑO */}
          <div className="w-full">
            <LabelInvoice text="Año" />
            <select
              id="year"
              name="year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2 bg-[var(--brown-ligth-50)]"
            >
              {Array.from({ length: 5 }, (_, i) => (
                <option key={i} value={new Date().getFullYear() - i}>
                  {new Date().getFullYear() - i}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 🔹 TABLA DE VENTAS MENSUALES */}
      <div className="mt-4 bg-[var(--brown-ligth-50)] rounded-md p-4 shadow-sm">
        <GenericTable
          columns={columnsSalesMonthly}
          data={rawSalesMonthly}
          enablePagination={true}
          enableFilter={false}
          isLoading={isLoadingSalesMonthly}
          externalPagination={true}
          currentPage={salesMonthlyPage}
          totalPages={totalSalesMonthlyPages}
          onPageChange={setSalesMonthlyPage}
          paginationDisabled={isLoadingSalesMonthly}
        />
      </div>

      {/* GASTOS MENSUALES */}
      <div className="flex justify-between items-center px-5 self-start p-4 bg-[var(--brown-ligth-100)] rounded-md w-full mt-4">
        <div className="w-full">
          <div>
            <span className="text-[var(--brown-dark-950)] font-semibold">
              INFORMACIÓN DE GASTOS MENSUALES
            </span>
            <p className="text-[var(--brown-dark-800)]">
              Los datos se agrupan por tipo de gasto.
            </p>
          </div>
          <div className="flex w-full justify-center items-center gap-5">
            {/* INPUT PARA CAMBIAR SUCURSAL */}
            <div className="w-full flex gap-5">
              <div className="w-full">
                <LabelInvoice text="Sucursal" />
                <select
                  id="branch"
                  name="branch"
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2 bg-[var(--brown-ligth-50)]"
                >
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <VoucherAmountCard
                  label={"TOTAL"}
                  bgColor={"bg-[var(--bg-state-red)]"}
                  borderColor={"border-[var(--text-state-red)]"}
                  textColor={"text-[var(--text-state-red)]"}
                  amount={expensesData?.totalAmount || 0}
                  sizeText="text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 TABLA DE GASTOS MENSUALES */}
      <div className="mt-2 bg-[var(--brown-ligth-50)] rounded-md p-4 shadow-sm">
        <GenericTable
          columns={columnsExpenses}
          data={expenses}
          enablePagination={false}
          enableFilter={false}
          isLoading={!expensesData}
        />
      </div>
    </>
  );
};

export default RepostsMonthly;
