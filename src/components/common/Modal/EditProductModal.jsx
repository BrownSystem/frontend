import React, { useState } from "react";
import { useForm } from "react-hook-form";
import noImage from "../../../assets/images/sin-imagen.png";
import Modal from "./Modal";
import { Close } from "../../../assets/icons";

const EditProductModal = ({ onClose, product, onSubmitEdit }) => {
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      name: product?.name || "",
      descripcion: product?.descripcion || "",
      code: product?.code || "",
      color: product?.color || "",
      price: product?.price || "",
    },
  });

  const [preview, setPreview] = useState(product?.image || noImage);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setValue("image", file);
    }
  };

  const onSubmit = (data) => {
    onSubmitEdit(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[1000000000] bg-[var(--brown-dark-800)]/20 p-4 ">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-3 w-[900px] max-w-full rounded-lg overflow-hidden bg-white py-2 px-4"
      >
        {/* Columna 1 - Imagen */}
        <div className="flex w-full p-4 flex-col items-center  ">
          <img
            src={preview}
            alt="Vista previa"
            className="rounded-xl object-cover w-[250px] h-[250px] mb-4"
          />

          {/* Input oculto */}
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            {...register("image")}
            onChange={handleImageChange}
            className="hidden"
          />

          {/* Label que actúa como botón */}
          <label
            htmlFor="image-upload"
            className="cursor-pointer bg-[var(--brown-ligth-400)] hover:bg-[var(--brown-dark-700)] text-white font-semibold py-2 px-4 rounded-xl text-sm"
          >
            Cargar imagen
          </label>
        </div>

        {/* Columna 2 - Parte 1 del formulario */}
        <div className="p-4">
          <div className="mb-2">
            <label className="text-brown-800 font-semibold block">Nombre</label>
            <input
              {...register("name")}
              className="w-full border border-[var(--brown-ligth-300)] rounded px-3 py-2"
              placeholder="Nombre del producto"
            />
          </div>

          <div className="mb-2">
            <label className="text-brown-800 font-semibold block">Código</label>
            <input
              {...register("code")}
              className="w-full border border-[var(--brown-ligth-300)] rounded px-3 py-2"
              placeholder="Código interno"
            />
          </div>

          <div className="mb-2">
            <label className="text-brown-800 font-semibold block">Color</label>
            <input
              {...register("color")}
              className="w-full border border-[var(--brown-ligth-300)] rounded px-3 py-2"
              placeholder="Color"
            />
          </div>
          <button className="bg-black hover:bg-[var(--brown-ligth-300)] text-white font-semibold py-2 px-4 rounded-xl w-full col-span-2 mt-3 cursor-pointer">
            Eliminar Producto
          </button>
        </div>

        {/* Columna 3 - Parte 2 del formulario */}
        <div className="p-4 relative">
          <div
            className="absolute right-4 top-0 cursor-pointer"
            onClick={onClose}
          >
            <Close />
          </div>

          <div className="mb-2">
            <label className="text-brown-800 font-semibold block">
              Descripción
            </label>
            <textarea
              {...register("descripcion")}
              rows={4}
              className="w-full border border-[var(--brown-ligth-300)] rounded px-3 py-2 resize-none"
              placeholder="Descripción del producto"
            />
          </div>

          <div className="mb-4">
            <label className="text-brown-800 font-semibold block">Precio</label>
            <input
              type="number"
              step="0.01"
              {...register("price")}
              className="w-full border border-[var(--brown-ligth-300)] rounded px-3 py-2"
              placeholder="$0.00"
            />
          </div>

          <button
            type="submit"
            className="bg-[var(--brown-ligth-400)] hover:bg-[var(--brown-dark-700)] text-white font-semibold py-2 px-4 rounded-xl w-full col-span-2 cursor-pointer"
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProductModal;
