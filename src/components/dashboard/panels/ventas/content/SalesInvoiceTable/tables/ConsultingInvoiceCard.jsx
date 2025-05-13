import React from "react";
import { ShowEyes } from "../../../../../../../assets/icons";

const ConsultingInvoiceCard = ({ factura, index, onShowModal }) => {
  const saldo = factura.monto - factura.montoPagado;

  return (
    <tr
      className={`grid ${
        factura.estado === "Pagada" ? "grid-cols-6" : "grid-cols-7"
      } items-center text-center px-4 py-3 ${
        index % 2 === 0 ? "bg-white" : "bg-[#f7ecd9]"
      }`}
    >
      <td>{factura.fecha}</td>
      <td>{factura.cliente}</td>
      <td>
        $
        {factura.monto.toLocaleString("es-AR", {
          minimumFractionDigits: 2,
        })}
      </td>
      <td className={"text-green-700"}>
        $
        {factura.montoPagado.toLocaleString("es-AR", {
          minimumFractionDigits: 2,
        })}
      </td>
      {factura.estado === "Pagada" ? (
        ""
      ) : (
        <span className="text-red-600">${saldo}</span>
      )}

      <td>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            factura.estado === "Pendiente"
              ? "bg-[var(--bg-state-red)] text-[var(--text-state-red)]"
              : factura.estado === "Pagada"
              ? "bg-[var(--bg-state-green)] text-[var(--text-state-green)]"
              : "bg-[var(--bg-state-yellow)] text-[var(--text-state-yellow)]"
          }`}
        >
          {factura.estado}
        </span>
      </td>
      <td
        className="flex items-center justify-center cursor-pointer"
        onClick={onShowModal}
      >
        <ShowEyes />
      </td>
    </tr>
  );
};

export default ConsultingInvoiceCard;
