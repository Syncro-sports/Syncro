import { HostCard } from "./components/StatCard";
import { ClockIcon } from "./components/icons";
import { datosValoraciones } from "./valoracionesData";
import "./Valoraciones.css";

const ICON_BASE = `${import.meta.env.BASE_URL}assets/icons`;

const Valoraciones = () => {
  return (
    <div className="host-valoraciones">
      <div className="host-valoraciones__header">
        <h1>Valoraciones</h1>
      </div>

      <div className="host-valoraciones__stats">
        <HostCard className="val-stat-card">
          <span className="val-stat-card__label">
            <img src={`${ICON_BASE}/valoracion.svg`} alt="" />
            Valoraciones promedio
          </span>
          <strong className="val-stat-card__value">{datosValoraciones.promedio} / 5</strong>
          <span className="val-stat-card__footer">{datosValoraciones.promedioDelta}</span>
        </HostCard>

        <HostCard className="val-stat-card">
          <span className="val-stat-card__label">
            <img src={`${ICON_BASE}/escudo-green.svg`} alt="" />
            Total valoraciones
          </span>
          <strong className="val-stat-card__value">{datosValoraciones.total}</strong>
          <span className="val-stat-card__footer">{datosValoraciones.totalDelta}</span>
        </HostCard>

        <HostCard className="val-stat-card">
          <span className="val-stat-card__label">
            <img src={`${ICON_BASE}/positivo.svg`} alt="" />
            Valoraciones positivas
          </span>
          <strong className="val-stat-card__value">{datosValoraciones.positivas}</strong>
          <span className="val-stat-card__footer">{datosValoraciones.positivasNota}</span>
        </HostCard>

        <HostCard className="val-stat-card">
          <span className="val-stat-card__label">
            <img src={`${ICON_BASE}/negativo.svg`} alt="" />
            Valoraciones negativas
          </span>
          <strong className="val-stat-card__value">{datosValoraciones.negativas}</strong>
          <span className="val-stat-card__footer">{datosValoraciones.negativasNota}</span>
        </HostCard>
      </div>

      <div className="host-valoraciones__main">
        <HostCard className="val-panel">
          <div className="val-panel__title">
            <ClockIcon />
            <h2>Valoraciones recientes</h2>
          </div>

          <div className="val-recientes__list">
            {datosValoraciones.recientes.map((valoracion) => (
              <div className="val-recientes__item" key={valoracion.id}>
                <span className="val-recientes__avatar">
                  <img src={`${ICON_BASE}/perfil-green.svg`} alt="" />
                </span>
                <div>
                  <div className="val-recientes__nombre">{valoracion.nombre}</div>
                  <div className="val-recientes__puntaje">{valoracion.puntaje} / 5</div>
                </div>
                <p className="val-recientes__comentario">{valoracion.comentario}</p>
              </div>
            ))}
          </div>

          <button type="button" className="host-outline-btn">
            Ver todas las valoraciones →
          </button>
        </HostCard>
      </div>
    </div>
  );
};

export default Valoraciones;