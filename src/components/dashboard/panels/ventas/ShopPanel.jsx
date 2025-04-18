import LayoutPanel from "../../layout/LayoutPanel";
import { ActionCard } from "../../widgets";
import {
  Pedidos,
  CreateUser,
  Comporbantes,
  Lock,
} from "../../../../assets/icons";

const ShopPanel = () => {
  return (
    <LayoutPanel>
      <div className="w-full flex max-h-full roundend-lg">
        <div className="w-full flex h-[120px] gap-5">
          <ActionCard
            svgAction={<CreateUser />}
            action={"Añadir"}
            title={"Añadir cliente"}
            others={false}
            hasNotifications={false}
          />
          <ActionCard
            svgAction={<Comporbantes />}
            action={"Generar"}
            title={"Comprobantes"}
            others={false}
            hasNotifications={false}
          />
          <ActionCard
            svgAction={<Lock />}
            action={"Cerrar"}
            title={"Cierre de caja"}
            others={false}
            hasNotifications={false}
          />
          <ActionCard
            svgAction={<Pedidos />}
            action={"Visualizar"}
            title={"Pedidos"}
            others={false}
            hasNotifications={true}
          />
        </div>
      </div>
      <div className="mt-5">{/* TODO: Add content here */}</div>
    </LayoutPanel>
  );
};

export default ShopPanel;
