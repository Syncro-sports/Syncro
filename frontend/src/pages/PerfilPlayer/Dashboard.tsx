import DashboardBienvenida from "./components/DashboardBienvenida";
import DashboardStats from "./components/DashboardStats";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="player-dashboard">
      <DashboardBienvenida />
      <DashboardStats />
    </div>
  );
};

export default Dashboard;