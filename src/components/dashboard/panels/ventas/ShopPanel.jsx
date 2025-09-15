import { useCallback } from "react";
import { ActionCard } from "../../widgets";
import {
  Comprobantes,
  CreateUser,
  Folder,
  Home,
} from "../../../../assets/icons";

import { useShopViewStore } from "@store/useShopViewStore";
import { RenderView } from "./RenderContent";
import {
  ClientContent,
  DepositsContent,
  ProductTable,
  RegisterSalesContent,
} from "./content";
import { ReservationTable } from "./content/ClientContent/tables";
import { useAuthStore } from "../../../../api/auth/auth.store";
import { ProductTableDeposit } from "./content/DepositsContent/tables";

const viewMap = {
  productos: ProductTable,
  depositos: DepositsContent,
  registerSales: RegisterSalesContent,
  reservationTable: ReservationTable,
  generatedClient: ClientContent,
  products_of_deposit: ProductTableDeposit,
};

const ShopPanel = () => {
  const user = useAuthStore((state) => state.user);
  const setView = useShopViewStore((state) => state.setViewSafe);
  const handleViewProductos = useCallback(() => {
    setView({
      name: "productos",
    });
  }, [setView]);

  const handleViewDepositos = useCallback(() => {
    setView({ name: "depositos" });
  }, [setView]);

  const handlerViewRegisterSales = useCallback(() => {
    setView({ name: "registerSales" });
  }, [setView]);

  const handlerViewReserationTable = useCallback(() => {
    setView({ name: "reservationTable" });
  }, [setView]);

  const handlerViewGeneratedClient = useCallback(() => {
    setView({ name: "generatedClient" });
  }, [setView]);

  const isAdmin = user?.role === "ADMIN";

  return (
    <>
      <div className="w-full flex justify-center ">
        <div className="w-auto flex  justify-center h-[70px] gap-2">
          <ActionCard
            svgAction={<Folder color={"#ffff"} />}
            action={"Ver"}
            onClick={handleViewProductos}
            title={"Productos"}
            others={false}
            hasNotifications={false}
          />
          <ActionCard
            svgAction={<Home />}
            action={"Ingresar"}
            onClick={handleViewDepositos}
            title={"Depositos"}
            others={false}
            hasNotifications={false}
          />
          {isAdmin && (
            <ActionCard
              svgAction={<Comprobantes />}
              action={"Ingresar"}
              title={"Comprobantes"}
              onClick={handlerViewRegisterSales}
              others={false}
              hasNotifications={false}
            />
          )}

          <ActionCard
            svgAction={<CreateUser color={"#ffff"} x={"24"} y={"24"} />}
            action={"Visualizar"}
            title={"Reservas"}
            onClick={handlerViewGeneratedClient}
            others={false}
            hasNotifications={false}
          />
        </div>
      </div>
      <div className="mt-1 bg-white p-1 w-full ">
        <RenderView viewMap={viewMap} defaultView={"registerSales"} />
      </div>
    </>
  );
};

export default ShopPanel;
