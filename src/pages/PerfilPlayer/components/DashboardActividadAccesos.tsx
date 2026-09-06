import { Link } from "react-router-dom";
import { PlayerCard } from "./StatCardPlayer";
import { CalendarIcon } from "./icons";
import { datosUsuario } from "../playerData";
import "./DashboardActividadAccesos.css";

const ACCESOS_RAPIDOS = [
  {
    to: "/perfil-jugador/pagos",
    label: "Pagos pendientes",
    icono: <img src={`${import.meta.env.BASE_URL}assets/icons/dinero.svg`} alt="" />,
  },
  {
    to: "/perfil-jugador/equipos",
    label: "Ver mis equipos",
    icono: <img src={`${import.meta.env.BASE_URL}assets/icons/escudo-green.svg`} alt="" />,
  },
  {
    to: "/perfil-jugador/reservas",
    label: "Proximos partidos",
    icono: <img src={`${import.meta.env.BASE_URL}assets/icons/bota.svg`} alt="" />,
  },
  {
    to: "/perfil-jugador/configuracion",
    label: "Editar mi perfil",
    icono: <img src={`${import.meta.env.BASE_URL}assets/icons/perfil-lapiz.svg`} alt="" />,
  },
];

const DashboardActividadAccesos = () => {
  return (
    <div className="player-dashboard__footer">
      <PlayerCard className="player-actividad">
        <h2>Actividad reciente</h2>
        <div className="player-actividad__list">
          {datosUsuario.actividadReciente.map((item) => (
            <div className="player-actividad__item" key={item.id}>
              <span className="player-actividad__dot" />
              <CalendarIcon />
              <span className="player-actividad__texto">{item.texto}</span>
              <span className="player-actividad__tiempo">{item.tiempo}</span>
            </div>
          ))}
        </div>
        <Link to="/perfil-jugador/historial" className="player-actividad__ver-todo">
          Ver toda la actividad →
        </Link>
      </PlayerCard>

      <PlayerCard className="player-accesos">
        <h2>Acceso rapido</h2>
        <div className="player-accesos__grid">
          {ACCESOS_RAPIDOS.map((acceso) => (
            <Link to={acceso.to} className="player-accesos__item" key={acceso.label}>
              {acceso.icono}
              <span>{acceso.label}</span>
            </Link>
          ))}
        </div>
      </PlayerCard>
    </div>
  );
};

export default DashboardActividadAccesos;