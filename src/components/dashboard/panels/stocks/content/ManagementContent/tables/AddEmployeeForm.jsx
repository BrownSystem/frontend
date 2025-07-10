import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../../../../widgets";
import { Danger } from "../../../../../../../assets/icons";
import { useFindAllBranch } from "../../../../../../../api/branch/branch.queries";
import { useRegister } from "../../../../../../../api/auth/auth.queries";

const AddEmployeeForm = () => {
  const { data: branches, isLoading } = useFindAllBranch();
  const { register, handleSubmit, reset } = useForm();
  const { mutate: registerUser, isPending } = useRegister();

  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [password, setPassword] = useState("");
  const [emailConfirm, setEmailConfirm] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = (data) => {
    if (data.password !== passwordConfirm) {
      alert("Las contraseñas no coinciden.");
      return;
    }
    if (data.email !== emailConfirm) {
      alert("Los correos no coinciden.");
      return;
    }

    const finalData = {
      ...data,
      name: `${data.name} ${data.lastname}`,
    };
    delete finalData.lastname;

    registerUser(finalData, {
      onSuccess: () => {
        alert("Empleado registrado correctamente 🎉");
        reset();
        setPasswordConfirm("");
        setPassword("");
        setEmail("");
        setEmailConfirm("");
      },
      onError: () => {
        alert("Hubo un error al registrar el empleado ❌");
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto px-2 pt-2">
      <div className="grid grid-cols-2 gap-4">
        {/* Nombre */}
        <div>
          <label className="block text-brown-800 font-medium mb-1">
            Nombre
          </label>
          <input
            type="text"
            {...register("name", { required: true })}
            className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2"
            placeholder="Juan"
          />
        </div>

        {/* Apellido */}
        <div>
          <label className="block text-brown-800 font-medium mb-1">
            Apellido
          </label>
          <input
            type="text"
            {...register("lastname", { required: true })}
            className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2"
            placeholder="Pérez"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-brown-800 font-medium mb-1">Email</label>
          <input
            type="email"
            {...register("email", { required: true })}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2"
            placeholder="usuario@correo.com"
          />
        </div>

        {/* Confirmar Email */}
        <div className="relative">
          <label className="block text-brown-800 font-medium mb-1">
            Confirmar Email
          </label>
          <input
            type="email"
            onChange={(e) => setEmailConfirm(e.target.value)}
            className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2"
            placeholder="usuario@correo.com"
          />
          {email !== emailConfirm && (
            <p className="text-red-500 text-sm mt-1">
              Los correos no coinciden
            </p>
          )}
        </div>

        {/* Contraseña */}
        <div className="relative">
          <label className="block text-brown-800 font-medium mb-1">
            Contraseña
          </label>
          <div className="flex items-center relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", { required: true })}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2 pr-10"
              placeholder="********"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 text-sm text-gray-600"
            >
              {showPassword ? "Ocultar" : "Ver"}
            </button>
          </div>
          {password !== passwordConfirm && (
            <p className="text-red-500 text-sm mt-1">
              Las contraseñas no coinciden
            </p>
          )}
        </div>

        {/* Confirmar contraseña */}
        <div className="relative">
          <label className="block text-brown-800 font-medium mb-1">
            Confirmar Contraseña
          </label>
          <div className="flex items-center relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2 pr-10"
              placeholder="********"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 text-sm text-gray-600"
            >
              {showConfirmPassword ? "Ocultar" : "Ver"}
            </button>
          </div>
        </div>

        {/* Rol */}
        <div>
          <label className="block text-brown-800 font-medium mb-1">Rol</label>
          <select
            {...register("role", { required: true })}
            className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2 bg-white"
          >
            <option value="">Seleccionar rol</option>
            <option value="ADMIN">Administrador</option>
            <option value="MANAGEMENT">Supervisor</option>
            <option value="SELLER">Vendedor</option>
          </select>
        </div>

        {/* Sucursal */}
        <div>
          <label className="block text-brown-800 font-medium mb-1">
            Asignar Sucursal
          </label>
          {isLoading ? (
            <p className="text-sm text-gray-600">Cargando sucursales...</p>
          ) : (
            <select
              {...register("branchId", { required: true })}
              className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2 bg-white"
            >
              <option value="">Seleccionar sucursal</option>
              {branches?.map((branch) => (
                <option key={branch._id} value={branch._id}>
                  {branch.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Botón */}
      <div className="w-full text-left pt-1 flex justify-start items-center mt-5">
        <Button
          text={isPending ? "Registrando..." : "Guardar Empleado"}
          disabled={isPending}
        />
      </div>
    </form>
  );
};

export default AddEmployeeForm;
