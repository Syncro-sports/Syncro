import { Partido } from "../partidosData";
import { CalendarIcon, ClockIcon, StarIcon } from "./icons";
import "./PartidoCard.css";

interface PartidoCardProps {
  partido: Partido;
  favorito: boolean;
  onToggleFavorito: (id: number) => void;
  onVerDetalle: (partido: Partido) => void;
}

const formatPrecio = (precio: number) => `$${precio.toLocaleString("es-AR")}`;

const PartidoCard = ({ partido, favorito, onToggleFavorito, onVerDetalle }: PartidoCardProps) => {
  return (
    <div className="partido-card">
      <div className="partido-card__top">
        <span className="partido-card__badge">{partido.tipo.toUpperCase()}</span>
        <button
          type="button"
          className={`partido-card__fav ${favorito ? "partido-card__fav--active" : ""}`}
          onClick={() => onToggleFavorito(partido.id)}
          aria-label="Marcar como favorito"
        >
          <StarIcon filled={favorito} />
        </button>
      </div>

      <div className="partido-card__vs">
        <span className="partido-card__shirt partido-card__shirt--local">
          <img src="/assets/icons/remera-local.svg" alt="Equipo local" />
        </span>
        <span className="partido-card__vs-text">VS</span>
        <span className="partido-card__shirt partido-card__shirt--rival">
          <img src="/assets/icons/remera-rival.svg" alt="Equipo rival" />
        </span>
      </div>

      <div className="partido-card__meta">
        <span className="partido-card__meta-item">
          <CalendarIcon />
          {partido.fechaLabel}
        </span>
        <span className="partido-card__meta-item">
          <ClockIcon />
          {partido.hora}
        </span>
      </div>

      <div className="partido-card__precio">
        <div>
          <strong>{formatPrecio(partido.precio)}</strong>
          <span>Total del partido</span>
        </div>
        <img src="/assets/icons/billetera.svg" alt="" />
      </div>

      <div className="partido-card__ubicacion">
        <img src="/assets/icons/lugar.svg" alt="" />
        <span>{partido.ubicacion}</span>
      </div>

      <button type="button" className="partido-card__detalle" onClick={() => onVerDetalle(partido)}>
        VER DETALLE <span>→</span>
      </button>
    </div>
  );
};

export default PartidoCard;
