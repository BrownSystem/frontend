import { useCallback } from "react";
import { ActionCard } from "../../widgets";
import { Lock, Comprobantes } from "../../../../assets/icons";

import { useShopViewStore } from "@store/useShopViewStore";
import { RenderView } from "./RenderContent";

const ShopPanel = () => {
  const setView = useShopViewStore((state) => state.setViewSafe);

  const handlerViewProf = useCallback(() => {
    setView({ name: "prof" });
  }, [setView]);

  const handlerViewCashClosing = useCallback(() => {
    setView({ name: "cashClosing" });
  }, [setView]);

  return (
    <>
      <div className="w-full flex max-h-full roundend-lg">
        <div className="w-full flex h-[120px] gap-5">
          <ActionCard
            svgAction={<Comprobantes />}
            action={"Generar"}
            title={"Comprobantes"}
            onClick={handlerViewProf}
            others={false}
            hasNotifications={false}
          />
          <ActionCard
            svgAction={<Lock />}
            action={"Cerrar"}
            title={"Cierre de caja"}
            onClick={handlerViewCashClosing}
            others={false}
            hasNotifications={false}
          />
        </div>
      </div>
      <div className="mt-5">
        <RenderView />
      </div>
    </>
  );
};

export default ShopPanel;
