import { useViewSupplierStore } from "../../../../../../store/useViewSupplierStore";
import { CreateInvoice, CreateSupplier, InvoiceTable } from "./tables";
const viewMap = {
  invoiceTable: InvoiceTable,
  createInvoice: CreateInvoice,
  creditNote: CreateInvoice,
  createSupplier: CreateSupplier,
};

export const RenderOptionSupplier = () => {
  const view = useViewSupplierStore((state) => state.currentView);

  const Component = viewMap[view];
  if (!Component) {
    const DefaultComponent = viewMap["invoiceTable"];
    return <DefaultComponent />;
  }
  return <Component />;
};
