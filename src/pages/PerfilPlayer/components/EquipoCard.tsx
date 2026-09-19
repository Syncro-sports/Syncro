import "./EquipoCard.css";

const iconoUrl = (nombre: string) => `${import.meta.env.BASE_URL}assets/icons/${nombre}`;

export interface Equipo {
  id: string;
  nombre: string;
  logoUrl: string;
  tipo: "Competitivo" | "Amistoso";
  categoria: string;
  descripcion: string;
  integrantesActuales: number;
  integrantesMax: number;
  esPropietario: boolean;
  proximoPartido?: {
    fecha: string;
    hora: string;
  };
}

interface EquipoCardProps {
  equipo: Equipo;
  onVerEquipo: (id: string) => void;
}

const EquipoCard = ({ equipo, onVerEquipo }: EquipoCardProps) => {
  const {
    id,
    nombre,
    logoUrl,
    tipo,
    categoria,
    descripcion,
    integrantesActuales,
    integrantesMax,
    esPropietario,
    proximoPartido,
  } = equipo;

  return (
    <article className="player-equipos-card">
      <img className="player-equipos-card__logo" src={logoUrl} alt={`Escudo de ${nombre}`} />

      <div className="player-equipos-card__contenido">
        {esPropietario && (
          <span className="player-equipos-card__etiqueta">Equipo de propietario</span>
        )}

        <h3 className="player-equipos-card__nombre">{nombre}</h3>

        <div className="player-equipos-card__badges">
          <span
            className={`player-equipos-card__badge${
              tipo === "Competitivo" ? " player-equipos-card__badge--competitivo" : ""
            }`}
          >
            {tipo}
          </span>
          <span>·</span>
          <span>{categoria}</span>
        </div>

        <p className="player-equipos-card__descripcion">{descripcion}</p>

        <div className="player-equipos-card__meta">
          <span className="player-equipos-card__meta-item">
            <img src={iconoUrl("equipos-dashboard.svg")} alt="" />
            {integrantesActuales} / {integrantesMax} Integrantes
          </span>
          {proximoPartido && (
            <span className="player-equipos-card__meta-item">
              <img src={iconoUrl("reservas-dashboard.svg")} alt="" />
              Próximo partido: {proximoPartido.fecha} - {proximoPartido.hora}
            </span>
          )}
        </div>
      </div>

      <button
        type="button"
        className="player-equipos__btn-outline player-equipos-card__ver-btn"
        onClick={() => onVerEquipo(id)}
      >
        Ver equipo →
      </button>
    </article>
  );
};

export default EquipoCard;