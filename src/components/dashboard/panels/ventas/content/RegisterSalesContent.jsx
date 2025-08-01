import React from "react";
import { useViewStore } from "@store/useViewStore";
import { CreateInvoice, OptionCard, RenderOptions } from "../../../widgets";
import { Comprobantes, SearchIcon } from "../../../../../assets/icons";
import SalesInvoiceTable from "./SalesInvoiceTable/SalesInvoiceTable";

const viewMap = {
  createInvoice: () => (
    <CreateInvoice tipoOperacion="venta" tipoComprobante="factura" />
  ),

  salesInquiry: () => <SalesInvoiceTable />,
};

const RegisterSalesContent = () => {
  const setView = useViewStore((state) => state.setView);
  return (
    <div className="w-auto h-full bg-white rounded-lg  p-4">
      <div className="flex">
        <div className="w-[90%] flex items-center gap-4">
          <OptionCard
            text={"Ingresar factura"}
            onClick={() => setView("createInvoice")}
            name="createInvoice"
          >
            <Comprobantes color={"#fff"} />
          </OptionCard>

          <OptionCard
            text={"Consultar Comprobantes"}
            onClick={() => setView("salesInquiry")}
            name="salesInquiry"
          >
            <SearchIcon color={"#fff"} />
          </OptionCard>
        </div>
      </div>

      <div className="w-full  bg-white px-4 py-2 mt-2 rounded-xl border border-[var(--brown-ligth-100)]">
        <RenderOptions viewMap={viewMap} defaultView={"createInvoice"} />
      </div>
    </div>
  );
};

export default RegisterSalesContent;
