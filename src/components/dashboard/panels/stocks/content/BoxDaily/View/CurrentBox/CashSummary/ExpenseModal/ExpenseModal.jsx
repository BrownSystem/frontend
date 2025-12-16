import { useState } from "react";
import {
  Expense,
  Lamp,
  ProfileMan,
  Social,
} from "../../../../../../../../../../assets/icons";
import { LabelInvoice } from "../../../../../../../../widgets";
import { motion } from "framer-motion";
import Method from "../../../../../../../voucher/Containers/Payments/Method";
import TypeOfExpenses from "./TypeOfExpenses";

const ExpenseModal = ({
  showExpenseModal,
  setShowExpenseModal,
  boxId,
  selectedBranchId,
  selectedBranchName,
}) => {
  if (!showExpenseModal) return null;
  const [selectedExpense, setSelectedExpense] = useState("");

  const expense = [
    { icon: <Social />, label: "SUCURSAL" },
    { icon: <ProfileMan />, label: "EMPLEADOS (VALES)" },
    { icon: <Lamp />, label: "CATEGORIA" },
  ];
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-[var(--brown-dark-900)]/40 w-full z-[9999]">
      <div className="w-[80%] pb-10 rounded-md bg-[var(--brown-ligth-100)] max-h-full">
        {/* HEADER */}
        <div className="flex justify-between px-6 pb-3 pt-6 border-b-[1px] pr-5 border-[var(--brown-ligth-200)] rounded-t-md">
          <div className="flex gap-6 items-center">
            <span className="bg-[var(--brown-ligth-400)] rounded-full w-[50px] h-[50px] flex justify-center items-center">
              <Expense size={32} />
            </span>
            <div>
              <h1 className="font-semibold text-[var(--brown-dark-900)] text-lg">
                AGREGAR GASTOS
              </h1>
              <p className="text-[var(--brown-dark-800)]">
                Complete los campos para continuar.
              </p>
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="max-h-[70vh] overflow-y-auto px-6">
          <div className="px-6 pt-4 flex justify-center flex-col ">
            <LabelInvoice text={"Tipos de gastos"} />
            <div
              className={`flex px-6 mt-2 w-full transition-all duration-500 ${
                selectedExpense ? "justify-start gap-4" : "justify-start gap-6"
              }`}
            >
              {expense.map((m) => (
                <motion.div
                  key={m.label}
                  animate={{
                    opacity: selectedExpense
                      ? selectedExpense === m.label
                        ? 1
                        : 0.3
                      : 1,
                    scale: selectedExpense === m.label ? 1.04 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Method
                    icon={m.icon}
                    label={m.label}
                    selected={selectedExpense === m.label}
                    onClick={() => {
                      setSelectedExpense(
                        selectedExpense === m.label ? "" : m.label
                      );
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          <TypeOfExpenses
            setShowExpenseModal={setShowExpenseModal}
            boxId={boxId}
            selectedExpense={selectedExpense}
            selectedBranchId={selectedBranchId}
            selectedBranchName={selectedBranchName}
          />
        </div>
      </div>
    </div>
  );
};

export default ExpenseModal;
