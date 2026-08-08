import DashboardBienvenida from "./components/DashboardBienvenida";
import DashboardStats from "./components/DashboardStats";
import DashboardPartidoEquipo from "./components/DashboardPartidoEquipo";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="player-dashboard">
      <DashboardBienvenida />
      <DashboardStats />
      <DashboardPartidoEquipo />
    </div>
  );
};

export default Dashboard;