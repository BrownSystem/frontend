import Money from "./Money";
import SalesChart from "./SalesChart";
import Transactions from "./Transactions";

const CurrentBox = ({ branch }) => {
  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full w-full">
      {/* Resumen de caja */}
      <div className=" w-full h-auto">
        <SalesChart branchId={branch} />
      </div>

      {/* Métodos de pago */}
      <div className="col-span-1  w-full h-full">
        <Money />
      </div>

      {/* Transacciones */}
      <div className="col-start-2 row-start-1 row-span-2 w-full h-[90%]">
        <Transactions />
      </div>
    </div>
  );
};

export default CurrentBox;
