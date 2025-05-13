import { useEffect } from "react";
import { useViewStore } from "@store/useViewStore";

const RenderOptions = ({ viewMap, defaultView }) => {
  const view = useViewStore((state) => state.currentView);
  const setView = useViewStore((state) => state.setView);

  useEffect(() => {
    if (!view || !viewMap[view]) {
      setView(defaultView);
    }
  }, [view, viewMap, defaultView, setView]);

  const Component = viewMap[view] || viewMap[defaultView];
  return Component ? <Component /> : null;
};

export default RenderOptions;
