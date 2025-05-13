import React from "react";
import { Edit, SearchIcon } from "../../../../../../../assets/icons";
import { EditProductModal } from "../../../../../../common";
import { FiltroDropdown } from "../../../../../widgets";
const products = [
  {
    code: "PD12949UXLM",
    color: "0030854",
    priceGene: 300.311,
    stock: 0,
    descripcion: "180 x 180 x 69cm",
    name: "Mesa de Roble Macizo",
  },
  {
    code: "FS12945UFLM",
    color: "0030854",
    priceGene: 300.311,
    stock: 1,
    descripcion: "180 x 180 x 69cm",
    name: "Silla Tapizada de Cuero",
  },
  {
    code: "TT32945TMLM",
    color: "0030854",
    priceGene: 475.5,
    stock: 1,
    descripcion: "180 x 180 x 69cm",
    name: "Sofá Esquinero de Lino",
  },
  {
    code: "FS12945UFLM",
    color: "0030854",
    priceGene: 300.311,
    stock: 2,
    descripcion: "180 x 180 x 70cm",
    name: "Silla Tapizada de Cuero",
  },
];
const EditProductTable = () => {
  const [show, setShow] = React.useState(false);

  return (
    <div className="w-full h-full bg-white rounded-lg shadow overflow-x-auto py-2">
      {show ? <EditProductModal onClose={() => setShow(false)} /> : <></>}
      <div className="w-full">
        <div className="flex text-[15px] font-medium rounded-t-lg overflow-hidden ">
          <div className="w-full cursor-pointer px-4 py-2 flex items-center justify-center transition-all duration-200 text-xl text-center bg-white text-[#3c2f1c] border-t-2 border-x-2 border-[#e8d5a2] rounded-t-md shadow-md">
            Productos
          </div>
          <div className="w-full cursor-pointer px-4 py-2 transition-all duration-200 text-xl text-cente text-[#3c2f1c] border-b-2 border-[#e8d5a2] rounded-t-md shadow-md ">
            <div className="w-full flex items-center  justify-end gap-2">
              <div className="flex items-center  bg-[#fcf5e9] border-[2px] border-[#f5e6c9] rounded-md px-3 py-1 w-[280px] font-medium">
                <SearchIcon color="#5c4c3a" className="text-[#5c4c3a]" />
                <input
                  type="text"
                  placeholder="Buscar productos"
                  className="bg-transparent outline-none w-full text-[#5c4c3a] placeholder-[#5c4c3a] text-[15px]"
                />
              </div>
              <FiltroDropdown
                opciones={["Codigo", "Descripción", "Codigo de Tela"]}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white px-4 py-2 rounded-b-lg shadow-sm mt-4 overflow-y-hidden h-auto">
        <table className="w-full text-left text-[#3c2f1c] text-md">
          <thead>
            <tr className="grid grid-cols-5 font-medium px-4 py-2 border-b border-[#e6d8be] ">
              <th>Código</th>
              <th>Descripción</th>
              <th className="text-center">Código Tela</th>
              <th className="text-center">Precio</th>
              <th className="text-center">Ver</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr
                key={index}
                // onClick={() => handleClick(product)}
                className={`grid grid-cols-5 items-center px-4 py-3 cursor-pointer transition ${
                  index % 2 === 0 ? "bg-white" : "bg-[#f7ecd9]"
                } hover:bg-[#fff3e4]`}
              >
                <td className="font-medium  pl-2">{product.code}</td>
                <td className="block w-full">{product.name}</td>
                <td className="text-center">{product.color}</td>
                <td className="text-center">${product.priceGene}</td>
                <td
                  className="flex items-center justify-center gap-2 cursor-pointer"
                  onClick={() => setShow(true)}
                >
                  <Edit color={"#bd8535"} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EditProductTable;
