import { useCallback } from "react";
import { useStockViewStore } from "@store/useStockViewStore"; // Asegúrate de que el path sea correcto
import { ActionCard } from "../../widgets";
import {
  DailyBox,
  MenuKebab,
  Proveedores,
  QrCode,
} from "../../../../assets/icons";
import { RenderView } from "./RenderContent";

const StockPanel = () => {
  const setView = useStockViewStore((state) => state.setViewSafe);

  const handleViewProveedores = useCallback(() => {
    setView({ name: "proveedores" });
  }, [setView]);

  const handleViewQrCode = useCallback(() => {
    setView({ name: "qrcode" });
  }, [setView]);

  const handleViewManagementContent = useCallback(() => {
    setView({ name: "management" });
  }, [setView]);

  const handleViewBoxDaily = useCallback(() => {
    setView({ name: "boxDaily" });
  }, [setView]);

  return (
    <>
      <div className="w-full  flex  max-h-full roundend-lg pt-4">
        <div className="w-full flex justify-center h-[70px] gap-5">
          <ActionCard
            svgAction={<DailyBox />}
            action={"Ingresar"}
            onClick={handleViewBoxDaily}
            title={"Caja Diaria"}
            others={false}
            hasNotifications={false}
          />
          <ActionCard
            svgAction={<Proveedores />}
            action={"Ingresar"}
            onClick={handleViewProveedores}
            title={"Compras"}
            others={false}
            hasNotifications={false}
          />
          <ActionCard
            svgAction={<QrCode size={24} />}
            action={"Imprimir"}
            onClick={handleViewQrCode}
            title={"Código QR"}
            others={false}
            hasNotifications={false}
          />
          <ActionCard
            svgAction={<MenuKebab size={24} color={"white"} />}
            action={"Ingresar"}
            onClick={handleViewManagementContent}
            title={"Gestión"}
            others={false}
            hasNotifications={false}
          />
        </div>
      </div>
      <div className="mt-2 w-full">
        <RenderView />
      </div>
    </>
  );
};

export default StockPanel;
