import {
  Comprobantes,
  SearchIcon,
  Ventas,
} from "../../../../../../assets/icons";
import { useViewStore } from "../../../../../../store/useViewStore";
import { CreateInvoice, OptionCard, RenderOptions } from "../../../../widgets";
import { InvoiceTable } from "./tables";

const viewMap = {
  invoiceTable: () => <InvoiceTable />,
  createInvoice: () => (
    <CreateInvoice tipoOperacion="compra" tipoComprobante="factura" />
  ),
};

const SuppliersContent = () => {
  const setView = useViewStore((state) => state.setView);

  return (
    <>
      <div className="w-full h-full rounded-lg  p-4">
        <div className="flex justify-between items-center">
          <div className="w-full flex justify-start pl-7 gap-4">
            <OptionCard
              text={"Ingresar factura"}
              onClick={() => setView("createInvoice")}
              name="createInvoice"
            >
              <Comprobantes color={"#fff"} />
            </OptionCard>
            <OptionCard
              text={"Comprobantes Realizados"}
              onClick={() => setView("invoiceTable")}
              name="invoiceTable"
            >
              <SearchIcon x={"24"} y={"24"} color={"#fff"} />
            </OptionCard>
          </div>
        </div>

        <div className="w-full px-4 rounded-xl ">
          <RenderOptions viewMap={viewMap} defaultView={"createInvoice"} />
        </div>
      </div>
    </>
  );
};

export default SuppliersContent;
