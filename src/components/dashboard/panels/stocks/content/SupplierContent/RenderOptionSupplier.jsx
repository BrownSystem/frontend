import { useViewStore } from "../../../../../../store/useViewStore";
import {
  AccountsPayable,
  CreateInvoice,
  CreateSupplier,
  InvoiceTable,
} from "./tables";
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
