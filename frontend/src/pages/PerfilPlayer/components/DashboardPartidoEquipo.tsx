import { Link } from "react-router-dom";
import { PlayerCard } from "./StatCardPlayer";
import { CalendarIcon, ClockIcon, BallIcon, UserIcon } from "./icons";
import { datosUsuario } from "../playerData";
import "./DashboardPartidoEquipo.css";

const DashboardPartidoEquipo = () => {
  const { proximoPartido, equipo } = datosUsuario;

  return (
    <div className="player-dashboard__main">
      <PlayerCard className="player-partido">
        <h2>Proximo partido</h2>
        <div className="player-partido__body">
          <img className="player-partido__imagen" src={proximoPartido.imagen} alt="" />
          <div className="player-partido__info">
            <span className="player-partido__row">
              <CalendarIcon /> {proximoPartido.fecha}
            </span>
            <span className="player-partido__row">
              <ClockIcon /> {proximoPartido.hora}
            </span>
            <span className="player-partido__row">
              <BallIcon /> {proximoPartido.deporte}
            </span>
            <span className="player-partido__row">
              <UserIcon /> {proximoPartido.equipo}
            </span>
            <span className="player-partido__tag">{proximoPartido.tipo}</span>
            <Link to="/perfil-jugador/reservas" className="player-partido__btn">
              Ver reserva
            </Link>
          </div>
        </div>
      </PlayerCard>

      <PlayerCard className="player-equipo">
        <div className="player-equipo__header">
          <h2>Mi equipo</h2>
        </div>
        <div className="player-equipo__body">
          <img className="player-equipo__escudo" src={equipo.escudo} alt={equipo.nombre} />
          <div className="player-equipo__info">
            <strong className="player-equipo__nombre">{equipo.nombre}</strong>
            <span className="player-equipo__rango">{equipo.rango}</span>

            <span className="player-equipo__label">Proximo partido</span>
            <span className="player-equipo__fecha">{equipo.proximoPartidoFecha}</span>
            <span className="player-equipo__rival">{equipo.rival}</span>
            <span className="player-equipo__torneo">{equipo.torneo}</span>
          </div>
        </div>
        <Link to="/perfil-jugador/equipos" className="player-equipo__btn">
          Ver equipos →
        </Link>
      </PlayerCard>
    </div>
  );
};

export default DashboardPartidoEquipo;