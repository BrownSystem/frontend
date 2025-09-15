import { useMemo, useState, useEffect } from "react";
import { usePaginatedTableData } from "../../../../../../../hooks/usePaginatedTableData";
import { Delete, HideEyes, ShowEyes } from "../../../../../../../assets/icons";
import { GenericTable, FilterPanel } from "../../../../../widgets";
import { useAuthStore } from "../../../../../../../api/auth/auth.store";
import { searchVoucher } from "../../../../../../../api/vouchers/vouchers.api";
import { useFindAllBranch } from "../../../../../../../api/branch/branch.queries";
import { useDeleteVoucher } from "../../../../../../../api/vouchers/vouchers.queries";
import { useVerifyPassword } from "../../../../../../../api/auth/auth.queries";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSalesViewStockStore } from "../../../../../../../store/useTagsStore";

export const formatFechaISO = (isoDate) => {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("T")[0].split("-");
  return `${day}/${month}/${year}`;
};

const InvoiceTable = () => {
  const navigate = useNavigate();
  const tags = useSalesViewStockStore((state) => state.tags);
  const setTags = useSalesViewStockStore((state) => state.setTags);
  const [voucherToDelete, setVoucherToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState(null);
  const [tempPassword, setTempPassword] = useState("");

  // filtros
  const [dateFrom, setDateFrom] = useState("");
  const [dateUntil, setDateUntil] = useState("");
  const [contactId, setContactId] = useState("");
  const [branch, setBranch] = useState("");
  // const [montoMin, setMontoMin] = useState("");
  // const [montoMax, setMontoMax] = useState("");

  const user = useAuthStore((state) => state.user);
  const { data: branches = [] } = useFindAllBranch();
  const limit = 100;

  const conditionPaymentMap = {
    pagos: "CASH",
    ventas: "CREDIT",
  };

  const conditionPaymentSelect = conditionPaymentMap[tags];
  const typeVoucher =
    tags === "remito"
      ? "REMITO"
      : tags === "factura"
      ? "FACTURA"
      : "NOTA_CREDITO_PROVEEDOR";

  const additionalParams = {
    conditionPayment: conditionPaymentSelect,
    type: typeVoucher,
    ...(dateFrom && { dateFrom: new Date(dateFrom) }),
    ...(dateUntil && { dateUntil: new Date(dateUntil) }),
    ...(contactId && { contactId }),
    ...(branch && { branch }),
    // ...(montoMin && { montoMin }),
    // ...(montoMax && { montoMax }),
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
    search: "",
    additionalParams,
    limit,
    enabled: true,
  });

  const {
    mutate: verifyPassword,
    isLoading: verifying,
    error: verifyError,
  } = useVerifyPassword();

  const { mutate: deleteVoucherMutate, isLoading: deleting } = useDeleteVoucher(
    {
      onSuccess: () => {
        setPage(1);
        setVoucherToDelete(null);
        setDeleteType(null);
        setTempPassword("");
      },
      onError: (error) => {
        console.error("Error al borrar voucher:", error);
      },
    }
  );

  const handlerDelete = (row, actionType) => {
    setVoucherToDelete(row);
    setDeleteType(actionType);
    setTempPassword("");
  };

  const confirmPasswordAndDelete = (password) => {
    verifyPassword(
      { email: user.email, password },
      {
        onSuccess: () => {
          deleteVoucherMutate({
            id: voucherToDelete.id,
            typeOfDelete: deleteType,
          });
        },
      }
    );
  };

  // Función para abrir comprobante y guardarlo en localStorage
  const openVoucher = (row) => {
    navigate(`/dashboard/comprobantes/${row.id}`);
  };

  const columnsFactura = useMemo(
    () => [
      {
        key: "emissionDate",
        label: "FECHA",
        className: "text-center",
        render: (value) => formatFechaISO(value),
      },
      {
        key: "number",
        label: "NUMERO",
        className: "text-center",
        render: (value) => (
          <p className="bg-[var(--brown-ligth-100)] rounded-lg border-[1px] border-[var(--brown-dark-500)]">{`${value}`}</p>
        ),
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
        render: (_, row) => (
          <div className="flex gap-2 justify-center items-center">
            <div className="cursor-pointer" onClick={() => openVoucher(row)}>
              <motion.div
                className="cursor-pointer"
                initial="closed"
                whileHover="open"
              >
                <div className="flex items-center justify-center relative w-7 h-7">
                  <AnimatePresence mode="wait">
                    {/* Ojo cerrado */}
                    <motion.div
                      key="closed"
                      variants={{
                        closed: { opacity: 1, scale: 1 },
                        open: { opacity: 0, scale: 0.8 },
                      }}
                      transition={{ duration: 0.2 }}
                      className="absolute"
                    >
                      <HideEyes size={28} />
                    </motion.div>

                    {/* Ojo abierto */}
                    <motion.div
                      key="open"
                      variants={{
                        closed: { opacity: 0, scale: 0.8 },
                        open: { opacity: 1, scale: 1 },
                      }}
                      transition={{ duration: 0.2 }}
                      className="absolute bottom-[0.5px] left-[0.5px]"
                    >
                      <ShowEyes size={30} />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
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
        render: (value) => formatFechaISO(value),
      },
      {
        key: "number",
        label: "NUMERO",
        className: "text-center",
        render: (value) => (
          <p className="bg-[var(--brown-ligth-100)] rounded-lg border-[1px] border-[var(--brown-dark-500)]">{`${value}`}</p>
        ),
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
        key: "acciones",
        label: "DETALLES",
        render: (_, row) => (
          <div className="flex gap-2 justify-center items-center">
            <div className="cursor-pointer" onClick={() => openVoucher(row)}>
              {/* Contenedor de los ojos */}
              <motion.div
                className="cursor-pointer"
                initial="closed"
                whileHover="open"
              >
                <div className="flex items-center justify-center relative w-7 h-7">
                  <AnimatePresence mode="wait">
                    {/* Ojo cerrado */}
                    <motion.div
                      key="closed"
                      variants={{
                        closed: { opacity: 1, scale: 1 },
                        open: { opacity: 0, scale: 0.8 },
                      }}
                      transition={{ duration: 0.2 }}
                      className="absolute"
                    >
                      <HideEyes size={28} />
                    </motion.div>

                    {/* Ojo abierto */}
                    <motion.div
                      key="open"
                      variants={{
                        closed: { opacity: 0, scale: 0.8 },
                        open: { opacity: 1, scale: 1 },
                      }}
                      transition={{ duration: 0.2 }}
                      className="absolute bottom-[0.5px] left-[0.5px]"
                    >
                      <ShowEyes size={30} />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
            <div title="Borrar" onClick={() => handlerDelete(row, "REPLENISH")}>
              <Delete />
            </div>
          </div>
        ),
      },
    ],
    [branches]
  );

  const columnsCredito = useMemo(
    () => [
      {
        key: "emissionDate",
        label: "FECHA",
        className: "text-center",
        render: (value) => formatFechaISO(value),
      },
      {
        key: "number",
        label: "NUMERO",
        className: "text-center",
        render: (value) => {
          if (value.includes("NOTA_CREDITO_PROVEEDOR")) {
            const parts = value.split(/[-_]/);
            const numero = parts[parts.length - 1];
            return (
              <p className="bg-[var(--brown-ligth-100)] rounded-lg border-[1px] border-[var(--brown-dark-500)]">
                NTC_{numero}
              </p>
            );
          }
          return (
            <p className="bg-[var(--brown-ligth-100)] rounded-lg border-[1px] border-[var(--brown-dark-500)]">
              {value}
            </p>
          );
        },
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
        render: (_, row) =>
          row.destinationBranchName === "Sucursal destino"
            ? row.contactName ?? "-"
            : row.destinationBranchName ?? "-",
      },
      {
        key: "acciones",
        label: "DETALLES",
        render: (_, row) => (
          <div className="flex gap-2 justify-center items-center">
            <div className="cursor-pointer" onClick={() => openVoucher(row)}>
              <motion.div
                className="cursor-pointer"
                initial="closed"
                whileHover="open"
              >
                <div className="flex items-center justify-center relative w-7 h-7">
                  <AnimatePresence mode="wait">
                    {/* Ojo cerrado */}
                    <motion.div
                      key="closed"
                      variants={{
                        closed: { opacity: 1, scale: 1 },
                        open: { opacity: 0, scale: 0.8 },
                      }}
                      transition={{ duration: 0.2 }}
                      className="absolute"
                    >
                      <HideEyes size={28} />
                    </motion.div>

                    {/* Ojo abierto */}
                    <motion.div
                      key="open"
                      variants={{
                        closed: { opacity: 0, scale: 0.8 },
                        open: { opacity: 1, scale: 1 },
                      }}
                      transition={{ duration: 0.2 }}
                      className="absolute bottom-[0.5px] left-[0.5px]"
                    >
                      <ShowEyes size={30} />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
            <div title="Borrar" onClick={() => handlerDelete(row, "REPLENISH")}>
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
        ? "bg-white text-[var(--brown-dark-700)] border-t-2 border-x-2 border-[var(--brown-dark-600)] rounded-t-md shadow-md"
        : "text-[var(--brown-ligth-400)] border-b-2 border-[var(--brown-dark-600)]"
    }`;

  return (
    <div className="w-full h-full bg-white rounded-lg shadow p-4">
      {/* tabs */}
      <div className="flex text-[15px] font-medium rounded-t-lg overflow-hidden bg-[var(--brown-ligth-200)]">
        <div className={tabClass("remito")} onClick={() => setTags("remito")}>
          REMITOS
        </div>
        <div className={tabClass("factura")} onClick={() => setTags("factura")}>
          FACTURAS
        </div>
        <div className={tabClass("credito")} onClick={() => setTags("credito")}>
          NOTA DE CREDITO
        </div>
      </div>

      {/* filtros */}
      <FilterPanel
        contact="proveedor"
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateUntil={dateUntil}
        setDateUntil={setDateUntil}
        setContactId={setContactId}
        setBranch={setBranch}
      />

      {/* tabla */}
      <GenericTable
        columns={
          tags === "factura"
            ? columnsFactura
            : tags === "remito"
            ? columnsRemito
            : columnsCredito
        }
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
  );
};

export default InvoiceTable;
