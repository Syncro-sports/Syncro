import { HostCard } from "./components/StatCard";
import { ClockIcon } from "./components/icons";
import RatingDonutChart from "./components/RatingDonutChart";
import { datosValoraciones } from "./valoracionesData";
import "./Valoraciones.css";
import { Fragment, CSSProperties } from "react";

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
            <img src={`${ICON_BASE}/reloj.svg`} alt="" />
            <h2>Valoraciones recientes</h2>
          </div>

          <div className="val-recientes__list">
            {datosValoraciones.recientes.map((valoracion) => (
              <div className="val-recientes__item" key={valoracion.id}>
                <span className="val-recientes__avatar">
                  <img src={`${ICON_BASE}/perfil-header.svg`} alt="" />
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

        <div className="host-valoraciones__side">
          <HostCard className="val-panel">
            <div className="val-panel__title">
              <img src={`${ICON_BASE}/valoracion.svg`} alt="" />
              <h2>Distribucion de valoraciones</h2>
            </div>

            <div className="val-distribucion__body">
              <RatingDonutChart
                segments={datosValoraciones.distribucion.map((item) => ({
                  label: `${item.estrellas} estrellas`,
                  value: item.porcentaje,
                  color: item.color,
                }))}
              />
              <div className="val-distribucion__legend">
                {datosValoraciones.distribucion.map((item) => (
                  <Fragment key={item.estrellas}>
                    <span className="val-distribucion__dot" style={{ backgroundColor: item.color }} />
                    <span className="val-distribucion__label">
                      {item.estrellas} Estrella{item.estrellas > 1 ? "s" : ""}
                    </span>
                    <strong className="val-distribucion__percent">
                      {item.porcentaje}% ({item.cantidad})
                    </strong>
                  </Fragment>
                ))}
              </div>
            </div>

            <div className="val-distribucion__total">
              <span>Total valoraciones</span>
              <strong>{datosValoraciones.total}</strong>
            </div>
          </HostCard>

          <HostCard className="val-panel">
            <div className="val-panel__title">
              <span
                className="val-panel__title-icon"
                style={
                  {
                    WebkitMaskImage: `url(${ICON_BASE}/advertencia.svg)`,
                    maskImage: `url(${ICON_BASE}/advertencia.svg)`,
                  } as CSSProperties
                }
              />
              <h2>Escucha a tus jugadores</h2>
            </div>

            <div className="val-escucha">
              <span
                className="val-escucha__icon"
                style={
                  {
                    WebkitMaskImage: `url(${ICON_BASE}/chat.svg)`,
                    maskImage: `url(${ICON_BASE}/chat.svg)`,
                  } as CSSProperties
                }
              />
              <div className="val-escucha__content">
                <p>Las valoraciones ayudan a mejorar la experiencia en las canchas</p>
                <button type="button" className="host-outline-btn">
                  Ver sugerencias →
                </button>
              </div>
            </div>
          </HostCard>
        </div>
      </div>
    </div>
  );
};

export default Valoraciones;