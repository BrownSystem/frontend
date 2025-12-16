import React from "react";
import { useForm } from "react-hook-form";
import { ClosedIcon, NotFound } from "../../../assets/icons";
import {
  Button,
  FormattedNumberInput,
  LabelInvoice,
} from "../../dashboard/widgets";
import {
  useOpenBoxDaily,
  useReopenBoxDaily,
} from "../../../api/boxDaily/boxDaily.queries";

const BoxDailyOpenModal = ({
  setMessage,
  origenSucursalSeleccionada,
  openedBy,
  branchName,
  openingAmount,
  onClose,
  boxId,
  boxNumber,
  type = "open",
}) => {
  // Inicializamos el formulario con un valor inicial en 0
  const { control, handleSubmit } = useForm({
    defaultValues: {
      saldoInicial: type === "open" ? 0 : openingAmount,
    },
  });

  // Hook de apertura de caja
  const { mutate: openBoxDaily, isLoading } = useOpenBoxDaily({
    onSuccess: () => {
      setMessage({ text: "Caja abierta con éxito", type: "success" });
      onClose?.(); // cerramos el modal al abrir la caja
    },
    onError: (error) => {
      setMessage({ text: `Error al abrir la caja: ${error}`, type: "error" });
    },
  });

  const reopenBoxDaily = useReopenBoxDaily();

  // Función que maneja el "Abrir Caja" o "Reabrir Caja"
  const onSubmit = (data) => {
    if (type === "open") {
      return openBoxDaily({
        openingAmount: data.saldoInicial,
        branchId: origenSucursalSeleccionada,
        branchName,
        openedBy,
      });
    }

    if (type === "reopen") {
      reopenBoxDaily.mutate(
        {
          id: boxId,
          openingAmount: data.saldoInicial,
          openedBy,
          branchId: origenSucursalSeleccionada,
          branchName,
        },
        {
          onSuccess: (data) => {
            if (data.status === 404) {
              setMessage({
                text: data.message,
                type: "error",
              });
              return; // ❌ Importante: corta la ejecución para no disparar el mensaje de éxito
            }

            setMessage({
              text: `Se reabrió la caja número: #${boxNumber}`,
              type: "success",
            });

            onClose?.(); // cerramos el modal al reabrir la caja
          },

          onError: () => {
            setMessage({
              text: "Error al reabrir la caja",
              type: "error",
            });
          },
        }
      );
      return;
    }
  };

  return (
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
                CAJA CERRADA{" "}
                <span className="text-[var(--brown-dark-700)]">
                  ({branchName})
                </span>
              </h1>
              <p className="text-[var(--brown-dark-800)]">
                {type === "open"
                  ? "Es necesario abrir la caja para proceder."
                  : `¿Está seguro de reabrir la caja número #${boxNumber}?`}
              </p>
            </div>
          </div>
        </div>

        {/* CONTENIDO */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-center items-center pt-5 gap-5"
        >
          {/* MONTO INICIAL */}
          <div className="relative">
            <LabelInvoice
              text={
                type === "open" ? "Saldo Inicial" : "Saldo Inicial (Anterior)"
              }
            />
            <FormattedNumberInput
              name="saldoInicial"
              control={control}
              className="border border-[var(--brown-ligth-400)] rounded px-2 py-1 text-right bg-[var(--brown-ligth-50)]"
            />
          </div>

          {/* BOTONES */}
          <div className="flex gap-1">
            <Button text={"Abrir Caja"} type="submit" />
            <Button text={"Cancelar"} onClick={onClose} type="button" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default BoxDailyOpenModal;
