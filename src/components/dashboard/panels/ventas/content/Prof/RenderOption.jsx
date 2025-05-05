import { useViewStore } from "../../../../../../store/useViewStore";
const viewMap = {};

export const RenderOptionSupplier = () => {
  const view = useViewStore((state) => state.currentView);
  const currentView = useViewStore((state) => (state.view = "invoiceTable"));

  const Component = viewMap[view];
  if (!Component) {
    const DefaultComponent = viewMap[currentView];
    return <DefaultComponent />;
  }
  return <Component key={view} />;
};
