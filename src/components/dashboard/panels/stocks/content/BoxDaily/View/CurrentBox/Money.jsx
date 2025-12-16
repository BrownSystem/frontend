import { EntryCard } from "../../../../../../widgets";
import {
  Cheque,
  CreditCard,
  Dollar,
  Transfer,
} from "../../../../../../../../assets/icons";
import { useGetIncomeByPaymentMethod } from "../../../../../../../../api/transactions/transaction.queries";

const Money = ({ selectedBranchId }) => {
  const { data: data } = useGetIncomeByPaymentMethod(selectedBranchId);

  return (
    <div className="rounded-xl w-full h-full font-[var(--font-outfit)]">
      {/* EFECTIVO */}
      <EntryCard
        icon={<Dollar color="var(--brown-dark-700)" size={28} />}
        method="EFECTIVO"
        mount={data?.EFECTIVO || "0,00"}
      />

      {/* TARJETA DE CREDITO */}
      <EntryCard
        icon={<CreditCard color="var(--brown-dark-700)" size={28} />}
        method="TARJETAS"
        mount={data?.TARJETA || "0,00"}
      />

      {/* TRANSFERENCIA */}
      <EntryCard
        icon={<Transfer color="var(--brown-dark-900)" size={25} />}
        method="TRANSFERENCIA"
        mount={data?.TRANSFERENCIA || "0,00"}
      />

      {/* CHEQUE */}
      <EntryCard
        icon={<Cheque color="var(--brown-dark-900)" size={25} />}
        method="CHEQUE"
        mount={data?.CHEQUE || "0,00"}
      />
    </div>
  );
};

export default Money;
