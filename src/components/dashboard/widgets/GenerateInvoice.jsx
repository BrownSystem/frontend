import React, { useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Delete } from "../../../assets/icons";
import Button from "./Button";

// Props: tipoOperacion: 'compra' | 'venta', tipoComprobante: 'factura' | 'notaCredito'
const CreateInvoice = ({ tipoOperacion, tipoComprobante }) => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fecha: "",
      proveedor: "",
      cliente: "",
      numeroFactura: "",
      letra: "A",
      tipoFactura: tipoComprobante === "factura" ? "A" : "NCA",
      condicionIVA: "",
      condicionPago: "Contado",
      productos: [
        {
          codigoIva: "1",
          codigo: "",
          descripcion: "",
          precio: 0,
          quantity: 1,
        },
      ],
    },
  });

  const ivaOptions = {
    1: 10.5,
    2: 21.5,
    3: 27,
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const condicionesIVA_B = [
    "IVA Sujeto Exento",
    "Consumidor Final",
    "Sujeto No Categorizado",
    "Proveedor del Exterior",
    "Cliente del Exterior",
    "IVA Liberado - Ley Nº 19.640",
    "IVA No Alcanzado",
  ];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const condicionesIVA_A = [
    "Responsable Inscripto",
    "Monotributista",
    "Exento",
  ];
  const condicionesPago = ["Contado", "Cuenta Corriente"];

  const tiposFactura = useMemo(() => {
    if (tipoComprobante === "factura") {
      return [
        { value: "A", label: "Factura A" },
        { value: "B", label: "Factura B" },
      ];
    }
    return [
      { value: "NCA", label: "Nota de Crédito A" },
      { value: "NCB", label: "Nota de Crédito B" },
    ];
  }, [tipoComprobante]);

  const tipoFactura = watch("tipoFactura");
  const productos = watch("productos");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "productos",
  });

  const calcularTotales = () => {
    let subtotal = 0;
    let totalIva = 0;

    productos.forEach((prod) => {
      const cantidad = parseFloat(prod.quantity || 0);
      const precioUnit = parseFloat(prod.precio || 0);
      const codigoIva = parseInt(prod.codigoIva);
      const porcentajeIva = ivaOptions[codigoIva] || 0;
      const neto = cantidad * precioUnit;
      const iva = neto * (porcentajeIva / 100);

      subtotal += neto;
      totalIva += iva;
    });

    return {
      subtotal: subtotal.toFixed(2),
      totalIva: totalIva.toFixed(2),
      total: (subtotal + totalIva).toFixed(2),
    };
  };

  const { subtotal, totalIva, total } = calcularTotales();

  const onSubmit = (data) => {
    console.log("Factura completa:", data);
  };

  const condicionesIVA = useMemo(
    () => (tipoFactura.startsWith("A") ? condicionesIVA_A : condicionesIVA_B),
    [condicionesIVA_A, condicionesIVA_B, tipoFactura]
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-md space-y-4 h-full"
    >
      <div className="grid grid-cols-2 gap-4 px-5">
        {/* Tipo de comprobante */}
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

        {/* Condición IVA */}
        <div>
          <label className="block text-brown-800 font-medium mb-1">
            Condición frente al IVA
          </label>
          <select
            {...register("condicionIVA", { required: true })}
            className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2 bg-white"
          >
            <option value="">Seleccione</option>
            {condicionesIVA.map((cond) => (
              <option key={cond} value={cond}>
                {cond}
              </option>
            ))}
          </select>
        </div>

        {/* Condición de pago */}
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

        {/* Fecha */}
        <div>
          <label className="block text-brown-800 font-medium mb-1">Fecha</label>
          <input
            type="date"
            {...register("fecha", { required: "La fecha es obligatoria" })}
            className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2"
          />
          {errors.fecha && (
            <span className="text-red-600 text-sm">{errors.fecha.message}</span>
          )}
        </div>

        {/* Cliente / Proveedor */}
        <div>
          <label className="block text-brown-800 font-medium mb-1">
            {tipoOperacion === "venta" ? "Cliente" : "Proveedor"}
          </label>
          <input
            type="text"
            {...register(tipoOperacion === "venta" ? "cliente" : "proveedor", {
              required: `${
                tipoOperacion === "venta" ? "Cliente" : "Proveedor"
              } requerido`,
            })}
            className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2"
          />
        </div>

        {/* Número de factura */}
        <div>
          <label className="block text-brown-800 font-medium mb-1">
            Número de Factura
          </label>
          <input
            type="text"
            {...register("numeroFactura", { required: "Obligatorio" })}
            className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2"
          />
        </div>
      </div>

      {/* Productos */}
      <div className="space-y-2 px-5">
        <div className="grid grid-cols-7 gap-2 font-medium text-black bg-[#FDF7F1] rounded-t-md px-4 py-2 border border-[var(--brown-ligth-400)]">
          <div>IVA</div>
          <div className="col-span-2">Código</div>
          <div className="text-start">Descripción</div>
          <div className="text-center">Precio</div>
          <div className="text-center">Cantidad</div>
          <div className="text-center">Borrar</div>
        </div>

        {fields.map((item, index) => (
          <div key={item.id} className="grid grid-cols-7 gap-2 items-center">
            <select
              {...register(`productos.${index}.codigoIva`)}
              className="border border-[var(--brown-ligth-400)] rounded px-2 py-1"
            >
              <option value="1">10.5%</option>
              <option value="2">21.5%</option>
              <option value="3">27%</option>
            </select>
            <input
              type="text"
              {...register(`productos.${index}.codigo`)}
              className="border border-[var(--brown-ligth-400)] rounded px-2 py-1"
            />
            <input
              type="text"
              {...register(`productos.${index}.descripcion`)}
              className="col-span-2 border border-[var(--brown-ligth-400)] rounded px-2 py-1"
            />
            <input
              type="number"
              step="0.01"
              {...register(`productos.${index}.precio`)}
              className="border border-[var(--brown-ligth-400)] rounded px-2 py-1 text-right"
            />
            <input
              type="number"
              step="0.01"
              {...register(`productos.${index}.quantity`)}
              className="border border-[var(--brown-ligth-400)] rounded px-2 py-1 text-right"
            />
            <button
              type="button"
              onClick={() => remove(index)}
              className="justify-self-center cursor-pointer"
            >
              <Delete color={"#cb963b"} />
            </button>
          </div>
        ))}

        <div className="flex justify-center">
          <button
            type="button"
            onClick={() =>
              append({
                codigoIva: "1",
                codigo: "",
                descripcion: "",
                precio: 0,
                quantity: 1,
              })
            }
            className="text-brown-800 border border-[var(--brown-ligth-400)] rounded-full w-8 h-8 flex items-center justify-center hover:bg-brown-100"
          >
            <span className="text-3xl text-[var(--brown-dark-950)] font-medium pb-[.5px]">
              +
            </span>
          </button>
        </div>
      </div>

      {/* Totales */}
      <div className="flex justify-between px-12 items-end w-full">
        <div className="flex flex-col gap-1">
          <button
            type="button"
            className="cursor-pointer border-[1px] border-[var(--brown-ligth-400)] text-[var(--brown-dark-950)] px-6 py-2 rounded hover:bg-brown-700 hover:text-white hover:border-transparent hover:bg-[var(--brown-dark-950)]"
          >
            Cancelar
          </button>
          <Button text="Guardar Factura" />
        </div>
        <div className="text-right space-y-1 text-brown-900 font-medium">
          <div>
            Subtotal: <span className="font-normal">${subtotal}</span>
          </div>
          <div>
            IVA: <span className="font-normal">${totalIva}</span>
          </div>
          <div>
            Total: <span className="font-normal">${total}</span>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreateInvoice;
