import { useState } from "react";
import { useSearchVouchers } from "../../../../../api/vouchers/vouchers.queries";
import { InvoiceIcon } from "../../../../../assets/icons";
import { Message } from "../../../../dashboard/widgets";
import { useFindAllBranch } from "../../../../../api/branch/branch.queries";
import { useMessageStore } from "../../../../../store/useMessage";

const CreditNoteList = ({
  onSelect,
  selectedInvoice,
  branchId,
  tipo,
  debouncedSearch,
}) => {
  const { setMessage } = useMessageStore();

  const { data: branches } = useFindAllBranch();
  const branchName = branches?.find((item) => item.id === branchId)?.name;

  const { data: invoice = [], isLoading } = useSearchVouchers({
    branch: branchName || undefined,
    type: tipo === "NOTA_CREDITO_CLIENTE" ? "P" : "FACTURA",
    offset: 1,
    limit: 50,
  });

  // Mostrar solo la hora (HH:mm)
  const formatHour = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) return <p>Cargando...</p>;
  if (invoice?.data?.length === 0)
    return <p>{`No hay ${tipo} disponibles.`}</p>;

  return (
    <div className="space-y-4 overflow-y-scroll max-h-[250px] scroll-pl-6  p-5">
      <ul className="space-y-3">
        {invoice?.data?.map((item) => (
          <li
            key={item?.id}
            onClick={() => onSelect(item)}
            className="flex flex-col gap-2 w-full"
          >
            <div
              className={`flex items-center justify-between px-5 py-2 rounded-md transition shadow-sm cursor-pointer
              ${
                selectedInvoice?.id === item.id
                  ? "bg-[var(--brown-ligth-200)] ring-2 ring-[var(--brown-dark-600)]"
                  : "bg-[var(--brown-ligth-50)] hover:bg-[var(--brown-ligth-200)]"
              }`}
            >
              <div className="flex items-center gap-3 w-full">
                <div className="bg-[var(--brown-ligth-300)] rounded-full w-[50px] h-[50px] flex justify-center items-center">
                  <InvoiceIcon size="30" />
                </div>
                <div className="w-full ">
                  <span className="flex gap-2 justify-between items-center">
                    <p className="text-md font-medium text-[var(--brown-dark-900)]">
                      {item?.number}
                    </p>
                    <p className="text-[14px] text-[var(--brown-dark-900)]">
                      {formatHour(item?.createdAt) || ""}
                    </p>
                  </span>
                  <span className="flex gap-2 justify-between items-center">
                    <p className="text-md font-medium text-[var(--brown-dark-500)]">
                      {item?.contactName || "Sin Télefono"}
                    </p>
                    <p className="text-[14px] text-[var(--brown-dark-800)]">
                      ( PRODUCTOS: {item?.products?.length} )
                    </p>
                  </span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CreditNoteList;
