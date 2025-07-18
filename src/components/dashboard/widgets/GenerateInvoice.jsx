import React, { useMemo, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { CreateUser, Delete, Foreign } from "../../../assets/icons";
import Button from "./Button";
import {
  ContactCreateModal,
  ProductSearchModal,
  RegisterPaymentModal,
} from "../../common";
import { useSearchContacts } from "../../../api/contacts/contacts.queries";
import { useAuthStore } from "../../../api/auth/auth.store";
import { useFindAllBranch } from "../../../api/branch/branch.queries";
import { useCreateVoucher } from "../../../api/vouchers/vouchers.queries";
import Message from "./Message";

const CreateInvoice = ({ tipoOperacion, tipoComprobante }) => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fecha: new Date().toISOString().split("T")[0],
      proveedor: "",
      cliente: "",
      numeroFactura: "",
      letra: "P",
      tipoFactura: tipoComprobante === "factura" ? "P" : "NCA",
      condicionPago: "Contado",
      productos: [
        {
          descripcion: "",
          precio: 0,
          quantity: 1,
        },
      ],
    },
  });

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pagos, setPagos] = useState([]);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProductIndex, setSelectedProductIndex] = useState(null);
  const [selectedProductEqual, setSelectedProductEqual] = useState(false);
  const [searchEntidad, setSearchEntidad] = useState("");
  const [selectedEntidadName, setSelectedEntidadName] = useState("");
  const [message, setMessage] = useState({ text: "", type: "info" });

  const condicionesPago = ["Contado", "Cuenta Corriente"];

  const tiposFactura = useMemo(() => {
    if (tipoComprobante === "factura") {
      return [
        { value: "P", label: "P" },
        { value: "REMITO", label: "REMITO" },
        // { value: "A", label: "FACTURA A" },
        // { value: "B", label: "FACTURA B" },
      ];
    }
    return [
      { value: "NCA", label: "Nota de Crédito A" },
      { value: "NCB", label: "Nota de Crédito B" },
    ];
  }, [tipoComprobante]);

  const campoEntidad = tipoOperacion === "venta" ? "cliente" : "proveedor";
  const tipoEntidad = tipoOperacion === "venta" ? "CLIENT" : "SUPPLIER";

  const productos = watch("productos");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "productos",
  });

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
  const totalPagos = pagos
    .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)
    .toFixed(2);
  const saldo = (total - totalPagos).toFixed(2);

  const setUser = useAuthStore((state) => state.user);
  const { data: branches = [] } = useFindAllBranch();
  const { mutate: createVoucher, isPending: savingInvoice } = useCreateVoucher({
    onSuccess: () => {
      setMessage({ text: "Factura creada correctamente", type: "success" });
      // reset(); si querés limpiar el formulario
    },
    onError: (error) => {
      const msg =
        error?.response?.data?.message || "Hubo un error al crear la factura";
      setMessage({ text: msg, type: "error" });
      console.error("Error al crear factura:", error);
    },
  });

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
      if (!p.precio || isNaN(p.precio) || p.precio <= 0) {
        setMessage({
          text: `Producto #${i + 1}: El precio debe ser mayor a 0.`,
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

    // Validación 4: número de factura obligatorio salvo que sea REMITO
    if (data.tipoFactura !== "REMITO") {
      if (!data.numeroFactura || data.numeroFactura.trim() === "") {
        setMessage({
          text: "El número de factura es obligatorio.",
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
      0
    );
    if (totalPagado > totalFactura) {
      setMessage({
        text: "El total pagado no puede ser mayor al total de la factura.",
        type: "error",
      });
      return;
    }

    // Si pasamos todas las validaciones, mostrar mensaje y crear la factura
    setMessage({ text: "Creando factura...", type: "info" });

    const isRemito = data.tipoFactura === "REMITO";

    const payload = {
      type: data.tipoFactura,
      number: isRemito ? undefined : data.numeroFactura,
      emissionDate: fechaSeleccionada.toISOString(),
      emissionBranchId: setUser.branchId,
      emissionBranchName: setUser.branchId,
      destinationBranchId: isRemito ? data.destinoSucursal : undefined,
      contactId: !isRemito
        ? tipoOperacion === "venta"
          ? data.cliente
          : data.proveedor
        : undefined,
      contactName: !isRemito ? selectedEntidadName : undefined,
      currency: "ARS",
      conditionPayment:
        !isRemito && data.condicionPago === "Contado" ? "CASH" : "CREDIT",
      exchangeRate: data.exchangeRate || undefined,
      products: data.productos.map((p) => ({
        branchId: p.branchId,
        productId: p.productId,
        description: p.descripcion,
        quantity: parseFloat(p.quantity),
        price: parseFloat(p.precio),
      })),
      totalAmount: parseFloat(totalFactura),
      paidAmount: parseFloat(totalPagado),
      available: true,
      createdBy: setUser.id,
      emittedBy: setUser.id,
      deliveredBy: setUser.id,
      observation: data.observation || undefined,
      initialPayment: pagos.map((payment) => ({
        method: payment.method,
        amount: parseFloat(payment.amount),
        currency: payment.currency || "ARS",
        receivedBy: setUser.id,
        bankId: payment.bankId || undefined,
        chequeNumber: payment.chequeNumber || undefined,
        chequeDueDate: payment.chequeDueDate || undefined,
        chequeStatus: payment.chequeStatus || undefined,
        receivedAt: payment.receivedAt || new Date().toISOString(),
      })),
    };

    createVoucher(payload);
  };

  const { data: entidadesFiltradas = [] } = useSearchContacts({
    search: searchEntidad,
    branchId: setUser.branchId,
    type: tipoEntidad,
    limit: 6,
    offset: 1,
  });

  return (
    <>
      <Message
        message={message.text}
        type={message.type}
        duration={3000}
        onClose={() => setMessage({ text: "" })}
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-md space-y-4 h-full"
      >
        <div className="grid grid-cols-2 gap-4 px-5 relative">
          <div>
            <label className="block text-brown-800 font-medium mb-1">
              Tipo de Comprobante
            </label>
            <select
              {...register("tipoFactura", { required: true })}
              className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2 bg-white"
            >
              {tiposFactura.map((fact) => (
                <option key={fact.value} value={fact.value}>
                  {fact.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-brown-800 font-medium mb-1">
              Condición de Pago
            </label>
            <select
              {...register("condicionPago", { required: true })}
              className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2 bg-white"
            >
              {condicionesPago.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-brown-800 font-medium mb-1">
              Fecha
            </label>
            <input
              type="date"
              {...register("fecha", { required: "La fecha es obligatoria" })}
              className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2"
            />
            {errors.fecha && (
              <span className="text-red-600 text-sm">
                {errors.fecha.message}
              </span>
            )}
          </div>

          <div className="relative">
            {watch("tipoFactura") !== "REMITO" ? (
              <div className="relative">
                <label className="block text-brown-800 font-medium mb-1">
                  {tipoOperacion === "venta" ? "Cliente" : "Proveedor"}
                </label>
                <input
                  type="text"
                  value={searchEntidad}
                  onChange={(e) => {
                    setSearchEntidad(e.target.value);
                    setSelectedProductEqual(false);
                  }}
                  placeholder="Buscar por Nombre/DNI"
                  className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2"
                />
                <span
                  className="absolute right-2 top-12 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowContactModal(true)}
                >
                  <CreateUser color="#292828" size="24" />
                </span>
                {searchEntidad &&
                  entidadesFiltradas.data?.length > 0 &&
                  !selectedProductEqual && (
                    <ul className="absolute z-10 bg-white border border-gray-300 rounded w-full mt-1 max-h-40 overflow-auto shadow">
                      {entidadesFiltradas.data.map((entidad) => (
                        <li
                          key={entidad.id}
                          onClick={() => {
                            setSearchEntidad(entidad.name);
                            setSelectedEntidadName(entidad.name);
                            setValue(campoEntidad, entidad.id);
                          }}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                        >
                          {searchEntidad === entidad.name
                            ? setSelectedProductEqual(true)
                            : `${entidad.name} - ${entidad.documentNumber}`}
                        </li>
                      ))}
                    </ul>
                  )}
              </div>
            ) : (
              <div>
                <label className="block text-brown-800 font-medium mb-1">
                  Destino (Sucursal)
                </label>
                <select
                  {...register("destinoSucursal", { required: true })}
                  className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2 bg-white"
                >
                  <option value="">Seleccionar sucursal</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="block text-brown-800 font-medium mb-1">
              Número de Factura
            </label>
            <input
              type="text"
              {...register("numeroFactura", { required: "Obligatorio" })}
              className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2"
              placeholder="F-0001"
            />
          </div>
        </div>

        <div className="space-y-2 px-5">
          <div className="grid grid-cols-4 gap-2 font-medium text-black bg-[#FDF7F1] rounded-t-md px-4 py-2 border border-[var(--brown-ligth-400)]">
            <div className="text-start">DESCRIPCIÓN</div>
            <div className="text-end">PRECIO</div>
            <div className="text-end">CANTIDAD</div>
            <div className="text-center">BORRAR</div>
          </div>

          {fields.map((item, index) => (
            <div
              key={item.id}
              className="relative grid grid-cols-5 gap-2 items-center"
            >
              <div className="col-span-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedProductIndex(index);
                    setShowProductModal(true);
                  }}
                  className="w-full text-left border border-[var(--brown-ligth-400)] rounded px-2 py-1 bg-white"
                >
                  {watch(`productos.${index}.descripcion`) ||
                    "Seleccionar producto..."}
                </button>
              </div>

              <input
                type="number"
                step="0.01"
                {...register(`productos.${index}.precio`, {
                  required: true,
                  min: 0.01,
                })}
                className="border border-[var(--brown-ligth-400)] rounded px-2 py-1 text-right"
              />
              <input
                type="number"
                step="0.01"
                {...register(`productos.${index}.quantity`, {
                  required: true,
                  min: 0.01,
                })}
                className="border border-[var(--brown-ligth-400)] rounded px-2 py-1 text-right"
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
                append({ descripcion: "", precio: 0, quantity: 1 })
              }
              className="text-brown-800 border border-[var(--brown-ligth-400)] rounded-full w-8 h-8 flex items-center justify-center hover:bg-brown-100"
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
            />
            <Button type="submit" text="Guardar Factura" />
          </div>
          <div className="text-right space-y-1 text-brown-900 font-medium">
            <div>
              Total: <span className="font-normal">${total}</span>
            </div>
            <div>
              Pagos:{" "}
              <span className="font-normal text-green-800">${totalPagos}</span>
            </div>
            <div>
              Saldo: <span className="font-normal text-red-800">${saldo}</span>
            </div>
          </div>
        </div>

        <RegisterPaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onRegister={(nuevoPago) => {
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

        <ContactCreateModal
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
          tipo={campoEntidad}
          onSelect={(contact) => {
            setValue(campoEntidad, contact.id);
            setSelectedEntidadName(contact.name);
          }}
          branchId={setUser.branchId}
        />

        <ProductSearchModal
          isOpen={showProductModal}
          onClose={() => setShowProductModal(false)}
          index={selectedProductIndex}
          onSelect={(producto, index) => {
            setValue(`productos.${index}.productId`, producto.productId);
            setValue(`productos.${index}.branchId`, producto.branchId);
            setValue(`productos.${index}.descripcion`, producto.descripcion);
            setValue(`productos.${index}.precio`, producto.precio);
          }}
        />
      </form>
    </>
  );
};

export default CreateInvoice;
