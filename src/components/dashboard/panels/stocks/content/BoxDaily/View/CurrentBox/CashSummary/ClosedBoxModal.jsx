import { useState, useMemo } from "react";
import { useClosedBoxDaily } from "../../../../../../../../../api/boxDaily/boxDaily.queries";
import {
  Button,
  FormattedNumberInput,
  LabelInvoice,
} from "../../../../../../../widgets";
import { ClosedIcon } from "../../../../../../../../../assets/icons";
import { useForm } from "react-hook-form";
import { BoxDailyOpenModal } from "../../../../../../../../common";
import { useMessageStore } from "../../../../../../../../../store/useMessage";
import ModalBoxWarning from "./ModalBoxWarning";

const ClosedBoxModal = ({
  showClosedBoxDaily,
  setShowClosedBoxDaily,
  closedBy,
  flujoCaja,
  id,
  branchId,
  branchName,
  estado,
  selectedBranchName,
  selectedBranchId,
}) => {
  const [boxWarning, setBoxWarning] = useState(false);
  const [text, setText] = useState("");
  const [pendingData, setPendingData] = useState(null); // ⬅️ para guardar los datos antes del warning
  const { setMessage } = useMessageStore();
  const closedBoxDaily = useClosedBoxDaily();

  // react-hook-form
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    defaultValues: { closingAmount: 0 },
  });

  const closingAmount = watch("closingAmount") || 0;

  // Diferencia calculada
  const realAmount = useMemo(
    () => flujoCaja - Number(closingAmount),
    [flujoCaja, closingAmount]
  );

  // 🧩 Función que realmente cierra la caja
  const handleCloseBox = (data) => {
    const closingValue = Number(data.closingAmount);

    closedBoxDaily.mutate(
      {
        id,
        realAmount,
        closingAmount: closingValue,
        closedBy,
        branchId,
        branchName,
      },
      {
        onSuccess: () => {
          setMessage({
            text: `Caja cerrada correctamente por: ${closedBy}`,
            type: "success",
          });
          reset();
          setTimeout(() => setShowClosedBoxDaily(false), 1000);
        },
        onError: () => {
          setMessage({
            text: "Error al cerrar la caja",
            type: "error",
          });
        },
      }
    );
  };

  // 🧩 Cuando se envía el formulario
  const onSubmit = (data) => {
    const closingValue = Number(data.closingAmount);

    if (!closingValue) {
      setText("Debe ingresar el saldo final antes de cerrar la caja.");
      setBoxWarning(true);
      return;
    }

    if (realAmount !== 0) {
      const diferencia = Math.abs(realAmount).toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
      });
      const tipo = realAmount < 0 ? "sobrante" : "faltante";

      setText(
        `Su caja no está cerrando. Hay un ${tipo} de ${diferencia}. ¿Desea realmente cerrar con esta diferencia?`
      );
      setPendingData(data); // ⬅️ guardamos los datos del form
      setBoxWarning(true);
      return;
    }

    // Si no hay diferencia, cerramos directamente
    handleCloseBox(data);
  };

  // 🧩 Cuando el usuario confirma el warning
  const handleConfirmWarning = () => {
    if (pendingData) {
      handleCloseBox(pendingData);
      setPendingData(null);
    }
    setBoxWarning(false);
  };

  return (
    <>
      {boxWarning && (
        <ModalBoxWarning
          text={text}
          onConfirm={handleConfirmWarning}
          onCancel={() => setBoxWarning(false)}
        />
      )}

      {showClosedBoxDaily && estado === "OPEN" && (
        <div className="fixed inset-0 flex justify-center items-center bg-[var(--brown-dark-900)]/40 w-full z-[999999999]">
          <div className="w-[500px] pb-10 rounded-md bg-[var(--brown-ligth-100)] max-h-full">
            {/* HEADER */}
            <div className="flex justify-between px-6 pb-3 pt-6 border-b-[1px] pr-5 border-[var(--brown-ligth-200)] rounded-t-md">
              <div className="flex gap-6 items-center">
                <span className="bg-[var(--brown-ligth-400)] rounded-full w-[50px] h-[50px] flex justify-center items-center">
                  <ClosedIcon size={35} />
                </span>
                <div>
                  <h1 className="font-semibold text-[var(--brown-dark-900)] text-lg">
                    CERRAR CAJA
                  </h1>
                  <p className="text-[var(--brown-dark-800)]">
                    Completa los datos
                  </p>
                </div>
              </div>
            </div>

            {/* FORMULARIO */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col justify-center items-center pt-5 gap-5"
            >
              <div className="w-full px-10 flex flex-col gap-2">
                {/* Saldo final */}
                <div className="flex w-full flex-col bg-[var(--brown-ligth-200)] p-3 rounded-md">
                  <LabelInvoice text="Introduzca el saldo de caja final" />
                  <FormattedNumberInput
                    name="closingAmount"
                    control={control}
                    rules={{
                      required: "El saldo final es obligatorio",
                    }}
                    className="border border-[var(--brown-ligth-400)] rounded px-2 py-1 text-right bg-[var(--brown-ligth-50)]"
                  />
                  {errors.closingAmount && (
                    <span className="text-red-600 text-sm mt-1">
                      {errors.closingAmount.message}
                    </span>
                  )}
                </div>

                {/* Diferencia */}
                <div className="flex w-full flex-col bg-[var(--brown-ligth-200)] p-3 rounded-md">
                  <LabelInvoice text="Diferencia" />
                  <input
                    type="text"
                    disabled
                    value={flujoCaja.toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                    className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2 bg-[var(--brown-ligth-50)]"
                  />
                </div>
              </div>

              {/* BOTONES */}
              <div className="flex gap-2">
                <Button text="Cerrar Caja" type="submit" />
                <Button
                  text="Cancelar"
                  onClick={() => setShowClosedBoxDaily(false)}
                  type="button"
                />
              </div>
            </form>
          </div>
        </div>
      )}

      {showClosedBoxDaily && estado !== "OPEN" && (
        <BoxDailyOpenModal
          setShowModalBoxDaily={setShowClosedBoxDaily}
          setMessage={setMessage}
          openedBy={closedBy}
          origenSucursalSeleccionada={selectedBranchId}
          branchName={selectedBranchName}
          onClose={() => setShowClosedBoxDaily(false)}
        />
      )}
    </>
  );
};

export default ClosedBoxModal;
