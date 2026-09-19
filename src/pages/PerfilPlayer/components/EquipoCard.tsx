import "./EquipoCard.css";
 
export interface Equipo {
  id: string; // ddbb_id
  nombre: string; // ddbb_nombre
  logoUrl: string; // ddbb_logo_url
  tipo: "Competitivo" | "Amistoso"; // ddbb_tipo
  categoria: string; // ddbb_categoria — ej. "División 2", "Casual"
  descripcion: string; // ddbb_descripcion
  integrantesActuales: number; // ddbb_integrantes_actuales
  integrantesMax: number; // ddbb_integrantes_max
  esPropietario: boolean; // ddbb_es_propietario
  proximoPartido?: {
    fecha: string; // ddbb_proximo_partido_fecha
    hora: string; // ddbb_proximo_partido_hora
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
    <article className="equipo-card">
      {/* TODO: menú de opciones del equipo (salir del equipo, etc.) — no definido aún */}
      <button type="button" className="equipo-card__menu" aria-label="Más opciones">
        ⋯
      </button>
 
      <img className="equipo-card__logo" src={logoUrl} alt={`Escudo de ${nombre}`} />
 
      <div className="equipo-card__contenido">
        {esPropietario && <span className="equipo-card__etiqueta">Equipo de propietario</span>}
 
        <h3 className="equipo-card__nombre">{nombre}</h3>
 
        <div className="equipo-card__badges">
          <span
            className={`equipo-card__badge${
              tipo === "Competitivo" ? " equipo-card__badge--competitivo" : ""
            }`}
          >
            {tipo}
          </span>
          <span>·</span>
          <span>{categoria}</span>
        </div>
 
        <p className="equipo-card__descripcion">{descripcion}</p>
 
        <div className="equipo-card__meta">
          <span>
            {integrantesActuales} / {integrantesMax} Integrantes
          </span>
          {proximoPartido && (
            <span>
              Próximo partido: {proximoPartido.fecha} - {proximoPartido.hora}
            </span>
          )}
        </div>
      </div>
 
      <button type="button" className="equipo-card__ver-btn" onClick={() => onVerEquipo(id)}>
        Ver equipo →
      </button>
    </article>
  );
};
 
export default EquipoCard;