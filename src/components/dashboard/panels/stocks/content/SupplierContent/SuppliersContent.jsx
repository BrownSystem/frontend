import {
  Comprobantes,
  CreateUser,
  CreditNote,
  SearchIcon,
  Ventas,
} from "../../../../../../assets/icons";
import { useViewSupplierStore } from "../../../../../../store/useViewSupplierStore";
import { SupplierOptionCard } from "../../../../widgets";
import { RenderOptionSupplier } from "./RenderOptionSupplier";

const SuppliersContent = () => {
  const setView = useViewSupplierStore((state) => state.setView);

  return (
    <>
      <div className="w-full h-full bg-white rounded-lg shadow overflow-x-auto p-4">
        <div className="flex">
          <div className="w-[90%] flex items-center gap-4">
            <SupplierOptionCard
              text={"Consultar pagos"}
              onClick={() => setView("invoiceTable")}
              name="invoiceTable"
            >
              <SearchIcon x={"24"} y={"24"} color={"#fff"} />
            </SupplierOptionCard>

            <SupplierOptionCard
              text={"Ingresar factura"}
              onClick={() => setView("createInvoice")}
              name="createInvoice"
            >
              <Comprobantes color={"#fff"} />
            </SupplierOptionCard>

            <SupplierOptionCard
              text={"Nota de credito"}
              onClick={() => setView("creditNote")}
              name="creditNote"
            >
              <CreditNote color={"#fff"} />
            </SupplierOptionCard>

            <SupplierOptionCard
              text={"Registrar pago"}
              onClick={() => setView("registerPayment")}
              name="registerPayment"
            >
              <Ventas x={"24"} y={"24"} />
            </SupplierOptionCard>

            <SupplierOptionCard
              text={"Añadir Proveedor"}
              onClick={() => setView("createSupplier")}
              name="createSupplier"
            >
              <CreateUser x={"24"} y={"24"} color={"#fff"} />
            </SupplierOptionCard>
          </div>
          <h2 className="w-[20%] text-4xl text-end h-full text-[var(--brown-dark-800)] font-bold">
            Facturas
          </h2>
        </div>

        <div className="w-full  bg-white px-4 py-2 mt-2 rounded-xl border border-[var(--brown-ligth-100)]">
          <RenderOptionSupplier />
        </div>
      </div>
    </>
  );
};

export default SuppliersContent;
