import { Button } from "../../widgets";
import { useNavigate, useParams } from "react-router-dom";
import { formatFechaISO } from "../stocks/content/SupplierContent/tables/InvoiceTable";
import Payments from "./Containers/Payments/Payments";
import Products from "./Containers/Products/Products";
import Contact from "./Containers/Contact/Contact";
import {
  useDownloadVoucherHtml,
  useGetOneVoucher,
} from "../../../../api/vouchers/vouchers.queries";
import html2pdf from "html2pdf.js";
import Branches from "./Containers/Branches/Branches";
import { useFindAllBoxDaily } from "../../../../api/boxDaily/boxDaily.queries";
import { useState } from "react";
import { BoxDailyOpenModal } from "../../../common";
import { useAuthStore } from "../../../../api/auth/auth.store";

const VoucherPanel = () => {
  const navigate = useNavigate();
  const { mutate: descargarHtml } = useDownloadVoucherHtml();
  const { id } = useParams();
  const { data: voucher, isLoading } = useGetOneVoucher(id);
  const [showModalBoxDaily, setShowModalBoxDaily] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "info" });
  const user = useAuthStore((state) => state.user);

  const formatVoucherNumber = (value) => {
    if (!value) return "";

    if (value.includes("NOTA_CREDITO")) {
      const parts = value.split(/[-_]/);
      const numero = parts[parts.length - 1];
      return `NTC_${numero}`;
    }

    return value;
  };

  const handleDescargarPDF = () => {
    if (!voucher?.id) return;

    descargarHtml(voucher?.id, {
      onSuccess: (html) => {
        const container = document.createElement("div");
        container.innerHTML = html;
        container.style.padding = "20px";

        html2pdf()
          .set({ filename: `comprobante-${voucher?.number}.pdf` })
          .from(container)
          .save();
      },
      onError: () => {
        setMessage({
          text: "Error al generar el comprobante ❌",
          type: "error",
        });
      },
    });
  };

  const { data: boxDaily } = useFindAllBoxDaily(
    {
      branch: voucher?.emissionBranchName,
      status: "OPEN",
    },
    {
      enabled: !!voucher?.emissionBranchName, // solo ejecuta cuando hay sucursal
    }
  );

  return (
    <>
      {showModalBoxDaily && (
        <BoxDailyOpenModal
          setShowModalBoxDaily={setShowModalBoxDaily}
          setMessage={setMessage}
          openedBy={user?.name}
          origenSucursalSeleccionada={voucher?.emissionBranchId}
          branchName={voucher?.emissionBranchName}
          onClose={() => setShowModalBoxDaily(false)}
        />
      )}

      <div className="flex justify-center w-full h-screen relative pt-2 ">
        {/* {boxDaily?.length === 0 && (
          <div className="fixed bottom-0  bg-[var(--text-state-yellow)] w-full  h-[25px]  flex items-center text-[14px] z-[9999] ">
            <p className="text-white text-center w-full">
              Pagos deshabilitados: caja cerrada en{" "}
              {voucher?.emissionBranchName}.
              <button
                className="pl-2 underline underline-offset-2 font-semibold cursor-pointer"
                onClick={() => setShowModalBoxDaily(true)}
              >
                Abrir Caja
              </button>
            </p>
          </div>
        )} */}
        <div className="w-full h-full rounded-md relative px-4 pb-10">
          {/* Header comprobante */}
          <div className="flex gap-6 mb-4 justify-between w-full">
            <div className="flex items-center justify-between gap-6 bg-[var(--brown-ligth-200)] w-full p-5 rounded-md">
              <div className="flex gap-6">
                <div className="border-r-[2px] pr-5 border-[var(--brown-ligth-300)]">
                  <Button text={"Volver"} onClick={() => navigate(-1)} />
                </div>
                <div className="flex flex-col border-r-[2px] pr-5 border-[var(--brown-ligth-300)]">
                  <p className="text-[var(--brown-dark-950)] font-semibold">
                    {voucher?.type}
                  </p>
                  <span className="text-xs text-[var(--brown-dark-700)]">
                    <span className="text-xs text-[var(--brown-dark-700)]">
                      {formatVoucherNumber(voucher?.number)}
                    </span>
                  </span>
                </div>
                <div className="flex flex-col border-r-[2px] pr-5 border-[var(--brown-ligth-300)]">
                  <p className="text-[var(--brown-dark-950)] font-semibold truncate max-w-[160px]">
                    {voucher?.emissionBranchName?.toUpperCase()}
                  </p>

                  <span className="text-xs text-[var(--brown-dark-700)]">
                    {formatFechaISO(voucher?.emissionDate)}
                  </span>
                </div>
              </div>
              <div className="flex gap-6">
                <Button text={"Descargar PDF"} onClick={handleDescargarPDF} />
                {voucher?.type !== "REMITO" &&
                  voucher?.type !== "NOTA_CREDITO_CLIENTE" &&
                  voucher?.type !== "NOTA_CREDITO_PROVEEDOR" && (
                    <p
                      className={`flex flex-col bg-[var(${
                        voucher?.status !== "PENDIENTE"
                          ? "--bg-state-green"
                          : "--bg-state-yellow"
                      })] cursor-pointer border-[1px] border-[var(${
                        voucher?.status !== "PENDIENTE"
                          ? "--text-state-green"
                          : "--text-state-yellow"
                      })] text-[var(--brown-dark-950)] px-6 py-2 rounded  w-auto`}
                    >
                      {voucher?.status}
                    </p>
                  )}
              </div>
            </div>
          </div>

          {/* Datos de las sucursales */}
          {voucher?.type === "REMITO" && <Branches voucher={voucher} />}
          {/* Datos contacto */}
          <Contact voucher={voucher} />
          {/* INFORMACIÓN DE LOS PRODUCTOS */}
          <Products voucher={voucher} />
          {/* PAGOS */}
          <Payments
            voucher={voucher}
            boxDaily={boxDaily}
            setMessage={setMessage}
            message={message}
          />
          {/* OBSERVACION */}
          {voucher?.observation && (
            <div className="flex flex-col items-center justify-center gap-3  w-full py-2 rounded-md ">
              <div className="flex flex-col px-5 self-start p-4 bg-[var(--brown-ligth-200)] rounded-md w-full">
                <span className="text-[var(--brown-dark-950)] font-semibold">
                  OBSERVACIÓN
                </span>
                <p className="text-[var(--brown-dark-800)]">
                  {voucher?.observation}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VoucherPanel;
