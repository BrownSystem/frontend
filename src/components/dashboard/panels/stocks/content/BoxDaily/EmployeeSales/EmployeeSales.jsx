import { useState } from "react";
import { useAuthStore } from "../../../../../../../api/auth/auth.store";
import { ArrowDown, ProfileMan } from "../../../../../../../assets/icons";
import { useGetAllUsers } from "../../../../../../../api/auth/auth.queries";
import { useSearchContacts } from "../../../../../../../api/contacts/contacts.queries";

const EmployeeSales = ({ branchId, type }) => {
  const currentUser = useAuthStore((state) => state.user);

  // 👉 Usuarios (empleados)
  const { data: usersData, isLoading: loadingUsers } = useGetAllUsers(branchId);
  const users = Array.isArray(usersData) ? usersData : usersData?.data || [];

  // 👉 Contactos (proveedores)
  const { data: contactsData, isLoading: loadingContacts } = useSearchContacts({
    search: "",
    branchId: branchId,
    type: "SUPPLIER",
    limit: 6,
    offset: 1,
  });
  const contacts = Array.isArray(contactsData)
    ? contactsData
    : contactsData?.data || [];

  const [selected, setSelected] = useState(null);

  // 👉 según type elige la lista a mostrar
  const isIncome = type === "income";
  const list = isIncome ? users : contacts;
  const title = isIncome ? "Ventas de empleados" : "Proveedores";

  return (
    <div className="bg-[var(--brown-ligth-100)] p-4 rounded-xl shadow-md font-[var(--font-outfit)] text-[var(--brown-dark-950)] w-[300px] md:w-[500px] overflow-y-auto">
      <h2 className="text-sm font-normal text-[var(--brown-dark-950)] mb-4">
        {title}
      </h2>

      <ul className="space-y-3 ">
        {list?.map((item, index) => {
          const id = isIncome ? item.id : item.id; // 👈 ajusta según tu modelo
          const name = isIncome ? item.name : item.name; // 👈 ajusta según tu modelo
          const isSelected = selected === id;

          return (
            <li
              key={id || index}
              onClick={() => setSelected(id)}
              className={`flex items-center justify-between px-3 py-2 rounded-md transition shadow-sm cursor-pointer
                ${
                  isSelected
                    ? "bg-[var(--brown-ligth-200)] shadow-sm ring-2 ring-[var(--brown-dark-600)]"
                    : "bg-[var(--brown-ligth-50)] hover:bg-[var(--brown-ligth-200)]"
                }`}
            >
              <div className="flex items-center gap-3">
                <div className="bg-[var(--brown-ligth-300)] rounded-full">
                  <ProfileMan size="40" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--brown-dark-900)]">
                    {name}
                  </p>
                  <p className="text-xs text-[var(--brown-dark-700)]">
                    $1,200,000
                  </p>
                </div>
              </div>
              <div>
                <p className="font-semibold bg-[var(--brown-ligth-400)] rounded-full w-[16px] h-[16px] flex items-center justify-center">
                  <ArrowDown color={"var(--brown-dark-900)"} size={32} />
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default EmployeeSales;
