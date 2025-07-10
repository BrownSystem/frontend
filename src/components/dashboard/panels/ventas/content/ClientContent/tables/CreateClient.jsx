import React from "react";
import { useForm } from "react-hook-form";

const CreateClient = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log("Nuevo cliente:", data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto px-2 mt-2 max-h-auto"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-brown-800 font-medium mb-1">
            Código
          </label>
          <input
            type="text"
            {...register("codigo")}
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
            placeholder="Nombre del cliente"
          />
        </div>
        <div>
          <label className="block text-brown-800 font-medium mb-1">
            Razon Social
          </label>
          <input
            type="text"
            {...register("nombre")}
            className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2"
            placeholder="Razon social del cliente"
          />
        </div>
        <div>
          <label className="block text-brown-800 font-medium mb-1">
            Condición frente al IVA
          </label>
          <select
            {...register("condicionIva")}
            className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2 bg-white"
          >
            <option value="">Seleccione una opción</option>
            <option value="responsable_inscripto">Responsable Inscripto</option>
            <option value="monotributista">Monotributista</option>
            <option value="exento">Exento</option>
            <option value="consumidor_final">Consumidor Final</option>
          </select>
        </div>
        <div>
          <label className="block text-brown-800 font-medium mb-1">
            CUIT / CUIL / DNI
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
            placeholder="cliente@mail.com"
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
        {/* Botón Guardar */}
      </div>
      <div className="text-center mt-7 ">
        <button
          type="submit"
          className="bg-[var(--brown-ligth-100)] w-full cursor-pointer border-[1px] border-[var(--brown-ligth-400)] text-[var(--brown-dark-950)] px-6 py-2 rounded hover:bg-[var(--brown-ligth-200)]"
        >
          Guardar Cliente
        </button>
      </div>
    </form>
  );
};

export default CreateClient;
