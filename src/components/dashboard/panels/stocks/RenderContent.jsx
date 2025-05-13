import { useStockViewStore } from "@store/useStockViewStore";
import {
  PedidoTable,
  ProductTable,
  ProductTableDeposit,
} from "./content/tables";
import {
  DepositsContent,
  MoreOptionsContent,
  SuppliersContent,
} from "./content";

const viewMap = {
  productos: ProductTable,
  depositos: DepositsContent,
  proveedores: SuppliersContent,
  products_of_deposit: ProductTableDeposit,
  pedidos: PedidoTable,
  masOpciones: MoreOptionsContent,
};

export const RenderView = () => {
  const view = useStockViewStore((state) => state.view);

  console.log(view);

  const Component = viewMap[view?.name];
  if (!Component) {
    const DefaultComponent = viewMap["productos"];
    return (
      <DefaultComponent
        title={"productos"}
        span={"proximo a agotar"}
        backTo={view?.props?.backTo}
      />
    );
  }
  return <Component {...(view.props || {})} />;
};
