import { useNavigate } from "react-router-dom";
import EquipoCard, { type Equipo } from "./components/EquipoCard";
import "./Equipos.css";
 
const iconoUrl = (nombre: string) => `${import.meta.env.BASE_URL}assets/icons/${nombre}`;
 
const backendConectado = false;
 
const equiposMock: Equipo[] = [
  {
    id: "titanes",
    nombre: "Los Titanes",
    logoUrl: iconoUrl("titanes-escudo.png"),
    tipo: "Competitivo",
    categoria: "División 2",
    descripcion: "Compitiendo con disciplina. Ganando en unidad.",
    integrantesActuales: 7,
    integrantesMax: 8,
    esPropietario: true,
    proximoPartido: { fecha: "24 May 2025", hora: "7:00 PM" },
  },
  {
    id: "norte-united",
    nombre: "Norte United",
    logoUrl: iconoUrl("norte-united-escudo.png"),
    tipo: "Amistoso",
    categoria: "Casual",
    descripcion: "Amigos en la cancha. Hermanos fuera de ella.",
    integrantesActuales: 5,
    integrantesMax: 8,
    esPropietario: false,
    proximoPartido: { fecha: "31 May 2025", hora: "8:00 PM" },
  },
];
 
const equiposReal: Equipo[] = [];
 
const MAX_RANURAS = 3;
 
const BENEFICIOS = [
  { icono: "calendario-pagos.svg", texto: "Reservas más fáciles y rápidas" },
  { icono: "equipos.svg", texto: "Desarrolla química y crece en conjunto" },
  { icono: "torneos.svg", texto: "Sube de divisiones y desbloquea desafíos" },
];
 
const RUTA_EXPLORAR_EQUIPOS = "/equipos/explorar";
const rutaDetalleEquipo = (id: string) => `/equipos/${id}`;
 
const Equipos = () => {
  const navigate = useNavigate();
  const equipos = backendConectado ? equiposReal : equiposMock;
  const ranurasOcupadas = equipos.length;
  const ranurasDisponibles = MAX_RANURAS - ranurasOcupadas;
 
  const handleExplorarEquipos = () => navigate(RUTA_EXPLORAR_EQUIPOS);
  const handleVerEquipo = (id: string) => navigate(rutaDetalleEquipo(id));
  const handleCrearEquipo = () => {};
 
  return (
    <div className="player-equipos">
      <div className="player-equipos__main">
        <header className="player-equipos__header">
          <div>
            <h2 className="player-equipos__titulo">Mis Equipos</h2>
            <p className="player-equipos__subtitulo">
              Equipos de los que formás parte. Compite, crece y gana en conjunto.
            </p>
          </div>
          <button
            type="button"
            className="player-equipos__btn-outline"
            onClick={handleExplorarEquipos}
          >
            Explorar equipo →
          </button>
        </header>
 
        <div className="player-equipos__lista">
          {equipos.map((equipo) => (
            <EquipoCard key={equipo.id} equipo={equipo} onVerEquipo={handleVerEquipo} />
          ))}
        </div>
 
        <div className="player-equipos__cta">
          <div className="player-equipos__cta-icono" aria-hidden="true">
            +
          </div>
          <div className="player-equipos__cta-texto">
            <p className="player-equipos__cta-titulo">Unirse o crear un equipo</p>
            <p className="player-equipos__cta-subtitulo">
              ¿No tienes equipo aún? Únete a uno existente o crea el tuyo y comienza a compartir.
            </p>
          </div>
          <div className="player-equipos__cta-botones">
            <button
              type="button"
              className="player-equipos__btn-outline"
              onClick={handleExplorarEquipos}
            >
              Explorar equipos →
            </button>
            <button
              type="button"
              className="player-equipos__btn-primario"
              onClick={handleCrearEquipo}
            >
              + Crear equipo →
            </button>
          </div>
        </div>
      </div>
 
      <aside className="player-equipos__sidebar">
        <section className="player-equipos__panel">
          <div className="player-equipos__panel-header">
            <span className="player-equipos__panel-icono">
              <img src={iconoUrl("equipos-2.svg")} alt="" />
            </span>
            <h4 className="player-equipos__panel-titulo">Ranuras de equipo</h4>
          </div>
          <p className="player-equipos__panel-texto">
            Puedes ser parte de hasta {MAX_RANURAS} equipos.
          </p>
          <p className="player-equipos__ranuras-contador">
            {ranurasOcupadas} / {MAX_RANURAS}
          </p>
          <p className="player-equipos__panel-texto">
            {ranurasDisponibles}{" "}
            {ranurasDisponibles === 1 ? "ranura disponible" : "ranuras disponibles"}
          </p>
          <div className="player-equipos__ranuras-barra">
            {Array.from({ length: MAX_RANURAS }).map((_, i) => (
              <span
                key={i}
                className={`player-equipos__ranura${
                  i < ranurasOcupadas ? " player-equipos__ranura--ocupada" : ""
                }`}
              />
            ))}
          </div>
        </section>
 
        <section className="player-equipos__panel">
          <h4 className="player-equipos__panel-titulo">Beneficios de estar en un equipo</h4>
          <ul className="player-equipos__beneficios">
            {BENEFICIOS.map((beneficio) => (
              <li key={beneficio.texto} className="player-equipos__beneficio">
                <span className="player-equipos__beneficio-icono">
                  <img src={iconoUrl(beneficio.icono)} alt="" />
                </span>
                {beneficio.texto}
              </li>
            ))}
          </ul>
        </section>
 
        <section className="player-equipos__panel">
          <div className="player-equipos__panel-header">
            <span className="player-equipos__panel-icono">
              <img src={iconoUrl("chat.svg")} alt="" />
            </span>
            <h4 className="player-equipos__panel-titulo">¿Necesitas ayuda?</h4>
          </div>
          <p className="player-equipos__panel-texto">
            ¿Problemas con un equipo? Contacta a nuestro soporte.
          </p>
          <button
            type="button"
            className="player-equipos__btn-primario player-equipos__btn-soporte"
          >
            Soporte de contacto →
          </button>
        </section>
      </aside>
    </div>
  );
};
 
export default Equipos;