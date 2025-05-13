import React from "react";
import { useViewStore } from "@store/useViewStore";
import { CreateUser, Edit } from "../../../../../../assets/icons";
import { OptionCard, RenderOptions } from "../../../../widgets";
import { CreateClient, EditClient } from "./tables";

const viewMap = {
  createClient: () => <CreateClient />,

  editClient: () => <EditClient />,
};

const ClientContent = () => {
  const setView = useViewStore((state) => state.setView);
  return (
    <div className="w-auto h-full bg-white rounded-lg  p-4">
      <div className="flex">
        <div className="w-[90%] flex items-center gap-4">
          <OptionCard
            text={"Cargar Cliente"}
            onClick={() => setView("createClient")}
            name="createClient"
          >
            <CreateUser color={"#fff"} />
          </OptionCard>

          <OptionCard
            text={"Editar Cliente"}
            onClick={() => setView("editClient")}
            name="editClient"
          >
            <Edit color={"#fff"} />
          </OptionCard>
        </div>
      </div>

      <div className="w-full  bg-white px-4 py-2 mt-2 rounded-xl border border-[var(--brown-ligth-100)]">
        <RenderOptions viewMap={viewMap} defaultView={"createClient"} />
      </div>
    </div>
  );
};

export default ClientContent;
