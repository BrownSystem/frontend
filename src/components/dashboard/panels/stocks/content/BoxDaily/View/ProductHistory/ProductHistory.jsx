import { useMemo, useState } from "react";
import { GenericTable } from "../../../../../../widgets";
import { usePaginatedTableData } from "../../../../../../../../hooks/usePaginatedTableData";
import { searchVoucher } from "../../../../../../../../api/vouchers/vouchers.api";
import { HideEyes, ShowEyes } from "../../../../../../../../assets/icons";

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { formatFechaISO } from "../../../SupplierContent/tables/InvoiceTable";
import { useReportsFiltersStore } from "../../../../../../../../store/useReportsFiltersStore";
import { searchProducts } from "../../../../../../../../api/products/products.api";

const ProductHistory = () => {
  const limit = 10;
  const navigate = useNavigate();

  const { selectedIds, setSelectedProductIds, selectedProductIds } =
    useReportsFiltersStore();

  const [branch, setBranch] = useState("");
  const [search, setSearch] = useState("");

  // 🟢 Parámetros dinámicos para la búsqueda de comprobantes (Vouchers)
  const voucherParams = useMemo(
    () => ({
      ...(branch && { branch }),
      ...(selectedIds && { contactId: selectedIds }),
      ...(selectedProductIds && { productId: selectedProductIds }),
      // Si filtramos por contacto, solemos buscar deudas (Credit)
      ...(selectedIds && !selectedProductIds && { conditionPayment: "CREDIT" }),
    }),
    [branch, selectedIds, selectedProductIds],
  );

  const handleCheckboxChangeProduct = (id, checked) => {
    setSelectedProductIds(checked ? id : "");
  };

  const openVoucher = (row) => {
    navigate(`/dashboard/comprobantes/${row.id}`);
  };

  // 🟢 Fetch de Productos
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

  // 🟢 Fetch de Comprobantes filtrados por el producto seleccionado
  const {
    data: rawVoucher,
    page: pageVoucher,
    setPage: setPageVoucher,
    isLoading: isLoadingVoucher,
    totalPages: totalPagesVoucher,
  } = usePaginatedTableData({
    fetchFunction: searchVoucher,
    queryKeyBase: "vouchers-history",
    search: "",
    additionalParams: voucherParams,
    limit,
    enabled: !!selectedProductIds, // Solo se activa si hay un producto seleccionado
  });

  // 📊 Columnas de la Tabla de Comprobantes (Historial)
  const columnsFactura = useMemo(() => {
    const baseColumns = [
      {
        key: "emissionDate",
        label: "FECHA",
        className: "text-center",
        render: (value) => formatFechaISO(value),
      },
      {
        key: "number",
        label: "NÚMERO",
        className: "text-center",
        render: (value) => {
          if (
            value.includes("NOTA_CREDITO_CLIENTE") ||
            value.includes("NOTA_CREDITO_PROVEEDOR")
          ) {
            const parts = value.split(/[-_]/);
            const numero = parts[parts.length - 1];
            return (
              <p className="bg-[var(--brown-ligth-100)] rounded-lg border-[1px] border-[var(--brown-dark-500)]">
                NTC_{numero}
              </p>
            );
          }
          return (
            <p className="bg-[var(--brown-ligth-100)] rounded-lg border border-[var(--brown-dark-500)] px-2 font-mono text-sm">
              {value}
            </p>
          );
        },
      },
      {
        key: "entidad",
        label: "ORIGEN / DESTINO",
        className: "text-center",
        render: (_, row) => {
          const isTransfer =
            row.type === "REMITO" &&
            row.emissionBranchId !== row.destinationBranchId;
          const nombre =
            row.contactName || row.destinationBranchName || "AJUSTE INTERNO";

          let subLabel = "PROVEEDOR";
          if (row.type === "NOTA_CREDITO_CLIENTE" || row.type === "P")
            subLabel = "CLIENTE";
          if (row.type === "REMITO")
            subLabel = isTransfer ? "SUCURSAL DESTINO" : "STOCK LOCAL";

          return (
            <div className="flex flex-col">
              <span className="font-semibold text-[var(--brown-dark-950)] leading-tight text-sm">
                {nombre}
              </span>
              <span className="text-[9px] text-[var(--brown-dark-500)] italic uppercase font-bold">
                {subLabel}
              </span>
            </div>
          );
        },
      },
    ];

    // Lógica de Movimiento de Stock (Cantidad) o Saldo Monetario
    const amountOrQuantityColumn =
      selectedProductIds !== ""
        ? {
            key: "productQuantity",
            label: "MOVIMIENTO",
            className: "text-center",
            render: (_, row) => {
              let isPositive = false;

              if (row.type === "REMITO") {
                // 🔄 Si IDs iguales -> Aumenta stock (ingreso/ajuste). Si distintos -> Resta (salida/envío)
                isPositive = row.emissionBranchId === row.destinationBranchId;
              } else if (row.type === "FACTURA") {
                isPositive = true;
              } else {
                // Las NC de cliente suelen ser devoluciones (entra stock)
                isPositive = row.type === "NOTA_CREDITO_CLIENTE";
              }

              const color = isPositive ? "text-green-600" : "text-red-600";
              const sign = isPositive ? "+" : "-";

              return (
                <div className="flex flex-col items-center">
                  <span className={`font-bold ${color} text-lg`}>
                    {sign}
                    {row.productQuantity}
                  </span>
                  <span className="text-[9px] bg-gray-200 px-1 rounded text-gray-600 font-bold uppercase">
                    {row.type.replace(/_/g, " ")}
                  </span>
                </div>
              );
            },
          }
        : {
            key: "remainingAmount",
            label: "SALDO",
            className: "text-center",
            render: (value, row) => {
              const isNC = row.type.includes("NOTA_CREDITO");
              return (
                <div className="flex flex-col">
                  <span
                    className={`font-semibold ${isNC ? "text-blue-600" : ""}`}
                  >
                    {isNC ? "(-)" : ""} $
                    {value.toLocaleString("es-AR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              );
            },
          };

    return [
      ...baseColumns,
      amountOrQuantityColumn,
      {
        key: "emissionBranchName",
        label: "SUCURSAL EMISORA",
        className: "text-center text-xs text-gray-500",
      },
      {
        key: "acciones",
        label: "DETALLES",
        render: (_, row) => (
          <div className="flex justify-center items-center">
            <div className="cursor-pointer" onClick={() => openVoucher(row)}>
              <motion.div
                initial="closed"
                whileHover="open"
                className="relative w-7 h-7"
              >
                <motion.div
                  variants={{ closed: { opacity: 1 }, open: { opacity: 0 } }}
                  className="absolute"
                >
                  <HideEyes size={24} />
                </motion.div>
                <motion.div
                  variants={{ closed: { opacity: 0 }, open: { opacity: 1 } }}
                  className="absolute"
                >
                  <ShowEyes size={24} />
                </motion.div>
              </motion.div>
            </div>
          </div>
        ),
      },
    ];
  }, [selectedIds, selectedProductIds, openVoucher]);

  // 📦 Columnas de la Tabla de Selección de Productos
  const columnsProducts = useMemo(
    () => [
      {
        key: "code",
        label: "CÓDIGO",
        className: "text-center",
        render: (value) => (
          <p className="bg-[var(--brown-ligth-100)] rounded-lg border border-[var(--brown-dark-500)] text-center text-sm font-bold">
            #{value}
          </p>
        ),
      },
      {
        key: "description",
        label: "NOMBRE DEL PRODUCTO",
        className: "text-left pl-4",
      },
      {
        key: "select",
        label: "SELECCIONAR",
        className: "text-center",
        render: (_, row) => (
          <input
            type="checkbox"
            className="w-4 h-4 cursor-pointer"
            checked={selectedProductIds === row.id}
            onChange={(e) =>
              handleCheckboxChangeProduct(row.id, e.target.checked)
            }
            onClick={(e) => e.stopPropagation()}
          />
        ),
      },
    ],
    [selectedProductIds],
  );

  return (
    <div className="flex flex-col gap-6">
      {/* HEADER Y BUSCADOR */}
      <div className="flex flex-col px-6 py-4 bg-[var(--brown-ligth-100)] rounded-xl border border-[var(--brown-ligth-300)] shadow-sm">
        <span className="text-[var(--brown-dark-950)] font-bold text-lg">
          HISTORIAL DE MOVIMIENTOS
        </span>
        <p className="text-[var(--brown-dark-800)] text-sm mb-4">
          Selecciona un producto para visualizar su trazabilidad, ingresos y
          egresos de stock.
        </p>
        <div className="relative">
          <input
            type="text"
            placeholder="Escribe el nombre o código del producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-[var(--brown-ligth-400)] rounded-lg px-4 py-2.5 bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-[var(--brown-dark-500)]"
          />
        </div>
      </div>

      {/* TABLA DE PRODUCTOS (BUSCADOR) */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <GenericTable
          columns={columnsProducts}
          data={rawProducts}
          enablePagination={true}
          enableFilter={false}
          externalPagination={true}
          isLoading={isLoadingProducts}
          currentPage={pageProducts}
          totalPages={totalPagesProducts}
          onPageChange={setPageProducts}
          paginationDisabled={isLoadingProducts}
        />
      </div>

      {/* TABLA DE HISTORIAL (FACTURAS/REMITOS) */}
      {selectedProductIds && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center gap-2 px-2">
            <div className="w-2 h-6 bg-[var(--brown-dark-600)] rounded-full"></div>
            <h3 className="font-bold text-[var(--brown-dark-950)]">
              DETALLE DE MOVIMIENTOS
            </h3>
          </div>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
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
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProductHistory;
