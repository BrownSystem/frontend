import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../../../../widgets";

const AddBankForm = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log("Nuevo banco:", data);
    // Aquí podrías enviar los datos a tu API
  };

  return (
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
            <option value="caja_ahorro">Caja de Ahorro</option>
            <option value="cuenta_corriente">Cuenta Corriente</option>
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
          <label className="block text-brown-800 font-medium mb-1">Alias</label>
          <input
            type="text"
            {...register("alias")}
            className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2"
            placeholder="alias.banco"
          />
        </div>
      </div>

      <div className="pt-2">
        <label className="block text-brown-800 font-medium mb-1">
          Observaciones
        </label>
        <textarea
          {...register("observaciones")}
          rows={2}
          className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2 resize-none"
          placeholder="Datos adicionales o notas internas"
        />
      </div>

      <div className="text-left pt-2">
        <Button text={"Guardar Banco"} />
      </div>
    </form>
  );
};

export default AddBankForm;
