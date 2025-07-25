import React, { useState } from "react";
import { Delete, Edit } from "../../../../../../../assets/icons";
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
            <Delete color="#cc0000" />
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
          className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center z-20 bg-black/20"
          onClick={() => setSelectedUser(null)}
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            onClick={(e) => e.stopPropagation()}
            className="grid grid-cols-2 gap-4 pt-2 bg-white shadow-md rounded-md p-4 w-full max-w-xl"
          >
            <div className="col-span-2">
              <h3 className="text-lg font-semibold mb-2 text-center">
                Editar Usuario: {selectedUser.name}
              </h3>
            </div>

            <div>
              <label className="text-sm font-semibold">Nombre completo</label>
              <input
                type="text"
                {...register("name", { required: true })}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Email</label>
              <input
                type="email"
                {...register("email", { required: true })}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Rol</label>
              <select
                {...register("role")}
                className="w-full border rounded px-3 py-2"
              >
                <option value="ADMIN">Administrador</option>
                <option value="MANAGER">Supervisor</option>
                <option value="SELLER">Vendedor</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold">Sucursal</label>
              <select
                {...register("branchId")}
                className="w-full border rounded px-3 py-2"
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
              <label className="text-sm font-semibold">Nueva contraseña</label>
              <input
                type="password"
                {...register("password", {
                  minLength: {
                    value: 4,
                    message: "La contraseña debe tener al menos 4 caracteres",
                  },
                })}
                className="w-full border rounded px-3 py-2"
                placeholder="********"
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-semibold">
                Confirmar contraseña
              </label>
              <input
                type="password"
                {...register("passwordConfirm")}
                className="w-full border rounded px-3 py-2"
                placeholder="********"
              />
              {password !== passwordConfirm && password && (
                <p className="text-sm text-red-500 mt-1">
                  Las contraseñas no coinciden
                </p>
              )}
            </div>

            <div className="col-span-2 flex justify-center mt-4 gap-4">
              <Button text="Actualizar Usuario" />
              <Button text="Cancelar" onClick={() => setSelectedUser(null)} />
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default EmployeeTable;
