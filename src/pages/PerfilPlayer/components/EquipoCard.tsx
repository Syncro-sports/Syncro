import "./EquipoCard.css";

export interface Equipo {
  id: string;
  nombre: string;
  logoUrl: string;
  categoria: string;
  descripcion: string;
  integrantesActuales: number;
  integrantesMax: number;
  // El creador del equipo es tambien su capitan
  esPropietario: boolean;
  solicitudesPendientes?: number;
  proximoPartido?: {
    fecha: string;
    hora: string;
  };
}

interface EquipoCardProps {
  equipo: Equipo;
  onVerEquipo: (id: string) => void;
  onVerSolicitudes?: (id: string) => void;
}

const EquipoCard = ({ equipo, onVerEquipo, onVerSolicitudes }: EquipoCardProps) => {
  const {
    id,
    nombre,
    logoUrl,
    categoria,
    integrantesActuales,
    integrantesMax,
    esPropietario,
    solicitudesPendientes = 0,
    proximoPartido,
  } = equipo;

  return (
    <article className="player-card player-equipos-card">
      <div className="player-equipos-card__top">
        <img className="player-equipos-card__logo" src={logoUrl} alt={`Escudo de ${nombre}`} />
        <div>
          <h3 className="player-equipos-card__nombre">{nombre}</h3>
          <div className="player-equipos-card__tags">
            <span className={`pj-chip ${esPropietario ? "" : "pj-chip--muted"}`}>
              {esPropietario ? "Capitán" : "Jugador"}
            </span>
            <span className="player-equipos-card__categoria">{categoria}</span>
          </div>
        </div>
      </div>

      <div className="player-equipos-card__meta">
        <span>
          <strong>
            {integrantesActuales} / {integrantesMax}
          </strong>{" "}
          integrantes
        </span>
        {proximoPartido && (
          <span>
            Próximo partido:{" "}
            <strong>
              {proximoPartido.fecha} - {proximoPartido.hora}
            </strong>
          </span>
        )}
      </div>

      <div className="player-equipos-card__foot">
        <button type="button" className="pj-btn pj-btn--outline pj-btn--sm" onClick={() => onVerEquipo(id)}>
          Ver equipo
        </button>
        {esPropietario && solicitudesPendientes > 0 && onVerSolicitudes && (
          <button type="button" className="pj-btn pj-btn--ghost pj-btn--sm" onClick={() => onVerSolicitudes(id)}>
            Solicitudes ({solicitudesPendientes})
          </button>
        )}
      </div>
    </article>
  );
};

export default EquipoCard;
