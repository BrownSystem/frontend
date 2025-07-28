import { useEffect, useState } from "react";
import { GenericTable } from "../../../../widgets";
import { InvoiceModal, InvoicePaymentModal } from "../../../../../common";
import { BsEye } from "react-icons/bs";
import { useAuthStore } from "../../../../../../api/auth/auth.store";
import { usePaginatedTableData } from "../../../../../../hooks/usePaginatedTableData";
import { searchVoucher } from "../../../../../../api/vouchers/vouchers.api";
import { Delete, Edit, Replenish } from "../../../../../../assets/icons";
import { useDeleteVoucher } from "../../../../../../api/vouchers/vouchers.queries";

const SalesInvoiceTable = () => {
  const [showModal, setShowModal] = useState(false);
  const user = useAuthStore((state) => state.user);
  const [showModalRegisterPayment, setShowModalRegisterPayment] =
    useState(false);
  const [tags, setTags] = useState("ventas");
  const [searchText, setSearchText] = useState("");
  const [comprobanteSeleccionado, setComprobanteSeleccionado] = useState(null);
  const limit = 8;

  const conditionPaymentMap = {
    pagos: "CASH",
    ventas: "CREDIT",
  };

  const conditionPaymentSelect = conditionPaymentMap[tags];

  const { mutate: deleteVoucherMutate } = useDeleteVoucher({
    onSuccess: () => {
      setPage(1); // recarga tabla solo si se borra con éxito
    },
    onError: (error) => {
      console.error("Error al borrar voucher:", error);
    },
  });

  const handlerDelete = (row, actionType) => {
    if (actionType === "SOFT") {
      deleteVoucherMutate({ id: row.id, typeOfDelete: "SOFT" });
    } else if (actionType === "REPLENISH") {
      // Suponiendo que replenish no usa React Query aún:
      deleteVoucherMutate({ id: row.id, typeOfDelete: "REPLENISH" });
    }
  };

  const {
    data: rawVoucher,
    page,
    setPage,
    isLoading,
    totalPages,
  } = usePaginatedTableData({
    fetchFunction: searchVoucher,
    queryKeyBase: "vouchers",
    search: searchText,
    additionalParams: { conditionPayment: conditionPaymentSelect, type: "P" },
    limit,
    enabled: true,
  });

  const totalAdeudado = rawVoucher
    .filter((v) =>
      v.contactName?.toLowerCase().includes(searchText.toLowerCase())
    )
    .reduce((acc, curr) => acc + (curr.remainingAmount || 0), 0);

  const columnsVentas = [
    {
      key: "emissionDate",
      label: "FECHA",
      className: "text-center",
      render: (value) =>
        new Date(value).toLocaleDateString("es-AR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
    },
    {
      key: "contactName",
      label: "CLIENTE",
      className: "text-center",
      render: (value) => `-> ${value}`,
    },
    {
      key: "totalAmount",
      label: "MONTO",
      className: "text-center",
      render: (value) =>
        `$${value.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`,
    },

    {
      key: "emissionBranchName",
      label: "SUCURSAL",
      className: "text-center",
      render: (value) => value,
    },
    {
      key: "acciones",
      label: "DETALLES",
      className: "text-center",
      render: (_, row) => (
        <div className="flex gap-2 justify-center items-center">
          <div
            className="flex items-center justify-center cursor-pointer"
            onClick={() => {
              setShowModal(true);
              setComprobanteSeleccionado(row); // ← guardás el comprobante
              setShowModal(true);
            }}
          >
            <BsEye className="h-6 w-6" />
          </div>
          <div
            title="Revastecer"
            onClick={() => handlerDelete(row, "REPLENISH")}
          >
            <Replenish />
          </div>

          <div title="Borrar" onClick={() => handlerDelete(row, "SOFT")}>
            <Delete />
          </div>
        </div>
      ),
    },
  ];

  const columnsPagos = [
    {
      key: "emissionDate",
      label: "FECHA",
      className: "text-center",
      render: (value) =>
        new Date(value).toLocaleDateString("es-AR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
    },
    { key: "contactName", label: "CLIENTE", className: "text-center" },
    {
      key: "totalAmount",
      label: "MONTO",
      className: "text-center",
      render: (value) =>
        `$${value.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`,
    },
    {
      key: "paidAmount",
      label: "MONTO ABONADO",
      className: "text-center",
      render: (value) => (
        <span className="text-green-700">
          ${value.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      key: "emissionBranchName",
      label: "SUCURSAL",
      className: "text-center",
      render: (value) => `${value}`,
    },
    {
      key: "acciones",
      label: "DETALLES",
      render: (_, row) => (
        <div className="flex gap-2 justify-center items-center">
          <div
            className="cursor-pointer"
            onClick={() => {
              setShowModal(true);
              setComprobanteSeleccionado(row); // ← guardás el comprobante
              setShowModal(true);
            }}
          >
            <BsEye className="h-6 w-6" />
          </div>
          <div
            onClick={() => {
              setComprobanteSeleccionado(row);
              setShowModalRegisterPayment(true);
            }}
          >
            <Edit color={"black"} />
          </div>
          <div
            title="Revastecer"
            onClick={() => handlerDelete(row, "REPLENISH")}
          >
            <Replenish />
          </div>

          <div title="Borrar" onClick={() => handlerDelete(row, "SOFT")}>
            <Delete />
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      {showModal && comprobanteSeleccionado && (
        <InvoiceModal
          onCancel={() => setShowModal(false)}
          onConfirm={() => {
            alert("Pago confirmado");
            setShowModal(false);
          }}
          factura={{
            id: comprobanteSeleccionado.id,
            numero: comprobanteSeleccionado.number ?? "—",
            tipo: comprobanteSeleccionado.type ?? "—",
            fecha: new Date(
              comprobanteSeleccionado.emissionDate
            ).toLocaleDateString("es-AR"),
            cliente: comprobanteSeleccionado.contactName ?? "—",
            direccion: comprobanteSeleccionado.contactAddress ?? "—",
            total: comprobanteSeleccionado.totalAmount ?? 0,
          }}
          productos={(comprobanteSeleccionado.products ?? []).map((p) => ({
            codigo: p.productCode ?? "—",
            descripcion: p.description ?? "—",
            cantidad: p.quantity,
            precio: p.price,
            iva: p.iva ?? 21.5,
          }))}
          pago={{
            formaDePago: comprobanteSeleccionado.initialPayment?.method ?? "—",
            fechaPago: comprobanteSeleccionado.initialPayment?.receivedAt
              ? new Date(
                  comprobanteSeleccionado.initialPayment.receivedAt
                ).toLocaleDateString("es-AR")
              : "—",
            montoPagado: comprobanteSeleccionado.paidAmount ?? 0,
            saldoRestante: comprobanteSeleccionado.remainingAmount ?? 0,
            banco: comprobanteSeleccionado.initialPayment?.bankName ?? "—",
            numeroOperacion:
              comprobanteSeleccionado.initialPayment?.chequeNumber ?? "—",
            observaciones:
              comprobanteSeleccionado.observation ?? "Sin observaciones.",
            registradoPor: comprobanteSeleccionado.createdBy ?? "—",
          }}
        />
      )}

      {showModalRegisterPayment && comprobanteSeleccionado && (
        <InvoicePaymentModal
          onClose={() => setShowModalRegisterPayment(false)}
          factura={{
            id: comprobanteSeleccionado.id,
            numero: comprobanteSeleccionado.number ?? "—",
            proveedor: comprobanteSeleccionado.contactName ?? "—",
            total: comprobanteSeleccionado.totalAmount ?? 0,
            abonado: comprobanteSeleccionado.paidAmount ?? 0,
            saldoPendiente: comprobanteSeleccionado.remainingAmount ?? 0,
            vencimiento:
              comprobanteSeleccionado.dueDate &&
              new Date(comprobanteSeleccionado.dueDate) < new Date()
                ? "Vencida"
                : "En plazo",
            pagosAnteriores: Array.isArray(
              comprobanteSeleccionado.initialPayment
            )
              ? comprobanteSeleccionado.initialPayment.map((p) => ({
                  fecha: p.receivedAt
                    ? new Date(p.receivedAt).toLocaleDateString("es-AR")
                    : "—",
                  monto: p.amount ?? 0,
                  metodo: p.method ?? "—",
                  banco: p.bankName ?? undefined,
                  numeroOperacion: p.chequeNumber ?? undefined,
                }))
              : comprobanteSeleccionado.initialPayment
              ? [
                  {
                    fecha: comprobanteSeleccionado.initialPayment.receivedAt
                      ? new Date(
                          comprobanteSeleccionado.initialPayment.receivedAt
                        ).toLocaleDateString("es-AR")
                      : "—",
                    monto: comprobanteSeleccionado.initialPayment.amount ?? 0,
                    metodo:
                      comprobanteSeleccionado.initialPayment.method ?? "—",
                    banco:
                      comprobanteSeleccionado.initialPayment.bankName ??
                      undefined,
                    numeroOperacion:
                      comprobanteSeleccionado.initialPayment.chequeNumber ??
                      undefined,
                  },
                ]
              : [],
          }}
        />
      )}

      <div className="w-full h-full bg-white rounded-lg shadow p-4">
        <div className="flex text-[15px] font-medium rounded-t-lg overflow-hidden bg-[var(--brown-ligth-200)] mt-4">
          <div
            className={`w-full cursor-pointer px-4 py-2 text-xl text-center ${
              tags === "pagos"
                ? "text-[var(--brown-ligth-400)] border-b-2 border-[var(--brown-dark-600)]"
                : "bg-white text-[var(--brown-dark-700)] border-t-2 border-x-2 border-[var(--brown-dark-600)] rounded-t-md shadow-md"
            }`}
            onClick={() => setTags("ventas")}
          >
            Pagos Parciales
          </div>
          <div
            className={`w-full px-4 py-2 text-xl text-center cursor-pointer ${
              tags === "ventas"
                ? "text-[var(--brown-ligth-400)] border-b-2 border-[var(--brown-dark-600)]"
                : "bg-white text-[var(--brown-dark-700)] border-t-2 border-x-2 border-[var(--brown-dark-600)] rounded-t-md shadow-md"
            }`}
            onClick={() => setTags("pagos")}
          >
            Pagos Completos
          </div>
        </div>

        <div className="mt-4">
          <div className="mt-6 ">
            <input
              type="text"
              placeholder="Buscar comprobante..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-[15px]"
            />
          </div>
          {searchText && (
            <div className="mb-2 text-right text-[17px] ">
              Total adeudado por coincidencias:{" "}
              <span className="text-red-700 font-medium">
                $
                {totalAdeudado.toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          )}
          <GenericTable
            columns={tags === "pagos" ? columnsVentas : columnsPagos}
            data={rawVoucher}
            enablePagination={true}
            enableFilter={false}
            isLoading={isLoading}
            externalPagination={true}
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
            paginationDisabled={isLoading}
          />
        </div>
      </div>
    </>
  );
};

export default SalesInvoiceTable;
