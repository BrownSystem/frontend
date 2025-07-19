import {
  Comprobantes,
  SearchIcon,
  Ventas,
} from "../../../../../../assets/icons";
import { useViewStore } from "../../../../../../store/useViewStore";
import { CreateInvoice, OptionCard, RenderOptions } from "../../../../widgets";
import { InvoiceTable, AccountsPayable } from "./tables";

const viewMap = {
  invoiceTable: () => <InvoiceTable />,
  registerPayment: () => <AccountsPayable />,
  createInvoice: () => (
    <CreateInvoice tipoOperacion="compra" tipoComprobante="factura" />
  ),
};

const SuppliersContent = () => {
  const setView = useViewStore((state) => state.setView);

  return (
    <>
      <div className="w-full h-full  rounded-lg  p-4">
        <div className="flex justify-between items-center">
          <div className="w-full flex  gap-4">
            <OptionCard
              text={"Consultar pagos"}
              onClick={() => setView("invoiceTable")}
              name="invoiceTable"
            >
              <SearchIcon x={"24"} y={"24"} color={"#fff"} />
            </OptionCard>

            <OptionCard
              text={"Ingresar factura"}
              onClick={() => setView("createInvoice")}
              name="createInvoice"
            >
              <Comprobantes color={"#fff"} />
            </OptionCard>

            <OptionCard
              text={"Registrar pago"}
              onClick={() => setView("registerPayment")}
              name="registerPayment"
            >
              <Ventas x={"24"} y={"24"} />
            </OptionCard>
          </div>
        </div>

        <div className="w-full   px-4 py-2 mt-2 rounded-xl ">
          <RenderOptions viewMap={viewMap} defaultView={"invoiceTable"} />
        </div>
      </div>
    </>
  );
};

export default SuppliersContent;
