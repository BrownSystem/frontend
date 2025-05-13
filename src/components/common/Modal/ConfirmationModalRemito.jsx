import React from "react";
import { StockIcon } from "../../../assets/icons/Icon";
import { Download } from "../../../assets/icons";

const ConfirmationModalRemito = ({ onCancel, onConfirm, productos }) => {
  return (
    <div className="fixed inset-0 bg-[var(--brown-ligth-400)]/20 flex items-center justify-center z-50 ">
      <div className="bg-[#f9f9fe] rounded-2xl shadow-lg w-full max-w-lg p-6 border border-[var(--brown-ligth-200)]">
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-[var(--brown-ligth-400)] text-white p-2 rounded-lg">
              <i className="fas fa-warehouse"></i>
            </div>
            <span className="font-bold text-[var(--brown-dark-900)]">
              TRANSFERENCIA
            </span>
          </div>
          <span className="font-bold text-[var(--brown-dark-950)]">
            12/04/2025
          </span>
        </div>

        {/* Origen y destino */}
        <div className="mb-4 text-MD">
          <p className="font-semibold text-[var(--brown-dark-900)]">
            Castro Barros{" "}
            <span className="text-[var(--brown-ligth-400)]">(Córdoba)</span>
          </p>
          <p className="text-[var(--brown-dark-900)]">
            <strong>A:</strong> Depósito Jesús María{" "}
            <span className="text-[var(--brown-ligth-400)]">(Córdoba)</span>
          </p>
        </div>

        {/* Tabla de productos */}
        <table className="w-full text-left text-md mb-4">
          <thead>
            <tr className="border-b border-[#ddd]">
              <th className="py-2 text-[var(--brown-dark-900)]">Producto</th>
              <th className="py-2 text-right text-[var(--brown-dark-900)]">
                Solicitado
              </th>
              <th className="py-2 text-right text-[var(--brown-dark-900)]">
                Disponible
              </th>
              <th className="py-2 text-right text-[var(--brown-dark-900)]">
                Stock final
              </th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p, i) => (
              <tr key={i} className="border-b border-[#eee]">
                <td className="py-2">
                  <div className="font-medium text-[var(--brown-dark-900)]">
                    {p.codigo}
                  </div>
                  <div className="text-[var(--brown-ligth-400)]">
                    {p.descripcion}
                  </div>
                </td>
                <td className="py-2 text-right font-semibold text-[var(--brown-dark-900)]">
                  <p className="flex justify-center items-center gap-2">
                    {p.cantidad}
                  </p>
                </td>
                <td className="py-2 text-right font-semibold text-[var(--brown-dark-900)]">
                  <p className="flex justify-center items-center gap-2">
                    {p.cantidad}
                    <StockIcon />
                  </p>
                </td>
                <td className="py-2 text-right font-semibold text-[var(--brown-dark-900)]">
                  <p className="flex justify-center items-center gap-2">
                    {p.cantidad}
                    <StockIcon type={"low"} />
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Botones */}
        <div className="flex justify-end items-center gap-3">
          <button
            onClick={onCancel}
            className="!bg-[#1a1a1a] text-white px-4 py-2 rounded-md hover:bg-[#d9dbed]"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="!bg-[var(--brown-ligth-400)] cursor-pointer text-white px-4 py-2 rounded-md hover:bg-[var(--brown-dark-700)]"
          >
            Confirmar
          </button>
          <button
            onClick={onConfirm}
            className="!bg-[var(--brown-ligth-400)] cursor-pointer text-white px-4 py-2 rounded-md hover:bg-[var(--brown-dark-700)]"
          >
            <span>
              <Download />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModalRemito;
