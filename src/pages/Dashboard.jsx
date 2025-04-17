import { LayoutDashboard } from "../components/dashboard";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="w-screen h-screen font-outfit  bg-[var(--brown-ligth-100)]">
      <LayoutDashboard>
        <Outlet />
      </LayoutDashboard>
    </div>
  );
};

export default Dashboard;
