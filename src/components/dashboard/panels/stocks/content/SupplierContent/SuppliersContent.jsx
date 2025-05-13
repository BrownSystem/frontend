import {
  Comprobantes,
  CreateUser,
  CreditNote,
  SearchIcon,
  Ventas,
} from "../../../../../../assets/icons";
import { useViewStore } from "../../../../../../store/useViewStore";
import { CreateInvoice, OptionCard, RenderOptions } from "../../../../widgets";
import { InvoiceTable, CreateSupplier, AccountsPayable } from "./tables";

const viewMap = {
  invoiceTable: () => <InvoiceTable />,
  createSupplier: () => <CreateSupplier />,
  registerPayment: () => <AccountsPayable />,
  createInvoice: () => (
    <CreateInvoice tipoOperacion="compra" tipoComprobante="factura" />
  ),
  creditNote: () => (
    <CreateInvoice tipoOperacion="compra" tipoComprobante="notaCredito" />
  ),
};

const SuppliersContent = () => {
  const setView = useViewStore((state) => state.setView);

  return (
    <>
      <div className="w-auto h-full bg-white rounded-lg  p-4">
        <div className="flex">
          <div className="w-[90%] flex items-center gap-4">
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
              text={"Nota de credito"}
              onClick={() => setView("creditNote")}
              name="creditNote"
            >
              <CreditNote color={"#fff"} />
            </OptionCard>

            <OptionCard
              text={"Registrar pago"}
              onClick={() => setView("registerPayment")}
              name="registerPayment"
            >
              <Ventas x={"24"} y={"24"} />
            </OptionCard>

            <OptionCard
              text={"Añadir Proveedor"}
              onClick={() => setView("createSupplier")}
              name="createSupplier"
            >
              <CreateUser x={"24"} y={"24"} color={"#fff"} />
            </OptionCard>
          </div>
        </div>

        <div className="w-full  bg-white px-4 py-2 mt-2 rounded-xl border border-[var(--brown-ligth-100)]">
          <RenderOptions viewMap={viewMap} defaultView={"invoiceTable"} />
        </div>
      </div>
    </>
  );
};

export default SuppliersContent;
