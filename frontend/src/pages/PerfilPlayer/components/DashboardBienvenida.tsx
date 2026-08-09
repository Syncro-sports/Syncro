import { Link } from "react-router-dom";
import { datosUsuario, calcularNivel, obtenerRangoIcono, obtenerSaludo } from "../playerData";
import "./DashboardBienvenida.css";

const DashboardBienvenida = () => {
  const { nivel, xpActual, xpRestante, porcentaje } = calcularNivel(datosUsuario.expTotal);

  return (
    <>
      <div className="player-welcome">
        <h1>
          {obtenerSaludo()}, /{datosUsuario.usuario}
        </h1>
        <p>Listo/a para tu próximo partido?</p>
      </div>

      <div
        className="player-nivel-card"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(5, 7, 11, 0.92) 0%, rgba(5, 7, 11, 0.55) 55%, rgba(5, 7, 11, 0.15) 100%), url(${import.meta.env.BASE_URL}assets/hero-background.jpg)`,
          backgroundPosition: "center 80%",
        }}
      >
        <div className="player-nivel-card__content">
          <img
            className="player-nivel-card__badge"
            src={`${import.meta.env.BASE_URL}assets/icons/${obtenerRangoIcono(nivel)}`}
            alt={`Rango nivel ${nivel}`}
          />
          <div className="player-nivel-card__info">
            <span className="player-nivel-card__label">Nivel actual</span>
            <strong className="player-nivel-card__nivel">Nivel {nivel}</strong>

            <div className="player-nivel-card__bar">
              <span className="player-nivel-card__bar-track">
                <span className="player-nivel-card__bar-fill" style={{ width: `${porcentaje}%` }} />
              </span>
              <span className="player-nivel-card__xp">{xpActual} / 1600 XP</span>
            </div>

            <span className="player-nivel-card__restante">
              Te faltan solo <strong>{xpRestante} XP</strong> para llegar al nivel {nivel + 1}
            </span>

            <div className="player-nivel-card__actions">
              <Link to="/perfil-jugador/reservas" className="player-nivel-card__btn player-nivel-card__btn--primary">
                Ver reservas
              </Link>
              <Link to="/partidos" className="player-nivel-card__btn player-nivel-card__btn--outline">
                Buscar un partido
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardBienvenida;