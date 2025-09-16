import { ProductsIcon } from "../../../../../../assets/icons";
import VoucherProducts from "./VoucherProducts";

const Products = ({ voucher }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3  w-full py-2 rounded-md ">
      {voucher?.products && (
        <div className="flex flex-col px-5 self-start p-4 bg-[var(--brown-ligth-200)] rounded-md w-full">
          <span className="text-[var(--brown-dark-950)] font-semibold">
            PRODUCTOS
          </span>
          <p className="text-[var(--brown-dark-800)]">
            Cantidad de productos:
            <span className="pl-2 text-[var(--brown-dark-950)] font-semibold">
              {voucher?.products?.length}
            </span>
          </p>
        </div>
      )}
      {/* Render dinámico de campos */}
      <div className="w-full px-6 flex gap-3">
        <div className="w-full px-6 flex flex-col gap-3">
          {voucher?.products?.map((item, index) => (
            <VoucherProducts
              key={item.id ?? index}
              data={item}
              icon={<ProductsIcon />}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
