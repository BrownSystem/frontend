import { useForm } from "react-hook-form";
import { Button, Message } from "../../../../../widgets";
import { createBank } from "../../../../../../../api/banks/banks.api";
import { useState } from "react";

const AddBankForm = () => {
  const { register, handleSubmit, reset } = useForm();
  const [message, setMessage] = useState({ text: "", type: "success" });

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.banco,
        branch: "", // podrías agregarlo al formulario si querés
        account: "", // idem
        cbu: data.cbu,
        alias: data.alias,
        currency: "ARS",
        isActive: true,
        accountType: data.tipoCuenta.toUpperCase(),
        bankCode: "", // podrías agregarlo al formulario si lo necesitás
        swiftCode: "", // opcional
        holderName: data.titular,
        holderDoc: data.cuitTitular,
      };

      await createBank(payload);

      setMessage({
        text: "Banco creado exitosamente.",
        type: "success",
      });

      reset();
    } catch (error) {
      setMessage({
        text: "Error al crear el banco.",
        type: "error",
      });
    }
  };

  return (
    <>
      <Message
        message={message.text}
        type={message.type}
        onClose={() => setMessage({ text: "" })}
        duration={3000}
      />
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto px-2 pt-2">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-brown-800 font-medium mb-1">
              Nombre del banco
            </label>
            <input
              type="text"
              {...register("banco", { required: true })}
              className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2"
              placeholder="Banco Nación, Santander, etc."
            />
          </div>

          <div>
            <label className="block text-brown-800 font-medium mb-1">
              Tipo de cuenta
            </label>
            <select
              {...register("tipoCuenta", { required: true })}
              className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2 bg-white"
            >
              <option value="">Seleccionar tipo</option>
              <option value="CUENTA_CORRIENTE">Cuenta Corriente</option>
              <option value="CAJA_AHORRO">Caja de Ahorro</option>
            </select>
          </div>

          <div>
            <label className="block text-brown-800 font-medium mb-1">
              Titular de la cuenta
            </label>
            <input
              type="text"
              {...register("titular", { required: true })}
              className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2"
              placeholder="Nombre completo"
            />
          </div>

          <div>
            <label className="block text-brown-800 font-medium mb-1">
              CUIT / CUIL del titular
            </label>
            <input
              type="text"
              {...register("cuitTitular")}
              className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2"
              placeholder="XX-XXXXXXXX-X"
            />
          </div>

          <div>
            <label className="block text-brown-800 font-medium mb-1">CBU</label>
            <input
              type="text"
              {...register("cbu", { required: true })}
              className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2"
              placeholder="22 dígitos"
            />
          </div>

          <div>
            <label className="block text-brown-800 font-medium mb-1">
              Alias
            </label>
            <input
              type="text"
              {...register("alias")}
              className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2"
              placeholder="alias.banco"
            />
          </div>
        </div>

        <div className="text-left pt-2">
          <Button text={"Guardar Banco"} type={"submit"} />
        </div>
      </form>
    </>
  );
};

export default AddBankForm;
