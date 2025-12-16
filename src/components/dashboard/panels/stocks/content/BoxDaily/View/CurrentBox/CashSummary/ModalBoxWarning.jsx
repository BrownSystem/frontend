import React from "react";
import { Danger, Warning } from "../../../../../../../../../assets/icons";

const ModalBoxWarning = ({ text, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-[var(--brown-dark-900)]/40 w-full z-[99999999999999]">
      <div className="w-[350px] rounded-md bg-[var(--brown-ligth-100)] p-5 text-center shadow-lg">
        <div className="flex flex-col items-center gap-4">
          <span className="bg-[var(--brown-ligth-400)] rounded-full w-[60px] h-[60px] flex justify-center items-center">
            <Warning color={"var(--brown-dark-800)"} size={35} />
          </span>
          <h1 className="font-semibold text-[var(--brown-dark-900)] text-lg">
            Advertencia
          </h1>
          <p className="text-[var(--brown-dark-800)]">{text}</p>

          <div className="flex justify-center gap-3 mt-4">
            <button
              onClick={onConfirm}
              className="bg-[var(--brown-dark-800)] text-white px-4 py-2 rounded-md hover:bg-[var(--brown-dark-700)]"
            >
              Confirmar
            </button>
            <button
              onClick={onCancel}
              className="bg-[var(--brown-ligth-300)] px-4 py-2 rounded-md hover:bg-[var(--brown-ligth-400)]"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalBoxWarning;
