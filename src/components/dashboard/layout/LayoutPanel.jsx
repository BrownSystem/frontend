import { useAuthStore } from "../../../api/auth/auth.store";
import { useFindAllBranch } from "../../../api/branch/branch.queries";
import { Proveedores, SecurityPassword, Wallet } from "../../../assets/icons";

const LayoutPanel = ({ children }) => {
  const setUser = useAuthStore((state) => state.user);
  const { data: branches = [] } = useFindAllBranch();

  return (
    <div className="w-full flex flex-col bg-white   ml-[4rem] gap-4 ">
      <div className="w-full flex justify-center bg-[var(--brown-dark-800)] py-2 text-white gap-2">
        <span className="flex gap-2">
          NOMBRE: {setUser.name}{" "}
          <span>
            <Proveedores color={"green"} />
          </span>
        </span>
        |
        <span className="flex">
          ROLE:{" "}
          {setUser.role === "ADMIN" ? <p> Administrador</p> : <p> Vendedor</p>}
        </span>
        <span>
          {setUser.role === "ADMIN" ? (
            <SecurityPassword color={"yellow"} />
          ) : (
            <Wallet color={"yellow"} x={"22"} y={"22"} />
          )}
        </span>
        |
        <span>
          SUCURSAL:{" "}
          {branches.find((branch) => setUser.branchId === branch.id)?.name ||
            "No asignada"}
        </span>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default LayoutPanel;
