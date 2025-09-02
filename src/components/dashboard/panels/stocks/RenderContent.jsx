import { useStockViewStore } from "@store/useStockViewStore";
import {
  ManagementContent,
  PrintQrCodeContent,
  SuppliersContent,
} from "./content";
import BoxDaily from "./content/BoxDaily/BoxDaily";

const viewMap = {
  proveedores: SuppliersContent,
  management: ManagementContent,
  qrcode: PrintQrCodeContent,
  boxDaily: BoxDaily,
};

export const RenderView = () => {
  const view = useStockViewStore((state) => state.view);

  const Component = viewMap[view?.name];
  if (!Component) {
    const DefaultComponent = viewMap["proveedores"];
    return (
      <DefaultComponent
        title={"proveedores"}
        span={""}
        backTo={view?.props?.backTo}
      />
    );
  }
  return <Component {...(view.props || {})} />;
};
