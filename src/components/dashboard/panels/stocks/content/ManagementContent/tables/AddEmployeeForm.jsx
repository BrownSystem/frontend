import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../../../../widgets";
import { useFindAllBranch } from "../../../../../../../api/branch/branch.queries";
import { useRegister } from "../../../../../../../api/auth/auth.queries";
import { useMessageStore } from "../../../../../../../store/useMessage";

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
  const { setMessage } = useMessageStore();

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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto p-6 max-w-4xl bg-[var(--brown-ligth-50)] rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold text-[var(--brown-dark-800)] mb-5">
        Registrar Empleado
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nombre */}
        <div>
          <label className="block text-[var(--brown-dark-800)] font-medium mb-1">
            Nombre
          </label>
          <input
            type="text"
            {...register("name", { required: "El nombre es obligatorio" })}
            className="w-full border border-[var(--brown-ligth-200)] bg-[var(--brown-ligth-45)] rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--brown-dark-500)] transition"
            placeholder="Juan"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Apellido */}
        <div>
          <label className="block text-[var(--brown-dark-800)] font-medium mb-1">
            Apellido
          </label>
          <input
            type="text"
            {...register("lastname", {
              required: "El apellido es obligatorio",
            })}
            className="w-full border border-[var(--brown-ligth-200)] bg-[var(--brown-ligth-45)] rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--brown-dark-500)] transition"
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
          <label className="block text-[var(--brown-dark-800)] font-medium mb-1">
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
            className="w-full border border-[var(--brown-ligth-200)] bg-[var(--brown-ligth-45)] rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--brown-dark-500)] transition"
            placeholder="usuario@correo.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Confirmar Email */}
        <div>
          <label className="block text-[var(--brown-dark-800)] font-medium mb-1">
            Confirmar Email
          </label>
          <input
            type="email"
            {...register("emailConfirm", {
              required: "Debes confirmar el email",
              validate: (value) =>
                value === email || "Los correos no coinciden",
            })}
            className="w-full border border-[var(--brown-ligth-200)] bg-[var(--brown-ligth-45)] rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--brown-dark-500)] transition"
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
          <label className="block text-[var(--brown-dark-800)] font-medium mb-1">
            Contraseña
          </label>
          <div className="flex items-center relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "La contraseña es obligatoria",
                minLength: {
                  value: 4,
                  message: "Debe tener al menos 4 caracteres",
                },
              })}
              className="w-full border border-[var(--brown-ligth-200)] bg-[var(--brown-ligth-45)] rounded px-3 py-2 pr-12 focus:outline-none focus:ring-1 focus:ring-[var(--brown-dark-500)] transition"
              placeholder="********"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 text-sm text-gray-600 hover:text-[var(--brown-dark-700)] transition"
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
          <label className="block text-[var(--brown-dark-800)] font-medium mb-1">
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
              className="w-full border border-[var(--brown-ligth-200)] bg-[var(--brown-ligth-45)] rounded px-3 py-2 pr-12 focus:outline-none focus:ring-1 focus:ring-[var(--brown-dark-500)] transition"
              placeholder="********"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 text-sm text-gray-600 hover:text-[var(--brown-dark-700)] transition"
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
          <label className="block text-[var(--brown-dark-800)] font-medium mb-1">
            Rol
          </label>
          <select
            {...register("role", { required: "El rol es obligatorio" })}
            className="w-full border border-[var(--brown-ligth-200)] bg-[var(--brown-ligth-45)] rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--brown-dark-500)] transition"
          >
            <option value="">Seleccionar rol</option>
            <option value="ADMIN">Administrador</option>
            <option value="SELLER">Vendedor</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
          )}
        </div>

        {/* Sucursal */}
        <div>
          <label className="block text-[var(--brown-dark-800)] font-medium mb-1">
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
                className="w-full border border-[var(--brown-ligth-200)] bg-[var(--brown-ligth-45)] rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--brown-dark-500)] transition"
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
      <div className="w-full mt-6 flex gap-3">
        <Button
          text={isPending ? "Registrando..." : "Guardar Empleado"}
          disabled={isPending}
          type={"submit"}
          className="bg-[var(--brown-ligth-300)] hover:bg-[var(--brown-ligth-400)] text-[var(--brown-dark-800)] font-medium px-6 py-2 rounded transition"
        />
      </div>
    </form>
  );
};

export default AddEmployeeForm;
