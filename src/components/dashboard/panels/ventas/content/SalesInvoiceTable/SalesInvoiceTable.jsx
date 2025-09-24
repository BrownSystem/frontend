import { useState } from "react";
import { FilterPanel, GenericTable, Message } from "../../../../widgets";
import { usePaginatedTableData } from "../../../../../../hooks/usePaginatedTableData";
import { searchVoucher } from "../../../../../../api/vouchers/vouchers.api";
import { Delete, HideEyes, ShowEyes } from "../../../../../../assets/icons";
import { formatFechaISO } from "../../../stocks/content/SupplierContent/tables/InvoiceTable";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSalesViewShopStore } from "../../../../../../store/useTagsStore";
import { useDeleteVoucher } from "../../../../../../api/vouchers/vouchers.queries";
import { PasswordConfirmModal } from "../../../../../common";
import { useVerifyPassword } from "../../../../../../api/auth/auth.queries";
import { useAuthStore } from "../../../../../../api/auth/auth.store";

const SalesInvoiceTable = () => {
  const navigate = useNavigate();

  const tags = useSalesViewShopStore((state) => state.tags);
  const setTags = useSalesViewShopStore((state) => state.setTags);
  const [searchText, setSearchText] = useState("");
  const [voucherToDelete, setVoucherToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState(null);
  const [tempPassword, setTempPassword] = useState("");
  const [modalConfirmation, setModalConfirmation] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "info" });
  const user = useAuthStore((state) => state.user);

  // Filtros
  const [dateFrom, setDateFrom] = useState("");
  const [dateUntil, setDateUntil] = useState("");
  const [contactId, setContactId] = useState("");
  const [branch, setBranch] = useState("");
  // const [montoMin, setMontoMin] = useState("");
  // const [montoMax, setMontoMax] = useState("");

  const limit = 100;

  const conditionPaymentMap = {
    pagos: "CASH",
    ventas: "CREDIT",
    credito: "NOTA_CREDITO_CLIENTE",
  };

  const conditionPaymentSelect = conditionPaymentMap[tags];

  const {
    mutate: verifyPassword,
    isLoading: verifying,
    error: verifyError,
  } = useVerifyPassword();

  const { mutate: deleteVoucherMutate, isLoading: deleting } = useDeleteVoucher(
    {
      onSuccess: () => {
        setMessage({ text: "Comprobante eliminado", type: "success" });
        setPage(1);
        setVoucherToDelete(null);
        setDeleteType(null);
        setTempPassword("");
      },
      onError: (error) => {
        setMessage({
          text: `No se pudo eliminar el comprobante: ${error}`,
          type: "error",
        });
        console.error("Error al borrar voucher:", error);
      },
    }
  );

  // DELETE VOUCHER
  const handlerDelete = (row, actionType) => {
    setModalConfirmation(true);
    setVoucherToDelete(row);
    setDeleteType(actionType);
  };

  const confirmPasswordAndDelete = (password) => {
    verifyPassword(
      { email: user.email, password },
      {
        onSuccess: () => {
          deleteVoucherMutate(
            { id: voucherToDelete.id, typeOfDelete: deleteType },
            {
              onSuccess: () => {
                // cerrar modal y limpiar estados
                setModalConfirmation(false);
                setVoucherToDelete(null);
                setDeleteType(null);
                setTempPassword("");
                setPage(1); // refrescar la tabla
                setMessage({ text: "Comprobante eliminado", type: "success" });
              },
            }
          );
        },
        onError: (error) => {
          setMessage({
            text: `No se pudo eliminar el comprobante: ${error}`,
            type: "error",
          });
        },
      }
    );
  };

  const additionalParams = {
    conditionPayment: conditionPaymentSelect,
    type: tags === "ventas" || tags === "pagos" ? "P" : "NOTA_CREDITO_CLIENTE",
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
    search: searchText,
    additionalParams,
    limit,
    enabled: true,
  });

  // Función para abrir comprobante y guardarlo en localStorage
  const openVoucher = (row) => {
    navigate(`/dashboard/comprobantes/${row.id}`);
  };

  const columnsVentas = [
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
      label: "CLIENTE",
      className: "text-center",
      render: (value) => (
        <p className="text-[var(--brown-ligth-400)]">
          {`->`} <span className="text-black">{` ${value}`}</span>
        </p>
      ),
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
            onClick={() => openVoucher(row)}
          >
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
  ];

  const columnsPagos = [
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
        if (value.includes("NOTA_CREDITO_CLIENTE")) {
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
      key: "contactName",
      label: "CLIENTE",
      className: "text-center",
      render: (value) => (
        <p className="text-[var(--brown-ligth-400)]">
          {`->`} <span className="text-black">{` ${value}`}</span>
        </p>
      ),
    },

    {
      key: "remainingAmount",
      label: "SALDO",
      className: "text-center",
      render: (value) =>
        `$${value.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`,
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
          {row.type === "NOTA_CREDITO_CLIENTE" && (
            <div title="Borrar" onClick={() => handlerDelete(row, "REPLENISH")}>
              <Delete />
            </div>
          )}
        </div>
      ),
    },
  ];

  const tabs = [
    { label: "PAGOS PARCIALES", value: "ventas" },
    { label: "PAGOS COMPLETOS", value: "pagos" },
    { label: "NOTA DE CREDITO", value: "creditos" },
  ];

  return (
    <>
      <Message
        message={message.text}
        type={message.type}
        duration={3000}
        onClose={() => setMessage({ text: "" })}
      />
      {modalConfirmation && (
        <PasswordConfirmModal
          password={tempPassword}
          onPasswordChange={setTempPassword}
          onCancel={() => {
            setModalConfirmation(false);
            setVoucherToDelete(null);
            setDeleteType(null);
            setTempPassword("");
          }}
          onConfirm={(password) => confirmPasswordAndDelete(password)}
          isLoading={verifying || deleting}
          error={verifyError?.message}
        />
      )}
      {/* CONTENEDOR */}
      <div className="w-full h-full bg-white rounded-lg shadow ">
        <div className="w-full h-full bg-white rounded-lg shadow p-4">
          <div className="flex text-[15px] font-medium rounded-t-lg overflow-hidden bg-[var(--brown-ligth-200)]">
            {tabs.map((tab) => (
              <div
                key={tab.value}
                className={`w-full cursor-pointer px-4 py-2 text-xl text-center ${
                  tags === tab.value
                    ? "bg-white text-[var(--brown-dark-700)] border-t-2 border-x-2 border-[var(--brown-dark-600)] rounded-t-md shadow-md"
                    : "text-[var(--brown-ligth-400)] border-b-2 border-[var(--brown-dark-600)]"
                }`}
                onClick={() => setTags(tab.value)}
              >
                {tab.label}
              </div>
            ))}
          </div>
        </div>

        {/* PANEL DE FILTROS */}
        <FilterPanel
          contact="cliente"
          dateFrom={dateFrom}
          setDateFrom={setDateFrom}
          dateUntil={dateUntil}
          setDateUntil={setDateUntil}
          setContactId={setContactId}
          setBranch={setBranch}
        />

        {/* TABLA */}
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
    </>
  );
};

export default SalesInvoiceTable;
