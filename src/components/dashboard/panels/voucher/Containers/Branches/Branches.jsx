import React from "react";
import VoucherContact from "../Contact/VoucherContact";
import { Location, Social } from "../../../../../../assets/icons";
import { useFindAllBranch } from "../../../../../../api/branch/branch.queries";
import ItemBranch from "./ItemBranch";

const Branches = ({ voucher }) => {
  const { data: branches, isLoading } = useFindAllBranch();

  if (isLoading) {
    return <p>Cargando sucursal...</p>;
  }

  // encontrar la sucursal asociada al comprobante
  const branchEmission = branches?.find(
    (b) => b.id === voucher?.emissionBranchId
  );

  const branchDestination = branches?.find(
    (b) => b.id === voucher?.destinationBranchId
  );

  return (
    <div className="flex flex-col items-center justify-center gap-3 w-full py-2 rounded-md">
      <div className="flex flex-col px-5 self-start p-4 bg-[var(--brown-ligth-200)] rounded-md w-full">
        <span className="text-[var(--brown-dark-950)] font-semibold">
          INFORMACIÓN DEL ENVÍO
        </span>
        <p className="text-[var(--brown-dark-800)]">
          Datos de envío asociado a este remito.
        </p>
      </div>

      <div className="flex justify-center items-center w-full ">
        <div className="flex l px-5 self-start p-4 bg-[var(--brown-ligth-200)] rounded-md w-auto gap-4">
          <div className="flex justify-center items-center text-[var(--brown-dark-700)]">
            {branchEmission ? (
              <ItemBranch branch={branchEmission} />
            ) : (
              <p>No se encontró la sucursal asociada.</p>
            )}
          </div>
          <div className="flex justify-center items-center text-[var(--brown-dark-700)]">
            <Location size={36} />
          </div>
          <div className="flex justify-center items-center text-[var(--brown-dark-700)]">
            {branchDestination ? (
              <ItemBranch branch={branchDestination} />
            ) : (
              <p>No se encontró la sucursal asociada.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Branches;
