import { useShopViewStore } from "@store/useShopViewStore";

export const RenderView = ({ viewMap }) => {
  const view = useShopViewStore((state) => state.view);
  const Component = viewMap[view?.name];

  const FallbackComponent = viewMap["registerSales"];

  const SafeComponent = Component || FallbackComponent;

  return <SafeComponent />;
};
