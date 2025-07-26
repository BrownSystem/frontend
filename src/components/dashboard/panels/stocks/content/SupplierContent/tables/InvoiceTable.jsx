import { useEffect, useMemo, useState } from "react";
import { usePaginatedTableData } from "../../../../../../../hooks/usePaginatedTableData";
import { BsEye } from "react-icons/bs";
import { Delete, Edit, Replenish } from "../../../../../../../assets/icons";
import { InvoiceModal, InvoicePaymentModal } from "../../../../../../common";
import { GenericTable } from "../../../../../widgets";
import { useAuthStore } from "../../../../../../../api/auth/auth.store";
import { searchVoucher } from "../../../../../../../api/vouchers/vouchers.api";
import { useFindAllBranch } from "../../../../../../../api/branch/branch.queries";
import { useDeleteVoucher } from "../../../../../../../api/vouchers/vouchers.queries";

const InvoiceTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [showModalRegisterPayment, setShowModalRegisterPayment] =
    useState(false);
  const [tags, setTags] = useState("remito");
  const [searchText, setSearchText] = useState("");
  const [comprobanteSeleccionado, setComprobanteSeleccionado] = useState(null);

  const user = useAuthStore((state) => state.user);
  const { data: branches = [] } = useFindAllBranch();
  const limit = 8;

  const conditionPaymentMap = {
    pagos: "CASH",
    ventas: "CREDIT",
  };

  const conditionPaymentSelect = conditionPaymentMap[tags];
  const typeVoucher = tags === "remito" ? "REMITO" : "FACTURA";

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
    additionalParams: {
      conditionPayment: conditionPaymentSelect,
      type: typeVoucher,
    },
    limit,
    enabled: true,
  });

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

  const totalAdeudado = useMemo(() => {
    return rawVoucher
      .filter((v) =>
        v.contactName?.toLowerCase().includes(searchText.toLowerCase())
      )
      .reduce((acc, curr) => acc + (curr.remainingAmount || 0), 0);
  }, [rawVoucher, searchText]);

  const columnsFactura = useMemo(
    () => [
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
        label: "PROVEEDOR",
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
      },
      {
        key: "acciones",
        label: "DETALLES",
        className: "text-center",
        render: (_, row) => (
          <div
            className="flex items-center justify-center cursor-pointer"
            onClick={() => {
              setComprobanteSeleccionado(row);
              setShowModal(true);
            }}
          >
            <BsEye className="h-6 w-6" />
          </div>
        ),
      },
    ],
    [branches]
  );

  const columnsRemito = useMemo(
    () => [
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
        key: "emissionBranchName",
        label: "ORIGEN",
        className: "text-center",
      },
      {
        key: "destinationBranchName",
        label: "DESTINO",
        className: "text-center",
        render: (value) => `${value}`,
      },
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
        key: "acciones",
        label: "DETALLES",
        render: (_, row) => (
          <div className="flex gap-2 justify-center items-center">
            <div
              className="cursor-pointer"
              onClick={() => {
                setComprobanteSeleccionado(row);
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
    ],
    [branches]
  );

  const tabClass = (selected) =>
    `w-full px-4 py-2 text-xl text-center cursor-pointer ${
      tags === selected
        ? "text-[var(--brown-ligth-400)] border-b-2 border-[var(--brown-dark-600)]"
        : "bg-white text-[var(--brown-dark-700)] border-t-2 border-x-2 border-[var(--brown-dark-600)] rounded-t-md shadow-md"
    }`;

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
            origen: comprobanteSeleccionado.emissionBranchName ?? "—",
            destino: `${comprobanteSeleccionado.destinationBranchName || "—"}`,
            cliente: comprobanteSeleccionado.contactName ?? "—",
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
            className={tabClass("factura")}
            onClick={() => setTags("remito")}
          >
            REMITOS
          </div>
          <div
            className={tabClass("remito")}
            onClick={() => setTags("factura")}
          >
            FACTURAS
          </div>
        </div>

        <div className="mt-4">
          <input
            type="text"
            placeholder="Buscar comprobante..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-[15px]"
          />

          {searchText && (
            <div className="mb-2 text-right text-[17px]">
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
            columns={tags === "factura" ? columnsFactura : columnsRemito}
            data={rawVoucher}
            enablePagination={true}
            enableFilter={false}
            isLoading={isLoading}
            externalPagination={true}
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            paginationDisabled={isLoading}
          />
        </div>
      </div>
    </>
  );
};

export default InvoiceTable;
