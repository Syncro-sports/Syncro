import { Link } from "react-router-dom";
import { PlayerCard } from "./StatCardPlayer";
import { CalendarIcon, ClockIcon } from "./icons";
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
            <div className="player-partido__lines">
              <span className="player-partido__row">
                <CalendarIcon /> {proximoPartido.fecha}
              </span>
              <span className="player-partido__row">
                <ClockIcon /> {proximoPartido.hora}
              </span>
              <span className="player-partido__row">
                <img src={`${import.meta.env.BASE_URL}assets/icons/pelota-white.svg`} alt="" /> {proximoPartido.deporte}
              </span>
              <span className="player-partido__row">
                <img src={`${import.meta.env.BASE_URL}assets/icons/escudo-white.svg`} alt="" /> {proximoPartido.equipo}
              </span>
              <span className="player-partido__tag">{proximoPartido.tipo}</span>
            </div>
            <Link to="/perfil-jugador/reservas" className="player-outline-btn">
              Ver reserva
            </Link>
          </div>
        </div>
      </PlayerCard>

      <PlayerCard className="player-equipo">
        <h2>Mi equipo</h2>
        <div className="player-equipo__body">
          <img className="player-equipo__escudo" src={equipo.escudo} alt={equipo.nombre} />
          <div className="player-equipo__info">
            <div className="player-equipo__lines">
              <strong className="player-equipo__nombre">{equipo.nombre}</strong>
              <span className="player-equipo__rango">{equipo.rango}</span>
              <span className="player-equipo__label">Proximo partido</span>
              <span className="player-equipo__fecha">{equipo.proximoPartidoFecha}</span>
              <span className="player-equipo__rival">{equipo.rival}</span>
              <span className="player-equipo__torneo">{equipo.torneo}</span>
            </div>
            <Link to="/perfil-jugador/equipos" className="player-outline-btn">
              Ver equipos
            </Link>
          </div>
        </div>
      </PlayerCard>
    </div>
  );
};

export default DashboardPartidoEquipo;