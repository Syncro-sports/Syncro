import StatCardPlayer from "./StatCardPlayer";
import { ClockIcon } from "./icons";
import { datosUsuario } from "../playerData";
import "./DashboardStats.css";

const DashboardStats = () => {
  return (
    <div className="player-dashboard__stats">
      <StatCardPlayer
        label="Partidos jugados"
        value={String(datosUsuario.partidosJugados)}
        icon={<img src={`${import.meta.env.BASE_URL}assets/icons/bota.svg`} alt="" />}
      />
      <StatCardPlayer label="Horas jugadas" value={`${datosUsuario.horasJugadas} h`} icon={<ClockIcon />} />
      <StatCardPlayer
        label="Equipos"
        value={`${datosUsuario.equiposCantidad} / ${datosUsuario.equiposMax}`}
        icon={<img src={`${import.meta.env.BASE_URL}assets/icons/equipos.svg`} alt="" />}
      />
      <StatCardPlayer
        label="Complejos visitados"
        value={String(datosUsuario.complejosVisitados)}
        icon={<img src={`${import.meta.env.BASE_URL}assets/icons/canchas.svg`} alt="" />}
      />
    </div>
  );
};

export default DashboardStats;