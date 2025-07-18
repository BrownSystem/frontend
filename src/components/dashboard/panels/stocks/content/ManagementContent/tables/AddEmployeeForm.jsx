import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Message } from "../../../../../widgets";
import { useFindAllBranch } from "../../../../../../../api/branch/branch.queries";
import { useRegister } from "../../../../../../../api/auth/auth.queries";

const AddEmployeeForm = () => {
  const { data: branches, isLoading } = useFindAllBranch();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  const { mutate: registerUser, isPending } = useRegister();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "success" });

  const password = watch("password");
  const passwordConfirm = watch("passwordConfirm");
  const email = watch("email");
  const emailConfirm = watch("emailConfirm");

  const onSubmit = (data) => {
    if (password !== passwordConfirm) {
      alert("Las contraseñas no coinciden.");
      return;
    }
    if (email !== emailConfirm) {
      alert("Los correos no coinciden.");
      return;
    }

    const finalData = {
      ...data,
      name: `${data.name} ${data.lastname}`,
    };
    delete finalData.lastname;
    delete finalData.passwordConfirm;
    delete finalData.emailConfirm;

    registerUser(finalData, {
      onSuccess: () => {
        reset();
        setMessage({
          text: "Empleado creado",
          type: "success",
        });
      },
      onError: () => {
        setMessage({
          text: `Intenta nuevamente`,
          type: "error",
        });
      },
    });
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
          {/* Nombre */}
          <div>
            <label className="block text-brown-800 font-medium mb-1">
              Nombre
            </label>
            <input
              type="text"
              {...register("name", { required: "El nombre es obligatorio" })}
              className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2"
              placeholder="Juan"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Apellido */}
          <div>
            <label className="block text-brown-800 font-medium mb-1">
              Apellido
            </label>
            <input
              type="text"
              {...register("lastname", {
                required: "El apellido es obligatorio",
              })}
              className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2"
              placeholder="Pérez"
            />
            {errors.lastname && (
              <p className="text-red-500 text-sm mt-1">
                {errors.lastname.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-brown-800 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              {...register("email", {
                required: "El email es obligatorio",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "El email no es válido",
                },
              })}
              className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2"
              placeholder="usuario@correo.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Confirmar Email */}
          <div>
            <label className="block text-brown-800 font-medium mb-1">
              Confirmar Email
            </label>
            <input
              type="email"
              {...register("emailConfirm", {
                required: "Debes confirmar el email",
                validate: (value) =>
                  value === email || "Los correos no coinciden",
              })}
              className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2"
              placeholder="usuario@correo.com"
            />
            {errors.emailConfirm && (
              <p className="text-red-500 text-sm mt-1">
                {errors.emailConfirm.message}
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
                {...register("password", {
                  required: "La contraseña es obligatoria",
                  minLength: {
                    value: 6,
                    message: "La contraseña debe tener al menos 6 caracteres",
                  },
                })}
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
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirmar Contraseña */}
          <div className="relative">
            <label className="block text-brown-800 font-medium mb-1">
              Confirmar Contraseña
            </label>
            <div className="flex items-center relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("passwordConfirm", {
                  required: "Debes confirmar la contraseña",
                  validate: (value) =>
                    value === password || "Las contraseñas no coinciden",
                })}
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
            {errors.passwordConfirm && (
              <p className="text-red-500 text-sm mt-1">
                {errors.passwordConfirm.message}
              </p>
            )}
          </div>

          {/* Rol */}
          <div>
            <label className="block text-brown-800 font-medium mb-1">Rol</label>
            <select
              {...register("role", { required: "El rol es obligatorio" })}
              className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2 bg-white"
            >
              <option value="">Seleccionar rol</option>
              <option value="ADMIN">Administrador</option>
              <option value="MANAGER">Supervisor</option>
              <option value="SELLER">Vendedor</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
            )}
          </div>

          {/* Sucursal */}
          <div>
            <label className="block text-brown-800 font-medium mb-1">
              Asignar Sucursal
            </label>
            {isLoading ? (
              <p className="text-sm text-gray-600">Cargando sucursales...</p>
            ) : (
              <>
                <select
                  {...register("branchId", {
                    required: "Debes seleccionar una sucursal",
                  })}
                  className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2 bg-white"
                >
                  <option value="">Seleccionar sucursal</option>
                  {branches?.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
                {errors.branchId && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.branchId.message}
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        {/* Botón */}
        <div className="w-full text-left pt-1 flex justify-start items-center mt-5">
          <Button
            text={isPending ? "Registrando..." : "Guardar Empleado"}
            disabled={isPending}
            type={"submit"}
          />
        </div>
      </form>
    </>
  );
};

export default AddEmployeeForm;
