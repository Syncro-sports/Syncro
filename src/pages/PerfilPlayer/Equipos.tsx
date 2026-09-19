import { useNavigate } from "react-router-dom";
import EquipoCard, { type Equipo } from "./components/EquipoCard";
import "./Equipos.css";
 
// para este endpoint se usa el mock tipado; cuando esté listo alcanza con
// pasar backendConectado a true y completar equiposReal (campos // ddbb_).
const backendConectado = false;
 
const equiposMock: Equipo[] = [
  {
    id: "titanes",
    nombre: "Los Titanes",
    logoUrl: `${import.meta.env.BASE_URL}assets/icons/titanes-escudo.png`,
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
    logoUrl: `${import.meta.env.BASE_URL}assets/icons/norte-united-escudo.png`,
    tipo: "Amistoso",
    categoria: "Casual",
    descripcion: "Amigos en la cancha. Hermanos fuera de ella.",
    integrantesActuales: 5,
    integrantesMax: 8,
    esPropietario: false,
    proximoPartido: { fecha: "31 May 2025", hora: "8:00 PM" },
  },
];
 
const equiposReal: Equipo[] = [
  // ddbb_equipos_del_jugador — se completa con la respuesta de GET /equipos/mios
];
 
const MAX_RANURAS = 3;
 
const BENEFICIOS = [
  "Reservas más fáciles y rápidas",
  "Desarrolla química y crece en conjunto",
  "Sube de divisiones y desbloquea desafíos",
];
 
// "Ver equipo" y "Crear equipo" todavía no tienen pantalla propia.
const RUTA_EXPLORAR_EQUIPOS = "/equipos/explorar";
const rutaDetalleEquipo = (id: string) => `/equipos/${id}`;
 
const Equipos = () => {
  const navigate = useNavigate();
  const equipos = backendConectado ? equiposReal : equiposMock;
  const ranurasOcupadas = equipos.length;
  const ranurasDisponibles = MAX_RANURAS - ranurasOcupadas;
 
  const handleExplorarEquipos = () => navigate(RUTA_EXPLORAR_EQUIPOS);
  const handleVerEquipo = (id: string) => navigate(rutaDetalleEquipo(id));
  const handleCrearEquipo = () => {
  };
 
  return (
    <div className="equipos">
      <div className="equipos__col-principal">
        <header className="equipos__header">
          <div>
            <h2 className="equipos__titulo">Mis Equipos</h2>
            <p className="equipos__subtitulo">
              Equipos de los que formás parte. Compite, crece y gana en conjunto.
            </p>
          </div>
          <button type="button" className="equipos__btn-outline" onClick={handleExplorarEquipos}>
            Explorar equipo →
          </button>
        </header>
 
        <div className="equipos__lista">
          {equipos.map((equipo) => (
            <EquipoCard key={equipo.id} equipo={equipo} onVerEquipo={handleVerEquipo} />
          ))}
        </div>
 
        <div className="equipos__cta">
          <div className="equipos__cta-icono" aria-hidden="true">
            +
          </div>
          <div className="equipos__cta-texto">
            <p className="equipos__cta-titulo">Unirse o crear un equipo</p>
            <p className="equipos__cta-subtitulo">
              ¿No tienes equipo aún? Únete a uno existente o crea el tuyo y comienza a compartir.
            </p>
          </div>
          <div className="equipos__cta-botones">
            <button type="button" className="equipos__btn-outline" onClick={handleExplorarEquipos}>
              Explorar equipos →
            </button>
            <button type="button" className="equipos__btn-primario" onClick={handleCrearEquipo}>
              + Crear equipo →
            </button>
          </div>
        </div>
      </div>
 
      <aside className="equipos__col-lateral">
        <section className="equipos__panel">
          <h4 className="equipos__panel-titulo">Ranuras de equipo</h4>
          <p className="equipos__panel-texto">Puedes ser parte de hasta {MAX_RANURAS} equipos.</p>
          <p className="equipos__ranuras-contador">
            {ranurasOcupadas} / {MAX_RANURAS}
          </p>
          <p className="equipos__panel-texto">
            {ranurasDisponibles} {ranurasDisponibles === 1 ? "ranura disponible" : "ranuras disponibles"}
          </p>
          {/* Solo MAX_RANURAS líneas, una por cupo — nunca más de 3 */}
          <div className="equipos__ranuras-barra">
            {Array.from({ length: MAX_RANURAS }).map((_, i) => (
              <span
                key={i}
                className={`equipos__ranura${i < ranurasOcupadas ? " equipos__ranura--ocupada" : ""}`}
              />
            ))}
          </div>
        </section>
 
        <section className="equipos__panel">
          <h4 className="equipos__panel-titulo">Beneficios de estar en un equipo</h4>
          <ul className="equipos__beneficios">
            {BENEFICIOS.map((beneficio) => (
              <li key={beneficio} className="equipos__beneficio">
                <span className="equipos__beneficio-icono" aria-hidden="true" />
                {beneficio}
              </li>
            ))}
          </ul>
        </section>
 
        <section className="equipos__panel">
          <h4 className="equipos__panel-titulo">¿Necesitas ayuda?</h4>
          <p className="equipos__panel-texto">¿Problemas con un equipo? Contacta a nuestro soporte.</p>
          <button type="button" className="equipos__btn-soporte">
            Soporte de contacto →
          </button>
        </section>
      </aside>
    </div>
  );
};
 
export default Equipos;