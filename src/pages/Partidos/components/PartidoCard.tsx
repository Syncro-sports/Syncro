import { useState } from "react";
import { Partido } from "../partidosData";
import { CalendarIcon, ClockIcon } from "./icons";
import "./PartidoCard.css";

interface PartidoCardProps {
  partido: Partido;
  onVerDetalle: (partido: Partido) => void;
}

const formatPrecio = (precio: number) => `$${precio.toLocaleString("es-AR")}`;

const PartidoCard = ({ partido, onVerDetalle }: PartidoCardProps) => {
  // Si el equipo tiene foto la mostramos; si no tiene (o no carga), queda la remera por defecto
  const [fotoRota, setFotoRota] = useState(false);
  const fotoLocal = partido.equipoLocalFoto && !fotoRota ? partido.equipoLocalFoto : null;

  return (
    <div
      className="partido-card"
      onClick={() => onVerDetalle(partido)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onVerDetalle(partido);
        }
      }}
    >
      <div className="partido-card__top">
        <span className="partido-card__badge">{partido.tipo.toUpperCase()}</span>
      </div>

      <div className="partido-card__vs">
        <span className={`partido-card__shirt partido-card__shirt--local ${fotoLocal ? "partido-card__shirt--foto" : ""}`}>
          {fotoLocal ? (
            <img src={fotoLocal} alt={partido.equipoLocalNombre} onError={() => setFotoRota(true)} />
          ) : (
            <img src={`${import.meta.env.BASE_URL}assets/icons/remera-local.svg`} alt="Equipo local" />
          )}
        </span>
        <span className="partido-card__vs-text">VS</span>
        <span className="partido-card__shirt partido-card__shirt--rival">
          <img src={`${import.meta.env.BASE_URL}assets/icons/remera-rival.svg`} alt="Equipo rival" />
        </span>
      </div>
      <p className="partido-card__equipo" title={partido.equipoLocalNombre}>
        {partido.equipoLocalNombre}
      </p>

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
        <img src={`${import.meta.env.BASE_URL}assets/icons/billetera.svg`} alt="" />
      </div>

      <div className="partido-card__ubicacion">
        <img src={`${import.meta.env.BASE_URL}assets/icons/lugar.svg`} alt="" />
        <span>{partido.ubicacion}</span>
      </div>

      <button
        type="button"
        className="partido-card__detalle"
        onClick={(e) => {
          e.stopPropagation();
          onVerDetalle(partido);
        }}
      >
        VER DETALLE <span>→</span>
      </button>
    </div>
  );
};

export default PartidoCard;
