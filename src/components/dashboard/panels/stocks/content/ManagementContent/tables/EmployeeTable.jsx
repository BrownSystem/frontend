import React, { useState } from "react";
import { Delete, Edit, Lock } from "../../../../../../../assets/icons";
import { GenericTable, Button, Message } from "../../../../../widgets";
import {
  useGetAllUsers,
  useUpdateUser,
} from "../../../../../../../api/auth/auth.queries";
import { useFindAllBranch } from "../../../../../../../api/branch/branch.queries";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../../../../../../../api/auth/auth.store";

const EmployeeTable = () => {
  const currentUser = useAuthStore((state) => state.user);
  const { data: users = [], isLoading } = useGetAllUsers(currentUser?.branchId);
  const { data: branches = [] } = useFindAllBranch();
  const { mutate: updateUser } = useUpdateUser();

  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "success" });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm();

  const password = watch("password");
  const passwordConfirm = watch("passwordConfirm");

  const handleEdit = (user) => {
    setSelectedUser(user);
    reset({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      branchId: user.branchId,
      password: "",
      passwordConfirm: "",
    });
  };

  const handleDelete = (user) => {
    const confirm = window.confirm(`¿Desactivar a ${user.name}?`);
    if (confirm) {
      updateUser({ id: user.id, available: false });
    }
  };

  const onSubmit = (formData) => {
    const { passwordConfirm, ...data } = formData;

    if (data.password && data.password !== passwordConfirm) {
      setMessage({
        text: "Las contraseñas no coinciden",
        type: "error",
      });
      return;
    }

    if (!data.password) delete data.password;

    if (!selectedUser?.id) {
      setMessage({
        text: "Error interno: ID del usuario no encontrado",
        type: "error",
      });
      return;
    }

    updateUser(
      { ...data, id: selectedUser.id },
      {
        onSuccess: () => {
          setMessage({
            text: "Empleado actualizado",
            type: "success",
          });
          setSelectedUser(null);
        },
      }
    );
  };

  const columns = [
    { key: "name", label: "NOMBRE", render: (_, row) => row.name },
    { key: "email", label: "EMAIL" },
    {
      key: "role",
      label: "ROL",
      render: (_, row) => (row.role === "ADMIN" ? "Administrador" : "Vendedor"),
    },
    {
      key: "branch",
      label: "SUCURSAL",
      render: (_, row) => {
        const branch = branches.find((b) => b.id === row.branchId);
        return branch ? branch.name : "Sin asignar";
      },
    },
    {
      key: "accion",
      label: "ACCIONES",
      render: (_, row) => (
        <div className="w-full flex justify-center gap-3">
          <button onClick={() => handleEdit(row)} title="Editar">
            <Edit color="#3a3835" />
          </button>
          <button onClick={() => handleDelete(row)} title="Desactivar">
            <Delete color="#3a3835" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full h-full overflow-x-auto mt-3">
      <Message
        message={message.text}
        type={message.type}
        onClose={() => setMessage({ text: "" })}
        duration={3000}
      />
      <div className="flex justify-center items-center w-full px-4 mb-2">
        <h2 className="text-2xl font-semibold text-[#2c2b2a]">
          USUARIOS REGISTRADOS
        </h2>
      </div>

      <GenericTable
        columns={columns}
        data={users}
        enableFilter={true}
        enablePagination={true}
        loading={isLoading}
      />

      {/* Modal de edición */}
      {selectedUser && (
        <div
          className="fixed inset-0 flex justify-center items-center z-20 bg-[var(--brown-dark-950)]/40"
          onClick={() => setSelectedUser(null)}
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            onClick={(e) => e.stopPropagation()}
            className="grid grid-cols-2 gap-4 pt-4 bg-[var(--brown-ligth-50)] shadow-lg rounded-2xl p-6 w-full max-w-xl border border-[var(--brown-ligth-200)] font-outfit"
          >
            {/* Title */}
            <div className="col-span-2">
              <h3 className="text-lg font-semibold mb-4 text-center text-[var(--brown-dark-900)]">
                Editar Usuario: {selectedUser.name}
              </h3>
            </div>

            {/* Nombre */}
            <div>
              <label className="text-sm font-semibold text-[var(--brown-dark-700)]">
                Nombre completo
              </label>
              <input
                type="text"
                {...register("name", { required: true })}
                className="w-full border border-[var(--brown-ligth-200)] rounded-md px-3 py-2 bg-[var(--brown-ligth-100)] text-[var(--brown-dark-900)] focus:outline-none focus:ring-2 focus:ring-[var(--brown-ligth-300)]"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-semibold text-[var(--brown-dark-700)]">
                Email
              </label>
              <input
                type="email"
                {...register("email", { required: true })}
                className="w-full border border-[var(--brown-ligth-200)] rounded-md px-3 py-2 bg-[var(--brown-ligth-100)] text-[var(--brown-dark-900)] focus:outline-none focus:ring-2 focus:ring-[var(--brown-ligth-300)]"
              />
            </div>

            {/* Rol */}
            <div>
              <label className="text-sm font-semibold text-[var(--brown-dark-700)]">
                Rol
              </label>
              <select
                {...register("role")}
                className="w-full border border-[var(--brown-ligth-200)] rounded-md px-3 py-2 bg-[var(--brown-ligth-100)] text-[var(--brown-dark-900)] focus:outline-none focus:ring-2 focus:ring-[var(--brown-ligth-300)]"
              >
                <option value="ADMIN">Administrador</option>
                <option value="SELLER">Vendedor</option>
              </select>
            </div>

            {/* Sucursal */}
            <div>
              <label className="text-sm font-semibold text-[var(--brown-dark-700)]">
                Sucursal
              </label>
              <select
                {...register("branchId")}
                className="w-full border border-[var(--brown-ligth-200)] rounded-md px-3 py-2 bg-[var(--brown-ligth-100)] text-[var(--brown-dark-900)] focus:outline-none focus:ring-2 focus:ring-[var(--brown-ligth-300)]"
              >
                <option value="">Sin asignar</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Contraseña */}
            <div>
              <label className="text-sm font-semibold text-[var(--brown-dark-700)]">
                Nueva contraseña
              </label>
              <input
                type="password"
                {...register("password", {
                  minLength: {
                    value: 4,
                    message: "La contraseña debe tener al menos 4 caracteres",
                  },
                })}
                className="w-full border border-[var(--brown-ligth-200)] rounded-md px-3 py-2 bg-[var(--brown-ligth-100)] text-[var(--brown-dark-900)] focus:outline-none focus:ring-2 focus:ring-[var(--brown-ligth-300)]"
                placeholder="********"
              />
              {errors.password && (
                <p className="text-sm text-[var(--text-state-red)] mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirmar contraseña */}
            <div>
              <label className="text-sm font-semibold text-[var(--brown-dark-700)]">
                Confirmar contraseña
              </label>
              <input
                type="password"
                {...register("passwordConfirm")}
                className="w-full border border-[var(--brown-ligth-200)] rounded-md px-3 py-2 bg-[var(--brown-ligth-100)] text-[var(--brown-dark-900)] focus:outline-none focus:ring-2 focus:ring-[var(--brown-ligth-300)]"
                placeholder="********"
              />
              {password !== passwordConfirm && password && (
                <p className="text-sm text-[var(--text-state-red)] mt-1">
                  Las contraseñas no coinciden
                </p>
              )}
            </div>

            {/* Botones */}
            <div className="col-span-2 flex justify-center mt-4 gap-4">
              <button
                type="submit"
                className="bg-[var(--brown-dark-700)] text-white px-4 py-2 rounded-md hover:bg-[var(--brown-dark-800)] transition"
              >
                Actualizar Usuario
              </button>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="bg-[var(--brown-ligth-200)] text-[var(--brown-dark-900)] px-4 py-2 rounded-md hover:bg-[var(--brown-ligth-300)] transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default EmployeeTable;
