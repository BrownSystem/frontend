import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../../../../widgets";
import { Danger } from "../../../../../../../assets/icons";

const AddEmployeeForm = () => {
  const { register, handleSubmit } = useForm();
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (data) => {
    console.log("Nuevo empleado:", data);
    // Aquí podrías hacer un fetch/post a tu backend
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto px-2 pt-2">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-brown-800 font-medium mb-1">
            Nombre
          </label>
          <input
            type="text"
            {...register("nombre", { required: true })}
            className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2"
            placeholder="Juan Pérez"
          />
        </div>

        <div>
          <label className="block text-brown-800 font-medium mb-1">DNI</label>
          <input
            type="text"
            {...register("dni", { required: true })}
            className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2"
            placeholder="Ej: 30123456"
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
            placeholder="usuario@correo.com"
          />
        </div>

        <div className="relative">
          <label className="block text-brown-800 font-medium mb-1">
            Contraseña
          </label>
          <input
            type="password"
            {...register("password", { required: true })}
            className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
          />

          {password !== passwordConfirm && (
            <p className="absolute top-8 right-8 text-sm mt-1">
              {" "}
              <Danger color="#FF0000" size={1} />{" "}
            </p>
          )}

          {password !== passwordConfirm && (
            <p className="text-red-500 text-sm mt-1">
              Las contraseñas no coinciden
            </p>
          )}
        </div>

        <div className="relative">
          <label className="block text-brown-800 font-medium mb-1">
            Confirmar Contraseña
          </label>
          <input
            type="password"
            className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2"
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder="********"
          />

          {password !== passwordConfirm && (
            <p className="absolute top-8 right-8 text-sm mt-1">
              {" "}
              <Danger color="#FF0000" size={1} />{" "}
            </p>
          )}

          {password !== passwordConfirm && (
            <p className="text-red-500 text-sm mt-1">
              Las contraseñas no coinciden
            </p>
          )}
        </div>

        <div>
          <label className="block text-brown-800 font-medium mb-1">Rol</label>
          <select
            {...register("rol", { required: true })}
            className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2 bg-white"
          >
            <option value="">Seleccionar rol</option>
            <option value="administrador">Administrador</option>
            <option value="supervisor">Supervisor</option>
            <option value="vendedor">Vendedor</option>
          </select>
        </div>
        <div className="text-left pt-1 flex justify-start items-center mt-5">
          <Button text={"Guardar Empleado"} />
        </div>
      </div>
    </form>
  );
};

export default AddEmployeeForm;
