import SalesChart from "../../Chart/SalesChart";
import Money from "../../Money/Money";
import MonthlyInvoicesChart from "../../Chart/MonthlyInvoicesChart";
import EmployeeSales from "../../EmployeeSales/EmployeeSales";
import SalesTable from "../../SalesTable/SalesTable";

const Discharge = ({ type, branch }) => {
  return (
    <div className="m-auto flex flex-col gap-2">
      <div className="flex gap-2">
        <SalesChart type={type} branchId={branch} />
        <Money />
      </div>
      <div className="flex gap-2 h-[250px]">
        <MonthlyInvoicesChart type={type} branchId={branch} />
        <EmployeeSales type={type} branchId={branch} />
      </div>
      <div>
        <SalesTable />
      </div>
      <div>{/* <SalesTable /> */}</div>
    </div>
  );
};

export default Discharge;
