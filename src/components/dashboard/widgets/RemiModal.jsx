import React from "react";
import { StockIcon } from "../../../assets/icons/Icon";

const RemitoModal = ({ onCancel, onConfirm, productos }) => {
  return (
    <div className="fixed inset-0 bg-[var(--brown-ligth-400)]/20 flex items-center justify-center z-50">
      <div className="bg-[#fefcf9] rounded-2xl shadow-lg w-full max-w-md p-6 border border-[#e0d2bb]">
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-[#b68239] text-white p-2 rounded-lg">
              <i className="fas fa-warehouse"></i>
            </div>
            <span className="font-bold text-[#5b3e0f]">TRANSFERENCIA</span>
          </div>
          <span className="font-bold text-[#3a2b19]">12/04/2025</span>
        </div>

        {/* Origen y destino */}
        <div className="mb-4 text-MD">
          <p className="font-semibold text-[#3a2b19]">
            Castro Barros <span className="text-[#c49653]">(Córdoba)</span>
          </p>
          <p className="text-[#3a2b19]">
            <strong>A:</strong> Depósito Jesús María{" "}
            <span className="text-[#c49653]">(Córdoba)</span>
          </p>
        </div>

        {/* Tabla de productos */}
        <table className="w-full text-left text-md mb-4">
          <thead>
            <tr className="border-b border-[#ddd]">
              <th className="py-2 text-[#3a2b19]">Producto</th>
              <th className="py-2 text-right text-[#3a2b19]">Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p, i) => (
              <tr key={i} className="border-b border-[#eee]">
                <td className="py-2">
                  <div className="font-medium text-[#3a2b19]">{p.codigo}</div>
                  <div className="text-[#6d5b3e]">{p.descripcion}</div>
                </td>
                <td className="py-2 text-right font-semibold text-[#3a2b19]">
                  <p className="flex justify-center items-center gap-2">
                    {p.cantidad}
                    <StockIcon />
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Botones */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="!bg-[#1a1a1a] text-white px-4 py-2 rounded-md hover:bg-[#ede5d9]"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="!bg-[#b68239] text-white px-4 py-2 rounded-md !hover:bg-[#a46f2f]"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemitoModal;
