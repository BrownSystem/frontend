import { useShopViewStore } from "@store/useShopViewStore";
import ProfContent from "./content/Prof/ProfContent";

const viewMap = {
  prof: ProfContent,
  cashClosing: () => <div>Cierre de caja</div>,
};

export const RenderView = () => {
  const view = useShopViewStore((state) => state.view);
  console.log("view", view);
  const Component = viewMap[view?.name];

  const FallbackComponent = viewMap["prof"];

  const SafeComponent = Component || FallbackComponent;

  return <SafeComponent />;
};
