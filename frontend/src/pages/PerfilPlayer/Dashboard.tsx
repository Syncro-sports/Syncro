import DashboardBienvenida from "./components/DashboardBienvenida";
import DashboardStats from "./components/DashboardStats";
import DashboardPartidoEquipo from "./components/DashboardPartidoEquipo";
import DashboardActividadAccesos from "./components/DashboardActividadAccesos";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="player-dashboard">
      <DashboardBienvenida />
      <DashboardStats />
      <DashboardPartidoEquipo />
      <DashboardActividadAccesos />
    </div>
  );
};

export default Dashboard;