import { useMemo, useState } from "react";
import { FilterPanel, GenericTable } from "../../../../../../widgets";
import { usePaginatedTableData } from "../../../../../../../../hooks/usePaginatedTableData";
import {
  searchVoucher,
  searchVoucherByContact,
} from "../../../../../../../../api/vouchers/vouchers.api";
import { HideEyes, ShowEyes } from "../../../../../../../../assets/icons";

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { formatFechaISO } from "../../../SupplierContent/tables/InvoiceTable";
import { useReportsFiltersStore } from "../../../../../../../../store/useReportsFiltersStore";
import { searchProducts } from "../../../../../../../../api/products/products.api";
import RepostsMonthly from "./RepostsMonthly";

const Reports = () => {
  const limit = 10;
  const navigate = useNavigate();

  // 🟢 Estados controlados para mes y año
  const {
    selectedIds,
    setSelectedProductIds,
    setSelectedIds,
    selectedProductIds,
  } = useReportsFiltersStore();

  const [branch, setBranch] = useState("");
  const [contactId, setContactId] = useState({
    clienteId: "",
    proveedorId: "",
  });
  const [search, setSearch] = useState("");

  // 🟢 Hook con parámetros dinámicos

  const additionalParams = {
    ...(contactId.clienteId && { contactId: contactId.clienteId }),
    ...(contactId.proveedorId && { contactId: contactId.proveedorId }),
    ...(branch && { branch }),
  };

  const voucherParams = {
    ...(branch && { branch }),
    ...(selectedIds && { contactId: selectedIds }),
    ...(selectedProductIds && { productId: selectedProductIds }),
    ...(selectedIds && { conditionPayment: "CREDIT" }), // solo si es filtro por contacto
  };

  const handleCheckboxChange = (id, checked) => {
    setSelectedIds(checked ? id : "");
  };

  const handleCheckboxChangeProduct = (id, checked) => {
    setSelectedProductIds(checked ? id : "");
  };

  const openVoucher = (row) => {
    navigate(`/dashboard/comprobantes/${row.id}`);
  };

  // 🟢 Datos de contactos para tabla de contactos
  const {
    data: rawVoucherByContact,
    page,
    setPage,
    isLoading,
    totalPages,
  } = usePaginatedTableData({
    fetchFunction: searchVoucherByContact,
    queryKeyBase: "vouchers-by-contact",
    search: "",
    additionalParams,
    limit,
    enabled: true,
  });

  // 🟢 Datos de comprobantes para tabla de comprobantes
  const {
    data: rawVoucher,
    page: pageVoucher,
    setPage: setPageVoucher,
    isLoading: isLoadingVoucher,
    totalPages: totalPagesVoucher,
  } = usePaginatedTableData({
    fetchFunction: searchVoucher,
    queryKeyBase: "vouchers",
    search: "",
    additionalParams: voucherParams,
    limit,
    enabled: true,
  });

  // 🟢 Columnas para tabla de productos
  const {
    data: rawProducts,
    page: pageProducts,
    setPage: setPageProducts,
    isLoading: isLoadingProducts,
    totalPages: totalPagesProducts,
  } = usePaginatedTableData({
    fetchFunction: searchProducts,
    queryKeyBase: "products-branches",
    search,
    limit,
  });

  const columnsFactura = useMemo(() => {
    // Columna base para status
    const baseColumns = [
      {
        key: "status",
        render: (value) => (
          <p
            className={` bg-[var(${
              value !== "PENDIENTE" ? "--bg-state-green" : "--bg-state-yellow"
            })] cursor-pointer border-[1px] border-[var(${
              value !== "PENDIENTE"
                ? "--text-state-green"
                : "--text-state-yellow"
            })] text-[var(--brown-dark-950)] px-2 py-2 text-xs rounded-full w-auto text-center`}
          ></p>
        ),
      },
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
    ];

    // Columna dinámica: SALDO o CANTIDAD
    const amountOrQuantityColumn =
      selectedIds === ""
        ? {
            key: "productQuantity",
            label: "CANTIDAD",
            className: "text-center",
            render: (_, row) =>
              row.type === "P" ? (
                <p className="text-[var(--text-state-red)]">
                  {" "}
                  -{row.productQuantity}
                </p>
              ) : (
                <p className="text-[var(--text-state-green)]">
                  {" "}
                  +{row.productQuantity}
                </p>
              ),
          }
        : {
            key: "remainingAmount",
            label: "SALDO",
            className: "text-center",
            render: (_, row) =>
              `$${row.remainingAmount.toLocaleString("es-AR", {
                minimumFractionDigits: 2,
              })}`,
          };

    // Columnas finales
    const finalColumns = [
      ...baseColumns,
      amountOrQuantityColumn,
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
                </div>
              </motion.div>
            </div>
          </div>
        ),
      },
    ];

    return finalColumns;
  }, [selectedIds, selectedProductIds]);

  const columnsContact = useMemo(
    () => [
      {
        key: "status",
        render: () => (
          <p
            className={` bg-[var(--bg-state-red)] cursor-pointer border-[1px] border-[var(--text-state-red)] text-[var(--brown-dark-950)] px-2 py-2 text-xs rounded-full w-auto text-center`}
          ></p>
        ),
      },
      {
        key: "voucherType",
        label: "CLIENTE/PROVEEDOR",
        className: "text-center",
        render: (value) => (
          <p className="bg-[var(--brown-ligth-100)] rounded-lg border-[1px] border-[var(--brown-dark-500)] text-center">
            {value === "P" ? "CLIENTE" : "PROVEEDOR"}
          </p>
        ),
      },
      {
        key: "contactName",
        label: "NOMBRE",
        className: "text-center",
      },
      {
        key: "totalDeuda",
        label: "SALDO PENDIENTE",
        className: "text-center",
        render: (value) =>
          `$${value.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`,
      },
      {
        key: "voucherCount",
        label: "COMPROBANTES",
        className: "text-center",
      },
      {
        key: "select",
        label: "",
        className: "text-center",
        render: (value, row) => {
          const rowId = row.contactId;
          return (
            <input
              type="checkbox"
              checked={selectedIds?.includes(rowId)}
              onChange={(e) => handleCheckboxChange(rowId, e.target.checked)}
              onClick={(e) => e.stopPropagation()}
            />
          );
        },
      },
    ],
    [selectedIds]
  );

  const columnsProducts = useMemo(
    () => [
      {
        key: "code",
        label: "CÓDIGO",
        className: "text-center",
        render: (value) => (
          <p className="bg-[var(--brown-ligth-100)] rounded-lg border-[1px] border-[var(--brown-dark-500)] text-center">
            #{value}
          </p>
        ),
      },
      {
        key: "description",
        label: "NOMBRE",
        className: "text-center",
      },
      {
        key: "select",
        label: "",
        className: "text-center",
        render: (value, row) => {
          const rowId = row.id;
          return (
            <input
              type="checkbox"
              checked={selectedProductIds?.includes(rowId)}
              onChange={(e) =>
                handleCheckboxChangeProduct(rowId, e.target.checked)
              }
              onClick={(e) => e.stopPropagation()}
            />
          );
        },
      },
    ],
    [selectedProductIds]
  );

  return (
    <div>
      <div className="flex flex-col px-5 self-start p-4 bg-[var(--brown-ligth-100)] rounded-md w-full mt-4">
        <span className="text-[var(--brown-dark-950)] font-semibold">
          PAGOS NO REALIZADOS
        </span>
        <p className="text-[var(--brown-dark-800)]">
          Detalle de saldos pendientes por cliente y proveedor.
        </p>
      </div>
      {/* Filtros de búsqueda */}
      <FilterPanel
        showBothContacts={true}
        setContactId={setContactId}
        setBranch={setBranch}
        branchId={branch}
      />

      {/* Tabla de contacto*/}
      <GenericTable
        columns={columnsContact}
        data={rawVoucherByContact}
        enablePagination={true}
        enableFilter={false}
        isLoading={isLoading}
        externalPagination={true}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        paginationDisabled={isLoading}
      />

      {/* tabla de facturas */}
      {selectedIds && (
        <GenericTable
          columns={columnsFactura}
          data={rawVoucher}
          enablePagination={true}
          enableFilter={false}
          isLoading={isLoadingVoucher}
          externalPagination={true}
          currentPage={pageVoucher}
          totalPages={totalPagesVoucher}
          onPageChange={setPageVoucher}
          paginationDisabled={isLoadingVoucher}
        />
      )}

      {/* HISTORIAL DE PRODUCTOS */}
      <div className="flex flex-col px-5 self-start p-4 bg-[var(--brown-ligth-100)] rounded-md w-full mt-4">
        <span className="text-[var(--brown-dark-950)] font-semibold">
          HISTORIAL DE PRODUCTOS
        </span>
        <p className="text-[var(--brown-dark-800)]">
          Puedes buscar el historial de movimientos de un producto en
          particular.
        </p>
        <div className="flex items-center px-5 mt-2">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2 bg-[var(--brown-ligth-50)]"
          />
        </div>
      </div>

      {/* Tabla de productos */}
      <GenericTable
        columns={columnsProducts}
        data={rawProducts}
        enablePagination={true}
        enableFilter={false}
        externalPagination={false}
        isLoading={isLoadingProducts}
        currentPage={pageProducts}
        totalPages={totalPagesProducts}
        onPageChange={setPageProducts}
        paginationDisabled={isLoadingProducts}
      />

      {/* tabla de facturas */}
      {selectedProductIds && (
        <GenericTable
          columns={columnsFactura}
          data={rawVoucher}
          enablePagination={true}
          enableFilter={false}
          isLoading={isLoadingVoucher}
          externalPagination={true}
          currentPage={pageVoucher}
          totalPages={totalPagesVoucher}
          onPageChange={setPageVoucher}
          paginationDisabled={isLoadingVoucher}
        />
      )}

      {/* ESTADISTICAS MENSUALES */}
      <RepostsMonthly />
    </div>
  );
};

export default Reports;
