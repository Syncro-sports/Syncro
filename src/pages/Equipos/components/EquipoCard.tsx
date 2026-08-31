import { useNavigate } from "react-router-dom";
import { Equipo } from "../equiposData";
import "./EquipoCard.css";

interface EquipoCardProps {
  equipo: Equipo;
}

const EquipoCard = ({ equipo }: EquipoCardProps) => {
  const navigate = useNavigate();

  return (
    <article className="equipo-card" onClick={() => navigate(`/equipos/${equipo.id}`)}>
      <div className="equipo-card__crest">
        <img src={`${import.meta.env.BASE_URL}assets/icons/escudo-green.svg`} alt="" />
      </div>

      <div className="equipo-card__divider" />

      <h3 className="equipo-card__nombre">{equipo.nombre}</h3>

      <div className="equipo-card__divider" />

      <div className="equipo-card__stats">
        <span className="equipo-card__stat">
          <img src={`${import.meta.env.BASE_URL}assets/icons/equipos.svg`} alt="" />
          {equipo.jugadoresCant}/{equipo.jugadoresCap}
        </span>
        <span className="equipo-card__stat">
          <img src={`${import.meta.env.BASE_URL}assets/icons/torneos.svg`} alt="" />
          {equipo.puntos}
        </span>
      </div>

      <button type="button" className="equipo-card__detalle">
        VER DETALLE
      </button>
    </article>
  );
};

export default EquipoCard;
