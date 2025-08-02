import React from "react";
import { useViewStore } from "@store/useViewStore";
import { Edit, Folder } from "../../../../../../assets/icons";
import { OptionCard, RenderOptions } from "../../../../widgets";
import { EditClient, ReservationTable } from "./tables";

const viewMap = {
  // editClient: () => <EditClient />,

  reservation: () => <ReservationTable />,
};

const ClientContent = () => {
  const setView = useViewStore((state) => state.setView);
  return (
    <div className="w-auto h-full bg-white rounded-lg  p-4">
      <div className="flex">
        <div className="w-[90%] flex items-center gap-4">
          <OptionCard
            text={"Reservas Clientes"}
            onClick={() => setView("reservation")}
            name="reservation"
          >
            <Folder color={"#fff"} />
          </OptionCard>

          {/* <OptionCard
            text={"Editar Cliente"}
            onClick={() => setView("editClient")}
            name="editClient"
          >
            <Edit color={"#fff"} />
          </OptionCard> */}
        </div>
      </div>

      <div className="w-full  ">
        <RenderOptions viewMap={viewMap} defaultView={"reservation"} />
      </div>
    </div>
  );
};

export default ClientContent;
