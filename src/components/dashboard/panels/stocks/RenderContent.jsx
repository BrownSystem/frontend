import { useStockViewStore } from "@store/useStockViewStore";
import { ProductTableDeposit } from "./content/tables";
import {
  DepositsContent,
  ManagementContent,
  PrintQrCodeContent,
  SuppliersContent,
} from "./content";

const viewMap = {
  depositos: DepositsContent,
  proveedores: SuppliersContent,
  products_of_deposit: ProductTableDeposit,
  management: ManagementContent,
  qrcode: PrintQrCodeContent,
};

export const RenderView = () => {
  const view = useStockViewStore((state) => state.view);

  const Component = viewMap[view?.name];
  if (!Component) {
    const DefaultComponent = viewMap["depositos"];
    return (
      <DefaultComponent
        title={"depositos"}
        span={""}
        backTo={view?.props?.backTo}
      />
    );
  }
  return <Component {...(view.props || {})} />;
};
