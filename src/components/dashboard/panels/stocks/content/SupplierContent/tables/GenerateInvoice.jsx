import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Delete } from "../../../../../../../assets/icons";
import { Button } from "../../../../../widgets";

const ivaOptions = {
  1: 10.5,
  2: 21.5,
  3: 27,
};

const CreateInvoice = () => {
  const { register, control, handleSubmit, watch } = useForm({
    defaultValues: {
      fecha: "",
      proveedor: "",
      numeroFactura: "",
      letra: "",
      productos: [{ codigoIva: "", codigo: "", descripcion: "", precio: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "productos",
  });

  const productos = watch("productos");

  const calcularTotales = () => {
    let subtotal = 0;
    let totalIva = 0;

    productos.forEach((prod) => {
      const precio = parseFloat(prod.precio) || 0;
      const codigoIva = parseInt(prod.codigoIva);
      const porcentajeIva = ivaOptions[codigoIva] || 0;

      const totalProducto = precio;
      const ivaProducto = totalProducto * (porcentajeIva / 100);

      subtotal += totalProducto;
      totalIva += ivaProducto;
    });

    return {
      subtotal: subtotal.toFixed(2),
      totalIva: totalIva.toFixed(2),
      total: (subtotal + totalIva).toFixed(2),
    };
  };

  const { subtotal, totalIva, total } = calcularTotales();

  const onSubmit = (data) => {
    console.log("Datos de la factura:", data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-md  space-y-4 overflow-y-scroll h-[280px]"
    >
      {/* Datos de factura */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-brown-800 font-medium mb-1">Fecha</label>
          <input
            type="text"
            placeholder="dd/mm/yyyy"
            {...register("fecha")}
            className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-brown-800 font-medium mb-1">
            Proveedor
          </label>
          <select
            {...register("proveedor")}
            className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2 bg-white"
          >
            <option value="">Seleccione</option>
            <option value="Proveedor A">Proveedor A</option>
            <option value="Proveedor B">Proveedor B</option>
          </select>
        </div>
        <div>
          <label className="block text-brown-800 font-medium mb-1">
            Número de Factura
          </label>
          <input
            type="text"
            {...register("numeroFactura")}
            className="w-full border border-[var(--brown-ligth-400)] rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-brown-800 font-medium mb-1">Letra</label>
          <input
            type="text"
            {...register("letra")}
            className="w-[100px] border border-[var(--brown-ligth-400)] rounded px-3 py-2"
          />
        </div>
      </div>

      {/* Productos */}
      <div className="space-y-2">
        <div className="grid grid-cols-6 gap-2 font-medium text-black bg-[#FDF7F1] rounded-t-md px-4 py-2 border border-[var(--brown-ligth-400)]">
          <div>Código de IVA</div>
          <div className="col-span-2">Código de producto</div>
          <div className="text-start">Descripción</div>
          <div className="text-center">Precio</div>
          <div className="text-center">Borrar</div> {/* NUEVO */}
        </div>

        {fields.map((item, index) => (
          <div key={item.id} className="grid grid-cols-6 gap-2 items-center">
            <input
              type="number"
              {...register(`productos.${index}.codigoIva`)}
              className="border border-[var(--brown-ligth-400)] rounded px-2 py-1"
            />
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
              append({ codigoIva: "", codigo: "", descripcion: "", precio: 0 })
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
      <div className="flex justify-between px-10 items-end w-full">
        <div className="flex flex-col gap-1">
          <button
            type="submit"
            className="cursor-pointer border-[1px] border-[var(--brown-ligth-400)] text-[var(--brown-dark-950)] px-6 py-2 rounded hover:bg-brown-700 hover:text-white hover:border-transparent hover:bg-[var(--brown-dark-950)]"
          >
            Cancelar
          </button>
          <Button text={"Guardar Factura"} />
        </div>
        <div>
          <div className="flex gap-2">
            <span className="font-medium">Subtotal:</span>
            <span>${subtotal}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-medium">IVA:</span>
            <span>${totalIva}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-medium">Total:</span>
            <span>${total}</span>
          </div>
        </div>
      </div>

      {/* Guardar */}
    </form>
  );
};

export default CreateInvoice;
