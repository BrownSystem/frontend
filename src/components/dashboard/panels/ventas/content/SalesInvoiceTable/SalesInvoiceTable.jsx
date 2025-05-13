import React, { useState } from "react";
import { SearchIcon } from "../../../../../../assets/icons";
import { FiltroDropdown } from "../../../../widgets";
import ConsultingInvoiceCard from "./tables/ConsultingInvoiceCard";
import InvoiceModal from "../../../../../common/Modal/InvoiceModal";
import InvoicePaymentModal from "../../../../../common/Modal/InvoicePaymentModal";

const facturasVentas = [
  {
    factura: "FC1-0000678",
    fecha: "15/04/2025",
    fechaPago: "20/04/2025",
    monto: 1540.5,
    montoPagado: 1540.5,
    formaDePago: "Cheque",
    estado: "Pagada",
    cliente: "Lucía M.",
  },
  {
    factura: "A0067",
    fecha: "10/04/2025",
    fechaPago: "18/04/2025",
    monto: 956.0,
    montoPagado: 956.0,
    formaDePago: "Cheque de Tercero",
    estado: "Pagada",
    cliente: "Carlos B.",
  },
  {
    factura: "FC1-0000679",
    fecha: "17/04/2025",
    fechaPago: "19/04/2025",
    monto: 1280.75,
    montoPagado: 1280.75,
    formaDePago: "Transferencia",
    estado: "Pagada",
    cliente: "Sandra L.",
  },
  {
    factura: "A0068",
    fecha: "18/04/2025",
    fechaPago: "22/04/2025",
    monto: 875.0,
    montoPagado: 875.0,
    formaDePago: "Efectivo",
    estado: "Pagada",
    cliente: "Martín R.",
  },
  {
    factura: "FC1-0000680",
    fecha: "20/04/2025",
    fechaPago: "27/04/2025",
    monto: 1940.0,
    montoPagado: 1940.0,
    formaDePago: "Tarjeta",
    estado: "Pagada",
    cliente: "Valeria G.",
  },
];

const facturasPago = [
  {
    factura: "B0004",
    fecha: "02/04/2025",
    fechaPago: "25/04/2025",
    monto: 624.19,
    montoPagado: 0,
    formaDePago: "Efectivo",
    estado: "Pendiente",
    cliente: "Ana R.",
  },
  {
    factura: "B0005",
    fecha: "02/04/2025",
    fechaPago: "25/04/2025",
    monto: 600.19,
    montoPagado: 0,
    formaDePago: "Transferencia",
    estado: "Pendiente",
    cliente: "Pedro T.",
  },
  {
    factura: "B0006",
    fecha: "05/04/2025",
    fechaPago: "28/04/2025",
    monto: 715.0,
    montoPagado: 0,
    formaDePago: "Cheque",
    estado: "Pendiente",
    cliente: "Laura S.",
  },
  {
    factura: "B0007",
    fecha: "09/04/2025",
    fechaPago: "30/04/2025",
    monto: 890.5,
    montoPagado: 400.0,
    formaDePago: "Transferencia",
    estado: "Parcial",
    cliente: "Julián M.",
  },
  {
    factura: "B0008",
    fecha: "12/04/2025",
    fechaPago: "12/04/2025",
    monto: 320.0,
    montoPagado: 200.0,
    formaDePago: "Efectivo",
    estado: "Parcial",
    cliente: "Camila Z.",
  },
];

const opciones = ["Fecha", "Cliente"];

const SalesInvoiceTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [showModalRegisterPayment, setShowModalRegisterPayment] =
    useState(false);
  const [tags, onCambiar] = useState("pagos");

  return (
    <>
      {showModal && (
        <InvoiceModal
          onCancel={() => setShowModal(false)}
          onConfirm={() => {
            alert("Pago confirmado");
            setShowModal(false);
          }}
        />
      )}

      {showModalRegisterPayment && (
        <InvoicePaymentModal
          onClose={() => setShowModalRegisterPayment(false)}
          onConfirm={() => {
            alert("Pago confirmado");
            setShowModalRegisterPayment(false);
          }}
        />
      )}

      <div className="w-full h-full bg-white rounded-lg shadow overflow-x-auto p-4">
        <div className="w-full flex gap-1 items-center">
          <div className="flex items-center bg-[#fcf5e9] border-[2px] border-[#f5e6c9] rounded-md px-3 py-2 w-[280px] font-medium">
            <SearchIcon color="#5c4c3a" className="text-[#5c4c3a]" />
            <input
              type="text"
              placeholder="Buscar"
              className="bg-transparent outline-none w-full text-[#5c4c3a] placeholder-[#5c4c3a] text-[15px]"
            />
          </div>
          <FiltroDropdown opciones={opciones} id={"PedidoTable"} />
        </div>

        <div className="w-full mt-4">
          <div className="flex text-[15px] font-medium rounded-t-lg overflow-hidden bg-[#ffefd4]">
            <div
              className={`w-full cursor-pointer px-4 py-2 transition-all duration-200 text-xl text-center ${
                tags === "ventas"
                  ? "text-[#8a775a] border-b-2 border-[#e8d5a2]"
                  : "bg-white text-[#3c2f1c] border-t-2 border-x-2 border-[#e8d5a2] rounded-t-md shadow-md"
              }`}
              onClick={() => onCambiar("pagos")}
            >
              Pagos Pendientes
            </div>
            <div
              className={`w-full px-4 py-2 transition-all duration-200 text-xl text-center cursor-pointer ${
                tags === "pagos"
                  ? "text-[#8a775a] border-b-2 border-[#e8d5a2]"
                  : "bg-white text-[#3c2f1c] border-t-2 border-x-2 border-[#e8d5a2] rounded-t-md shadow-md"
              }`}
              onClick={() => onCambiar("ventas")}
            >
              Ventas Finalizadas
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-b-lg shadow-sm">
          <table className="w-full text-left text-[#3c2f1c] text-md">
            <thead>
              <tr
                className={`grid ${
                  tags === "pagos" ? "grid-cols-7" : "grid-cols-6"
                } font-medium px-4 py-2 border-b border-[#e6d8be] bg-white`}
              >
                <th className="text-center">Fecha</th>
                <th className="text-center">Cliente</th>
                <th className="text-center">Monto</th>
                <th className="text-center">Monto Abonado</th>
                {tags === "pagos" ? <th className="text-center">Saldo</th> : ""}

                <th className="text-center">Estado</th>
                <th className="text-center">Detalles</th>
              </tr>
            </thead>
            <tbody>
              {tags !== "pagos"
                ? facturasVentas.map((factura, index) => {
                    return (
                      <ConsultingInvoiceCard
                        key={index}
                        factura={factura}
                        index={index}
                        onShowModal={() => setShowModal(true)}
                      />
                    );
                  })
                : facturasPago.map((factura, index) => {
                    return (
                      <ConsultingInvoiceCard
                        key={index}
                        factura={factura}
                        index={index}
                        onShowModal={() => setShowModalRegisterPayment(true)}
                      />
                    );
                  })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default SalesInvoiceTable;
