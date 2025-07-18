import { useForm } from "react-hook-form";
import { useEffect } from "react";
import Button from "../../dashboard/widgets/Button";
import { Delete } from "../../../assets/icons";
import { useBanks } from "../../../api/banks/banks.queries";

const RegisterPaymentModal = ({
  isOpen,
  onClose,
  onRegister,
  payments = [],
  hasProducts,
}) => {
  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      method: "TRANSFERENCIA",
      amount: 0,
      currency: "ARS",
      exchangeRate: null,
      receivedAt: new Date().toISOString().slice(0, 16),
      receivedBy: "",
      bankId: "",
      chequeNumber: "",
      chequeDueDate: "",
      chequeStatus: "PENDIENTE",
    },
  });

  const selectedMethod = watch("method");

  const handleDeletePayment = (indexToDelete) => {
    const updatedPayments = payments.filter((_, i) => i !== indexToDelete);
    onRegister(updatedPayments); // reutilizamos onRegister para actualizar
  };

  const { data: banks, isLoading } = useBanks();

  useEffect(() => {
    if (isOpen) reset(); // Limpia el formulario cuando se abre
  }, [isOpen, reset]);

  if (!isOpen) return null;

  const onSubmit = (data) => {
    if (!hasProducts) {
      alert("Debe ingresar al menos un producto antes de registrar un pago.");
      return;
    }

    onRegister(data);
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="bg-white w-full max-w-2xl rounded-lg p-6 shadow-lg relative max-h-[90vh] overflow-auto">
        <h2 className="text-xl font-semibold text-brown-800 mb-4">
          Registrar Pago
        </h2>

        {/* Formulario de pago */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-4 mb-6"
        >
          <div>
            <label className="block font-medium">Método</label>
            <select
              {...register("method")}
              className="w-full border px-2 py-1 rounded"
            >
              <option value="TRANSFERENCIA">Transferencia</option>
              <option value="EFECTIVO">Efectivo</option>
              <option value="TARJETA">Tarjeta</option>
              <option value="CHEQUE">Cheque</option>
            </select>
          </div>

          <div>
            <label className="block font-medium">Monto</label>
            <input
              type="number"
              step="0.01"
              {...register("amount")}
              className="w-full border px-2 py-1 rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Moneda</label>
            <select
              {...register("currency")}
              className="w-full border px-2 py-1 rounded"
            >
              <option value="ARS">ARS</option>
              <option value="USD">USD</option>
            </select>
          </div>

          <div>
            <label className="block font-medium">Tipo de cambio</label>
            <input
              type="number"
              step="0.0001"
              {...register("exchangeRate")}
              className="w-full border px-2 py-1 rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Fecha de recepción</label>
            <input
              type="datetime-local"
              {...register("receivedAt")}
              className="w-full border px-2 py-1 rounded"
            />
          </div>

          {/* Condicional: Transferencia o Cheque → Banco */}
          {(selectedMethod === "TRANSFERENCIA" ||
            selectedMethod === "CHEQUE") && (
            <div className="col-span-2">
              <label className="block font-medium">Banco</label>
              <select
                {...register("bankId")}
                className="w-full border px-2 py-1 rounded bg-white"
                disabled={isLoading}
              >
                <option value="">Seleccionar banco</option>
                {banks?.map((banco) => (
                  <option key={banco.id} value={banco.id}>
                    {banco.name} - {banco.branch}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Condicional: Cheque */}
          {selectedMethod === "CHEQUE" && (
            <>
              <div>
                <label className="block font-medium">Número de cheque</label>
                <input
                  type="text"
                  {...register("chequeNumber")}
                  className="w-full border px-2 py-1 rounded"
                />
              </div>

              <div>
                <label className="block font-medium">Vencimiento cheque</label>
                <input
                  type="date"
                  {...register("chequeDueDate")}
                  className="w-full border px-2 py-1 rounded"
                />
              </div>

              <div className="col-span-2">
                <label className="block font-medium">Estado del cheque</label>
                <select
                  {...register("chequeStatus")}
                  className="w-full border px-2 py-1 rounded"
                >
                  <option value="PENDIENTE">PENDIENTE</option>
                  <option value="RECHAZADO">RECHAZADO</option>
                  <option value="COMPENSADO">COMPENSADO</option>
                </select>
              </div>
            </>
          )}
        </form>

        {/* Lista de pagos existentes */}
        {payments.length > 0 && (
          <div className="mb-6">
            <h3 className="text-md font-semibold text-brown-800 mb-2">
              Pagos Registrados
            </h3>
            <ul className="divide-y border rounded text-sm">
              {payments.map((pago, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center p-2 hover:bg-gray-50"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {pago.method} - ${pago.amount} {pago.currency}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {new Date(pago.receivedAt).toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeletePayment(index)}
                    className="ml-4 hover:text-red-600"
                    title="Eliminar pago"
                  >
                    <Delete size={18} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Acciones */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancelar
          </button>
          <Button
            text={"Registrar"}
            type="submit"
            onClick={handleSubmit(onSubmit)}
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterPaymentModal;
