import { useNavigate } from "react-router-dom";
import { Equipo } from "../../../services/equiposService";
import "./EquipoCard.css";

interface EquipoCardProps {
  equipo: Equipo;
}

const EquipoCard = ({ equipo }: EquipoCardProps) => {
  const navigate = useNavigate();

  return (
    <article className="equipo-mini-card" onClick={() => navigate(`/equipos/${equipo.id}`)}>
      <div className="equipo-mini-card__crest">
        <img src={`${import.meta.env.BASE_URL}assets/icons/escudo-green.svg`} alt="" />
      </div>

      <div className="equipo-mini-card__divider" />

      <h3 className="equipo-mini-card__nombre">{equipo.nombre}</h3>

      <div className="equipo-mini-card__divider" />

      <div className="equipo-mini-card__stats">
        <span className="equipo-mini-card__stat">
          <img src={`${import.meta.env.BASE_URL}assets/icons/equipos.svg`} alt="" />
          {equipo.jugadoresCant}/{equipo.cupoMaximo}
        </span>
        <span className="equipo-mini-card__stat">
          <img src={`${import.meta.env.BASE_URL}assets/icons/torneos.svg`} alt="" />
          {equipo.puntos}
        </span>
      </div>

      <button type="button" className="equipo-mini-card__detalle">
        VER DETALLE
      </button>
    </article>
  );
};

export default EquipoCard;
