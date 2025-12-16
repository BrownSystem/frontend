import { CreateUser, Edit } from "../../../../../../assets/icons";
import { useViewStore } from "../../../../../../store/useViewStore";
import { OptionCard, RenderOptions } from "../../../../widgets";
import { AddEmployeeForm, EditProductTable } from "./tables";
import EmployeeTable from "./tables/EmployeeTable";

const viewMap = {
  createUser: AddEmployeeForm,
  editProducts: EditProductTable,
  employeedTable: EmployeeTable,
};

const MoreOptionsContent = () => {
  const setView = useViewStore((state) => state.setView);

  return (
    <>
      <div className="w-auto h-full bg-[var(--fill)]   p-4">
        <div className="flex ">
          <div className="w-[90%] flex justify-start pl-7 items-center gap-4">
            <OptionCard
              text={"Añadir Empleados"}
              onClick={() => setView("createUser")}
              name="createUser"
            >
              <CreateUser />
            </OptionCard>
            <OptionCard
              text={"Empleados"}
              onClick={() => setView("employeedTable")}
              name="employeedTable"
            >
              <CreateUser />
            </OptionCard>
            <OptionCard
              text={"Editar Productos"}
              onClick={() => setView("editProducts")}
              name="editProducts"
            >
              <Edit />
            </OptionCard>
          </div>
        </div>

        <div className="w-full  bg-[var(--fill)] px-4 mt-1 ">
          <RenderOptions viewMap={viewMap} defaultView={"createUser"} />
        </div>
      </div>
    </>
  );
};

export default MoreOptionsContent;
