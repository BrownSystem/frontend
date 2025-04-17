import LayoutPanel from "../../layout/LayoutPanel";
import { ActionCard } from "../../widgets";
import { Home, Pedidos, Danger, Proveedores } from "../../../../assets/icons";
import { useStockView } from "../../../../context/StockViewContext";

const StockPanel = () => {
  const { setView, renderContent } = useStockView({
    name: "productos",
    props: null,
  });

  return (
    <LayoutPanel>
      <div className="w-full flex max-h-full roundend-lg">
        <div className="w-full flex h-[120px] gap-5">
          <ActionCard
            svgAction={<Danger />}
            action={"Ingresar"}
            onClick={() =>
              setView({
                name: "productos",
                props: { title: "Productos", span: "proximo a agotar" },
              })
            }
            title={"Productos agotados"}
            others={false}
            hasNotifications={false}
          />
          <ActionCard
            svgAction={<Home />}
            action={"Ingresar"}
            onClick={() => setView({ name: "depositos" })}
            title={"Depositos"}
            others={true}
            hasNotifications={false}
          />
          <ActionCard
            onClick={() => setView({ name: "proveedores" })}
            svgAction={<Proveedores />}
            action={"Ingresar"}
            title={"Proveedores"}
            others={false}
            hasNotifications={false}
          />
          <ActionCard
            onClick={() => setView({ name: "pedidos" })}
            svgAction={<Pedidos />}
            action={"Visualizar"}
            title={"Pedidos"}
            others={false}
            hasNotifications={true}
          />
        </div>
      </div>
      <div className="mt-5 w-full h-full">{renderContent()}</div>
    </LayoutPanel>
  );
};

export default StockPanel;
