import React from "react";
import {
  Cheque,
  CreditCard,
  Dollar,
  Transfer,
} from "../../../../../../../assets/icons";
import EntryCard from "../../../../../widgets/EntryCard";

const Money = () => {
  return (
    <div className="rounded-xl w-[1000px] max-w-sm font-[var(--font-outfit)]">
      {/* EFECTIVO */}
      <EntryCard
        icon={<Dollar color="var(--brown-dark-700)" size={28} />}
        method="EFECTIVO"
        mount="$69,736"
      />

      {/* TARJETA DE CREDITO */}
      <EntryCard
        icon={<CreditCard color="var(--brown-dark-700)" size={28} />}
        method="TARJETA DE CRÉDITO"
        mount="$50,000"
      />

      {/* TRANSFERENCIA */}
      <EntryCard
        icon={<Transfer color="var(--brown-dark-900)" size={25} />}
        method="TRANSFERENCIA"
        mount="$30,000"
      />

      {/* CHEQUE */}
      <EntryCard
        icon={<Cheque color="var(--brown-dark-900)" size={25} />}
        method="CHEQUE"
        mount="$20,000"
      />
    </div>
  );
};

export default Money;
