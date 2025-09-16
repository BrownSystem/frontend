import { InvoiceIcon } from "../../../../../../assets/icons";
import { StockStatus } from "../../../../widgets";

const VoucherProducts = ({ data, icon, color }) => {
  const fields = [
    {
      label: "CÓDIGO",
      value: data?.product?.code,
    },
    {
      label: "DESCRIPCIÓN",
      value:
        data?.description?.toUpperCase() ??
        data?.product?.description?.toUpperCase() ??
        "SIN DESCRIPCIÓN",
    },
    {
      label: "STOCK",
      render:
        data?.inventory?.stock != null ? (
          <span className="flex items-center gap-1">
            <StockStatus value={data?.inventory?.stock} size={12} />
          </span>
        ) : null,
    },
    {
      label: "PRECIO",
      value:
        data?.price != null ? `$${data.price.toLocaleString("es-AR")}` : null,
    },
    {
      label: "CANTIDAD",
      value: data?.quantity != null ? `${data.quantity}` : null,
    },
    {
      label: "SUBTOTAL",
      value:
        data?.subtotal != null
          ? `$${data.subtotal.toLocaleString("es-AR")}`
          : null,
    },
  ];

  const visibleFields = fields.filter(
    (f) => (f.value !== null && f.value !== undefined) || f.render
  );

  return (
    <div
      className={`bg-[var(--brown-ligth-${
        color || 100
      })] px-6 pt-3 pb-3 rounded-xl shadow-md flex items-center gap-8 `}
    >
      <div className="bg-[var(--brown-ligth-300)] p-2 rounded-full">
        {icon || <InvoiceIcon size={24} />}
      </div>
      <div className="flex gap-4 flex-wrap">
        {visibleFields.map((f, i) => (
          <div
            key={f.label}
            className={`pr-3 ${
              i < visibleFields.length - 1
                ? "border-r-[2px] border-[var(--brown-ligth-300)] max-w-[300px] truncate-text"
                : ""
            }`}
          >
            <h3 className="text-xs font-medium text-[var(--brown-dark-700)] w-full">
              {f.label}
            </h3>

            <p className="text-sm font-bold text-[var(--brown-dark-900)] text-start">
              {f.render || f.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VoucherProducts;
