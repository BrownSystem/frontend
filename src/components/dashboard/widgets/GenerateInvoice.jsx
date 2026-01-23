import { useEffect, useMemo, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";

import { Danger, Delete, InvoiceIcon, PeopleTick } from "../../../assets/icons";
import Button from "./Button";
import Message from "./Message";
import FormattedAmount from "./FormattedAmount";
import FormattedNumberInput from "./FormattedNumberInput";
import LabelInvoice from "./LabelInvoice";

import {
  BoxDailyOpenModal,
  ProductSearchModal,
  RegisterPaymentModal,
} from "../../common";
import ContactCreateModal from "../../common/Modal/Contacts/ContactCreateModal";

import { useAuthStore } from "../../../api/auth/auth.store";
import { useEntityStore } from "../../../store/useEntityStore";

import { useFindAllBranch } from "../../../api/branch/branch.queries";
import { useFindAllBoxDaily } from "../../../api/boxDaily/boxDaily.queries";
import {
  useCreateVoucher,
  useGenerateVoucherNumber,
} from "../../../api/vouchers/vouchers.queries";
import { useCreateNotification } from "../../../api/notification/notification.queries";
import { notifyVoucher } from "../../../api/notification/notifications";
import CreditNoteModal from "../../common/Modal/CreditNote/CreditNoteModal/CreditNoteModal";
import { useMessageStore } from "../../../store/useMessage";
import { useDeleteCheckBook } from "../../../api/check-book/check-book.queries";

const CreateInvoice = ({ tipoOperacion }) => {
  /** ----------------------------
   * STORES & ESTADOS GLOBALES
   * ---------------------------- */
  const {
    selectedEntidadName,
    setSelectedEntidadName,
    selectedEntidadNameSeller,
    setSelectedEntidadNameSeller,
    selectedEntidadInvoice,
    setSelectedEntidadInvoice,
  } = useEntityStore();

  const setUser = useAuthStore((state) => state.user);

  /** ----------------------------
   * FORMULARIO
   * ---------------------------- */
  const {
    replace,
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fecha: new Date(
        new Date().getTime() - new Date().getTimezoneOffset() * 60000,
      )
        .toISOString()
        .split("T")[0],
      proveedor: "",
      cliente: "",
      numeroFactura: "",
      letra: "P",
      productos: [
        {
          descripcion: "",
          isReserved: false,
          precio: 0,
          quantity: 1,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "productos",
  });

  /** ----------------------------
   * QUERIES
   * ---------------------------- */
  const { mutate: notify } = useCreateNotification();
  const { data: branches = [] } = useFindAllBranch();

  const tipoFactura = watch("tipoFactura");
  const origenSucursal = watch("origenSucursal");
  const origenSucursalSeleccionada = watch("origenSucursal");

  const branchName = useMemo(
    () => branches.find((b) => b.id === origenSucursal)?.name,
    [origenSucursal, branches],
  );

  const { data: boxDaily } = useFindAllBoxDaily(
    {
      branch: branchName,
      status: "OPEN",
    },
    {
      enabled: !!origenSucursal && !!branchName, // solo ejecuta cuando hay sucursal
    },
  );

  const { data: numeroGenerado } = useGenerateVoucherNumber({
    type: tipoFactura,
    emissionBranchId: origenSucursalSeleccionada,
    enabled: !!tipoFactura && !!origenSucursal,
  });

  const { mutate: deleteCheckBook } = useDeleteCheckBook();

  const { mutate: createVoucher, isPending: savingInvoice } = useCreateVoucher({
    onSuccess: (data) => {
      if (data.data.status >= 400) {
        setMessage({
          text: data.data.message,
          type: "error",
        });
        return;
      }
      setMessage({ text: "Factura creada correctamente", type: "success" });
    },
    onError: (error) => {
      const msg =
        error?.response?.data?.message || "Hubo un error al crear la factura";
      setMessage({ text: msg, type: "error" });
      console.error("Error al crear factura:", error);
    },
  });

  /** ----------------------------
   * ESTADOS LOCALES
   * ---------------------------- */
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pagos, setPagos] = useState([]);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showInvoicesToConnect, setShowInvoicesToConnect] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProductIndex, setSelectedProductIndex] = useState(null);
  const [showContactModalSeller, setShowContactModalSeller] = useState(false);
  const { setMessage } = useMessageStore();

  const [showModalBoxDaily, setShowModalBoxDaily] = useState(false);
  const [disableButton, setDisableButton] = useState(false);

  /** ----------------------------
   * DERIVADOS
   * ---------------------------- */
  const tiposFactura = useMemo(() => {
    if (tipoOperacion === "compra") {
      return [
        { value: "FACTURA", label: "FACTURA" },
        { value: "NOTA_CREDITO_PROVEEDOR", label: "NOTA DE CREDITO" },
        { value: "REMITO", label: "REMITO" },
      ];
    } else {
      return [
        { value: "P", label: "P" },
        { value: "NOTA_CREDITO_CLIENTE", label: "NOTA DE CREDITO" },
      ];
    }
  }, [tipoOperacion]);

  const campoEntidad = tipoOperacion === "venta" ? "cliente" : "proveedor";
  const campoEntidadSeller = "vendedor";
  const productos = watch("productos");

  /** ----------------------------
   * EFFECTS
   * ---------------------------- */
  // useEffect(() => {
  //   if (boxDaily) {
  //     remove();
  //     setPagos([]);
  //     selectedEntidadName && setSelectedEntidadName("");
  //     selectedEntidadNameSeller && setSelectedEntidadNameSeller("");

  //     if (boxDaily.length === 0) {
  //       setShowModalBoxDaily(true);
  //       setDisableButton(true);
  //       setMessage({
  //         text: `DEBES ABRIR LA CAJA DE LA SUCURSAL: ${branchName}`,
  //         type: "error",
  //       });
  //     } else {
  //       setDisableButton(false);
  //     }
  //   }
  // }, [boxDaily]);

  /** ----------------------------
   * FUNCIONES AUXILIARES
   * ---------------------------- */
  const calcularTotales = () => {
    let subtotal = 0;
    productos.forEach((prod) => {
      const cantidad = parseFloat(prod.quantity || 0);
      const precioUnit = parseFloat(prod.precio || 0);
      subtotal += cantidad * precioUnit;
    });
    return {
      subtotal: subtotal.toFixed(2),
      total: subtotal.toFixed(2),
    };
  };

  const { total } = calcularTotales();
  let totalPagos = pagos
    .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)
    .toFixed(2);
  let saldo = (total - totalPagos).toFixed(2);

  const handleOpenProductModal = () => {
    if (!origenSucursalSeleccionada) {
      setMessage({ text: "selecciona una sucursal", type: "info" });
      return;
    }
  };

  //     // Buscar nombre de sucursal emisora
  const sucursalOrigenName =
    branches.find((b) => b.id === origenSucursalSeleccionada)?.name ||
    "Sucursal origen";

  const onSubmit = (data) => {
    setMessage({ text: "", type: "info" }); // Limpiar mensaje previo

    // Validación 1: verificar que haya al menos un producto válido
    if (!data.productos || data.productos.length === 0) {
      setMessage({ text: "Debe agregar al menos un producto.", type: "error" });
      return;
    }

    // Validación 2: que todos los productos tengan descripción, precio > 0 y cantidad > 0
    for (let i = 0; i < data.productos.length; i++) {
      const p = data.productos[i];
      if (!p.descripcion || p.descripcion.trim() === "") {
        setMessage({
          text: `Producto #${i + 1}: La descripción es obligatoria.`,
          type: "error",
        });
        return;
      }

      if (!p.quantity || isNaN(p.quantity) || p.quantity <= 0) {
        setMessage({
          text: `Producto #${i + 1}: La cantidad debe ser mayor a 0.`,
          type: "error",
        });
        return;
      }
    }

    // Validación 3: cliente/proveedor obligatorio salvo que sea REMITO
    if (data.tipoFactura !== "REMITO") {
      const entidadId =
        tipoOperacion === "venta" ? data.cliente : data.proveedor;
      if (!entidadId) {
        setMessage({
          text: `Debe seleccionar un ${
            tipoOperacion === "venta" ? "cliente" : "proveedor"
          }.`,
          type: "error",
        });
        return;
      }
    }

    // Validación 5: la fecha no puede ser futura
    const fechaSeleccionada = new Date(data.fecha);
    const hoy = new Date();
    if (fechaSeleccionada > hoy) {
      setMessage({ text: "La fecha no puede ser mayor a hoy.", type: "error" });
      return;
    }

    // Validación 6: saldo >= 0 (no permitir pagos mayores al total)
    const totalFactura = calcularTotales().total;
    const totalPagado = pagos.reduce(
      (sum, p) => sum + parseFloat(p.amount || 0),
      0,
    );
    if (totalPagado > totalFactura) {
      setMessage({
        text: "El total pagado no puede ser mayor al total de la factura.",
        type: "error",
      });
      return;
    }

    const sucursalDestinoName =
      branches.find((b) => b.id === data.destinoSucursal)?.name ||
      "Sucursal destino";
    // Si pasamos todas las validaciones, mostrar mensaje y crear la factura
    setMessage({ text: "Creando factura...", type: "info" });
    const isRemito = data.tipoFactura === "REMITO";
    const payload = {
      boxId: boxDaily[0]?.id,
      type: data.tipoFactura,
      emissionDate: fechaSeleccionada.toISOString(),
      emissionBranchId: data.origenSucursal,
      emissionBranchName: sucursalOrigenName,
      destinationBranchName: sucursalDestinoName,
      destinationBranchId: data.destinoSucursal,
      contactId: !isRemito
        ? tipoOperacion === "venta"
          ? data.cliente
          : data.proveedor
        : undefined,
      contactName: !isRemito ? selectedEntidadName : undefined,
      currency: "ARS",

      conditionPayment: !isRemito
        ? totalPagado < totalFactura
          ? "CREDIT"
          : "CASH"
        : undefined,
      exchangeRate: data.exchangeRate || undefined,
      products: data.productos.map((p) => ({
        branchId: p.branchId,
        productId: p.productId,
        isReserved: p.isReserved,
        description: p.descripcion,
        quantity: parseFloat(p.quantity),
        price: parseFloat(p.precio),
      })),
      totalAmount: parseFloat(totalFactura),
      paidAmount: parseFloat(totalPagado),

      available: true,
      createdBy: selectedEntidadNameSeller || setUser.id,
      emittedBy: selectedEntidadNameSeller || setUser.id,
      deliveredBy: selectedEntidadNameSeller || setUser.id,
      observation: data.observation || undefined,
      initialPayment: pagos.map((payment) => ({
        method: payment.method,
        amount: parseFloat(payment.amount),
        currency: payment.currency || "ARS",
        receivedBy: setUser.id,
        bankId: payment.bankId || undefined,
        branchId: origenSucursalSeleccionada,
        branchName: sucursalOrigenName,
        cardId: payment.cardId || undefined,
        chequeNumber: payment.chequeNumber || undefined,
        chequeBank: payment.chequeBank,
        chequeDueDate: payment.chequeDueDate || undefined,
        chequeStatus: payment.chequeStatus || undefined,
        receivedAt:
          payment.receivedAt ||
          new Date(
            new Date().getTime() - new Date().getTimezoneOffset() * 60000,
          )
            .toISOString()
            .split("T")[0],
      })),
    };

    createVoucher(payload, {
      onSuccess: (response) => {
        if (response.data.status >= 400) return;
        notifyVoucher({
          payload,
          data,
          setUser,
          numeroGenerado,
          notify,
        });
        selectedEntidadName && setSelectedEntidadName("");
        selectedEntidadNameSeller && setSelectedEntidadNameSeller("");
        selectedEntidadInvoice && setSelectedEntidadInvoice("");

        // TODO: ELIMINACION DE CHEQUE DE TERCERO
        if (payload.initialPayment.length > 0) {
          pagos.map((payment) => {
            if (payment.method === "CHEQUE_TERCERO") {
              deleteCheckBook(payment?.id);
            }
          });
        }
        setPagos([]);
        reset();
      },
    });
  };
  return (
    <>
      {/* {showModalBoxDaily && (
        <BoxDailyOpenModal
          setShowModalBoxDaily={setShowModalBoxDaily}
          setMessage={setMessage}
          openedBy={setUser?.name}
          origenSucursalSeleccionada={origenSucursalSeleccionada}
          branchName={branchName}
          onClose={() => setShowModalBoxDaily(false)}
        />
      )} */}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-md space-y-4 h-full mt-6"
      >
        <div className="grid grid-cols-2 gap-4 px-5 relative">
          {/* INFORMACION DEL COMPROBANTE */}
          <div className="col-span-2 flex w-full justify-center gap-2 bg-[var(--brown-ligth-100)] p-5 rounded-md">
            {/* TIPO DE COMPROBANTE */}
            <div className="w-full">
              <LabelInvoice text={"Tipo de comprobante"} optional={false} />
              <select
                {...register("tipoFactura", { required: true })}
                className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2 bg-[var(--brown-ligth-50)]"
              >
                {tiposFactura.map((fact) => (
                  <option key={fact.value} value={fact.value}>
                    {fact.label}
                  </option>
                ))}
              </select>
            </div>

            {/* ORIGEN DE COMPROBANTE */}
            <div className="w-full">
              <LabelInvoice text={"Origen (Sucursal)"} />
              <select
                {...register("origenSucursal", { required: true })}
                className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2 bg-[var(--brown-ligth-50)]"
              >
                <option value="">Seleccionar sucursal</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* FECHA Y NUMERACIÓN */}
          <div className="col-span-2 flex w-full justify-center gap-2 bg-[var(--brown-ligth-100)] p-5 rounded-md">
            {/* FECHA DEL COMPROBANTE */}
            <div className="w-full">
              <LabelInvoice text={"Fecha"} />
              <input
                type="date"
                {...register("fecha", { required: "La fecha es obligatoria" })}
                className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2 bg-[var(--brown-ligth-50)]"
              />
              {errors.fecha && (
                <span className="text-red-600 text-sm">
                  {errors.fecha.message}
                </span>
              )}
            </div>

            {/* NUMERACION DEL COMPROBANTE */}
            <div className="w-full">
              <LabelInvoice
                text={"Numeración de comprobante"}
                optional={false}
              />

              <input
                type="text"
                className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-[6.8px] bg-[var(--brown-ligth-50)]"
                placeholder="F-0001"
                value={
                  !origenSucursalSeleccionada
                    ? "Selecciona una sucursal"
                    : numeroGenerado?.number || "Generando..."
                }
                readOnly
              />
            </div>
          </div>

          {/* CONTACTO Y VENDEDOR */}
          <div className="col-span-2 flex w-full justify-center gap-2 bg-[var(--brown-ligth-100)] p-5 rounded-md">
            {/* VENDEDOR */}
            {watch("tipoFactura") !== "REMITO" && tipoOperacion === "venta" ? (
              <div className="relative w-full">
                <LabelInvoice text="Vendedor" />
                <input
                  type="text"
                  value={selectedEntidadNameSeller}
                  placeholder="Clickea Icono"
                  className="w-full bg-[var(--brown-ligth-50)] border border-[var(--brown-ligth-400)] rounded px-3 py-2"
                  disabled={true}
                  onFocus={() => {
                    origenSucursalSeleccionada &&
                      setShowContactModalSeller(true);
                    !origenSucursalSeleccionada && handleOpenProductModal();
                  }}
                />

                <span className="absolute right-2 top-12 transform -translate-y-1/2 cursor-pointer">
                  <div className="flex gap-2">
                    {selectedEntidadNameSeller && (
                      <span onClick={() => setSelectedEntidadNameSeller("")}>
                        <Delete />
                      </span>
                    )}
                    <span
                      onClick={() => {
                        origenSucursalSeleccionada &&
                          setShowContactModalSeller(true);
                        !origenSucursalSeleccionada && handleOpenProductModal();
                      }}
                    >
                      <PeopleTick color="#292828" size="24" />
                    </span>
                  </div>
                </span>
              </div>
            ) : (
              ""
            )}

            {/* CONTACTO */}
            <div className="relative w-full">
              {watch("tipoFactura") !== "REMITO" ? (
                <div className="relative">
                  <LabelInvoice
                    text={tipoOperacion === "venta" ? "Cliente" : "Proveedor"}
                  />
                  <input
                    type="text"
                    value={selectedEntidadName}
                    placeholder="Clickear Icono"
                    className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2 bg-[var(--brown-ligth-50)]"
                    disabled={true}
                    onFocus={() => {
                      origenSucursalSeleccionada && setShowContactModal(true);
                      !origenSucursalSeleccionada && handleOpenProductModal();
                    }}
                  />
                  {!origenSucursalSeleccionada && (
                    <p className="text-red-700 flex items-center gap-2 pt-1">
                      <Danger color="red" size={"20"} />
                      Debes seleccionar una sucursal
                    </p>
                  )}
                  <span className="absolute right-2 top-12 transform -translate-y-1/2 cursor-pointer">
                    <div className="flex gap-2">
                      {selectedEntidadName && (
                        <span onClick={() => setSelectedEntidadName("")}>
                          <Delete />
                        </span>
                      )}
                      <span
                        onClick={() => {
                          origenSucursalSeleccionada &&
                            setShowContactModal(true);
                          !origenSucursalSeleccionada &&
                            handleOpenProductModal();
                        }}
                      >
                        <PeopleTick color="#292828" size="24" />
                      </span>
                    </div>
                  </span>
                </div>
              ) : (
                <div className="flex gap-2 w-full">
                  <div className="w-full">
                    <LabelInvoice text={"Destino (sucursal)"} />
                    <select
                      {...register("destinoSucursal", { required: true })}
                      className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2 bg-[var(--brown-ligth-50)]"
                    >
                      <option value="">Seleccionar sucursal</option>
                      {branches.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* VINCULACION FACATURA / P */}
          {watch("tipoFactura") !== "REMITO" &&
            watch("tipoFactura") !== "FACTURA" &&
            watch("tipoFactura") !== "P" && (
              <div className="col-span-2 flex w-full justify-center gap-2 bg-[var(--brown-ligth-100)] p-5 rounded-md">
                <div className="relative w-full">
                  <LabelInvoice text="Comprobante a vincular" />
                  <input
                    type="text"
                    value={selectedEntidadInvoice}
                    placeholder="0001"
                    className="w-full bg-[var(--brown-ligth-50)] border border-[var(--brown-ligth-400)] rounded px-3 py-2"
                    disabled={true}
                    onFocus={() => {
                      origenSucursalSeleccionada &&
                        setShowInvoicesToConnect(true);
                      !origenSucursalSeleccionada && handleOpenProductModal();
                    }}
                  />
                  {!origenSucursalSeleccionada && (
                    <p className="text-red-700 flex items-center gap-2 pt-1">
                      <Danger color="red" size={"20"} />
                      Debes seleccionar sucursal
                    </p>
                  )}

                  <span className="absolute right-2 top-12 transform -translate-y-1/2 cursor-pointer">
                    <div className="flex gap-2">
                      {selectedEntidadInvoice && (
                        <span onClick={() => setSelectedEntidadInvoice("")}>
                          <Delete />
                        </span>
                      )}
                      <span
                        onClick={() => {
                          origenSucursalSeleccionada &&
                            setShowInvoicesToConnect(true);
                          !origenSucursalSeleccionada &&
                            handleOpenProductModal();
                        }}
                      >
                        <InvoiceIcon color="#292828" size="24" />
                      </span>
                    </div>
                  </span>
                </div>
              </div>
            )}

          {/* OBSERVACION */}
          <div className="col-span-2 flex w-full justify-center gap-2 bg-[var(--brown-ligth-100)] p-5 rounded-md">
            <div className="w-full">
              <LabelInvoice text="Observación" optional={true} />
              <input
                {...register("observation")}
                type="text"
                className="w-full bg-[var(--brown-ligth-50)] border border-[var(--brown-ligth-400)] rounded px-3 py-2"
                placeholder="Agregar Observacón"
              />
            </div>
          </div>
        </div>

        {/* PRODUCTOS */}
        <div className="space-y-2 px-5">
          <div className="grid grid-cols-5 gap-2 font-medium text-[var(--brown-dark-950)] bg-[var(--brown-ligth-200)] rounded-t-md px-4 py-2 border border-[var(--brown-ligth-400)]">
            <div className="text-start">DESCRIPCIÓN</div>
            <div className="text-end">PRECIO</div>
            <div className="text-end">CANTIDAD</div>
            <div className="text-end">RESERVAR</div>
            <div className="text-center">BORRAR</div>
          </div>

          {fields.map((item, index) => (
            <div
              key={item.id}
              className="relative grid grid-cols-6 gap-2 items-center"
            >
              <div className="col-span-2">
                <button
                  type="button"
                  onClick={() => {
                    !origenSucursalSeleccionada && handleOpenProductModal();
                    origenSucursalSeleccionada && handleOpenProductModal();
                    origenSucursalSeleccionada &&
                      setSelectedProductIndex(index);
                    origenSucursalSeleccionada && setShowProductModal(true);
                  }}
                  className="w-full text-left border border-[var(--brown-ligth-400)] rounded px-2 py-1 bg-[var(--brown-ligth-50)]"
                >
                  {watch(`productos.${index}.descripcion`) ||
                    "Seleccionar producto..."}
                </button>
              </div>

              <FormattedNumberInput
                name={`productos.${index}.precio`}
                control={control}
                className="border border-[var(--brown-ligth-400)] rounded px-2 py-1 text-right bg-[var(--brown-ligth-50)]"
              />

              <input
                type="number"
                step="1"
                {...register(`productos.${index}.quantity`, {
                  required: true,
                  min: 1,
                })}
                className="border border-[var(--brown-ligth-400)] rounded px-2 py-1 text-right bg-[var(--brown-ligth-50)]"
              />
              <input
                type="checkbox"
                {...register(`productos.${index}.isReserved`)}
                className="border border-[var(--brown-ligth-400)] rounded px-2 py-1 text-right bg-[var(--brown-ligth-50)]"
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="justify-self-center cursor-pointer"
              >
                <Delete />
              </button>
            </div>
          ))}

          <div className="flex justify-center">
            <button
              type="button"
              onClick={() =>
                append({
                  descripcion: "",
                  precio: 0.0,
                  quantity: 1,
                  isReserved: false,
                })
              }
              className="text-[var(--brown-dark-900)] border border-[var(--brown-ligth-400)] rounded-full w-8 h-8 flex items-center justify-center hover:bg-brown-100"
            >
              <span className="text-3xl text-[var(--brown-dark-950)] font-medium pb-[.5px]">
                +
              </span>
            </button>
          </div>
        </div>

        <div className="flex justify-between px-12 items-end w-full">
          <div className="flex flex-col gap-1">
            <Button
              text="Generar Pago"
              type="button"
              onClick={() => setShowPaymentModal(true)}
              disabled={disableButton ? true : false}
            />
            <Button
              type="submit"
              text="Guardar Factura"
              disabled={disableButton ? true : false}
            />
          </div>
          <div className="text-right space-y-1 text-brown-900 font-medium">
            <FormattedAmount label="Total:" value={total} />{" "}
            <FormattedAmount
              label="Pagos:"
              value={totalPagos}
              color="text-green-800"
            />{" "}
            <FormattedAmount
              label="Saldo:"
              color="text-red-800"
              value={saldo}
            />{" "}
          </div>
        </div>
      </form>
      {showPaymentModal && (
        <RegisterPaymentModal
          voucherType={tipoFactura}
          tipoOperacion={tipoOperacion}
          saldo={saldo}
          onClose={() => setShowPaymentModal(false)}
          onRegister={(nuevoPago) => {
            console.log(nuevoPago);
            // Si es un array, es porque se está reemplazando la lista
            if (Array.isArray(nuevoPago)) {
              setPagos(nuevoPago);
            } else {
              setPagos((prev) => [...prev, nuevoPago]);
            }
          }}
          hasProducts={productos.length > 0}
          payments={pagos}
        />
      )}

      {/* CONTACTO CLIENTE / PROVEEDOR */}
      <ContactCreateModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        tipo={campoEntidad}
        onSelect={(contact) => {
          setValue(campoEntidad, contact?.id);
          setMessage({
            text: `Seleccionaste a ${contact?.name}`,
            type: "success",
          }); // notifica al padre
          setSelectedEntidadName(contact?.name);
        }}
        branchId={origenSucursal}
      />

      {/* VINCULACION DE FACTURAS */}
      <CreditNoteModal
        isOpen={showInvoicesToConnect}
        onClose={() => setShowInvoicesToConnect(false)}
        onSelect={(invoice) => {
          setValue("invoiceId", invoice?.id);

          setMessage({
            text: `Seleccionaste factura: ${invoice?.number}`,
            type: "success",
          }); // notifica al padre
          setSelectedEntidadInvoice(invoice?.number);

          if (invoice?.products?.length) {
            remove();
            append(
              invoice.products.map((p) => ({
                productId: p.productId,
                id: p.id,
                branchId: p.branchId,
                descripcion: p.description,
                quantity: p.quantity,
                precio: p.price,
                isReserved: p.isReserved,
              })),
            );

            // ✅ Ahora cargamos los pagos
            if (invoice?.payments?.length) {
              setPagos(
                invoice.payments.map((pay) => ({
                  amount: pay?.amount,
                  bankId: pay?.bankId,
                  cardId: pay?.cardId,
                  currency: pay?.currency,
                  method: pay?.method,
                  observation: pay?.observation,
                })),
              );
            } else {
              setPagos([]); // Si no hay pagos, dejamos vacío
            }
          }
        }}
        tipo={tipoFactura}
        branchId={origenSucursal}
        selectedEntidadNameSeller={selectedEntidadNameSeller}
        selectedEntidadName={selectedEntidadName}
      />

      {/* VENDEDOR */}
      <ContactCreateModal
        isOpen={showContactModalSeller}
        onClose={() => setShowContactModalSeller(false)}
        tipo={campoEntidadSeller}
        onSelect={(contact) => {
          setValue(campoEntidadSeller, contact?.id);
          setMessage({
            text: `Seleccionaste a ${contact?.name}`,
            type: "success",
          }); // notifica al padre
          setSelectedEntidadNameSeller(contact?.name);
        }}
        branchId={origenSucursal}
      />

      <ProductSearchModal
        isOpen={showProductModal}
        branchId={origenSucursal}
        onClose={() => setShowProductModal(false)}
        index={selectedProductIndex}
        onSelect={(producto, index) => {
          const productosActuales = watch("productos");
          const existenteIndex = productosActuales.findIndex(
            (p) =>
              p.productId === producto.productId &&
              p.branchId === producto.branchId,
          );

          if (existenteIndex !== -1 && existenteIndex !== index) {
            // Si ya existe en otra fila, sumamos la cantidad
            const cantidadActual =
              parseFloat(productosActuales[existenteIndex].quantity) || 0;
            setValue(
              `productos.${existenteIndex}.quantity`,
              cantidadActual + 1,
            );
            // Opcional: borrar la fila en la que ibas a ponerlo
            remove(index);
          } else {
            // Si no existe, lo seteamos normalmente
            setValue(`productos.${index}.productId`, producto.productId);
            setValue(`productos.${index}.branchId`, producto.branchId);
            setValue(`productos.${index}.descripcion`, producto.descripcion);
            setValue(`productos.${index}.precio`, producto.precio || 0);
          }
        }}
      />
    </>
  );
};

export default CreateInvoice;
