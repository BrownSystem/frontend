import { useCallback } from "react";
import { useStockViewStore } from "@store/useStockViewStore"; // Asegúrate de que el path sea correcto
import { ActionCard } from "../../widgets";
import {
  Danger,
  Home,
  MenuKebab,
  Pedidos,
  Proveedores,
} from "../../../../assets/icons";
import { RenderView } from "./RenderContent";

const StockPanel = () => {
  const setView = useStockViewStore((state) => state.setViewSafe);

  const handleViewProductos = useCallback(() => {
    setView({
      name: "productos",
      props: { title: "Productos", span: "proximo a agotarse" },
    });
  }, [setView]);

  const handleViewDepositos = useCallback(() => {
    setView({ name: "depositos" });
  }, [setView]);

  const handleViewProveedores = useCallback(() => {
    setView({ name: "proveedores" });
  }, [setView]);

  const handleViewPedidos = useCallback(() => {
    setView({ name: "pedidos" });
  }, [setView]);

  const handleViewMoreOptions = useCallback(() => {
    setView({ name: "masOpciones" });
  }, [setView]);

  return (
    <>
      <div className="w-full flex max-h-full roundend-lg">
        <div className="w-full flex h-[120px] gap-5">
          <ActionCard
            svgAction={<Danger color={"#ffff"} />}
            action={"Ingresar"}
            onClick={handleViewProductos}
            title={"Productos agotados"}
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
          <ActionCard
            svgAction={<Proveedores />}
            action={"Ingresar"}
            onClick={handleViewProveedores}
            title={"Compras"}
            others={false}
            hasNotifications={false}
          />
          <ActionCard
            svgAction={<Pedidos />}
            action={"Visualizar"}
            onClick={handleViewPedidos}
            title={"Pedidos"}
            others={false}
            hasNotifications={true}
          />
          <ActionCard
            svgAction={<MenuKebab />}
            action={"Administracion"}
            onClick={handleViewMoreOptions}
            title={"Mas opciones"}
            others={false}
            hasNotifications={false}
          />
        </div>
      </div>
      <div className="mt-5 w-full h-full">
        <RenderView />
      </div>
    </>
  );
};

export default StockPanel;
