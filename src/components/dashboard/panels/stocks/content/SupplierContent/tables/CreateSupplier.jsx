import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../../../../widgets";

const CreateSupplier = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log("Nuevo proveedor:", data);
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto px-2 overflow-y-hidden h-[290px]"
    >
      {/* Inputs */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-brown-800 font-medium mb-1">
            Codigo
          </label>
          <input
            type="text"
            {...register("nombre")}
            className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2"
            placeholder="00034"
          />
        </div>
        <div>
          <label className="block text-brown-800 font-medium mb-1">
            Nombre
          </label>
          <input
            type="text"
            {...register("nombre")}
            className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2"
            placeholder="Nombre del proveedor"
          />
        </div>
        <div>
          <label className="block text-brown-800 font-medium mb-1">
            CUIT / CUIL
          </label>
          <input
            type="text"
            {...register("cuit")}
            className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2"
            placeholder="XX-XXXXXXXX-X"
          />
        </div>
        <div>
          <label className="block text-brown-800 font-medium mb-1">
            Teléfono
          </label>
          <input
            type="text"
            {...register("telefono")}
            className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2"
            placeholder="Ej: 1123456789"
          />
        </div>
        <div>
          <label className="block text-brown-800 font-medium mb-1">Email</label>
          <input
            type="email"
            {...register("email")}
            className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2"
            placeholder="proveedor@mail.com"
          />
        </div>
        <div>
          <label className="block text-brown-800 font-medium mb-1">
            Dirección
          </label>
          <input
            type="text"
            {...register("direccion")}
            className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2"
            placeholder="Calle, Número, Ciudad"
          />
        </div>
      </div>

      {/* Botón Guardar */}
      <div className="text-left pt-1">
        <Button text={"Guardar Proveedor"} />
      </div>
    </form>
  );
};

export default CreateSupplier;
