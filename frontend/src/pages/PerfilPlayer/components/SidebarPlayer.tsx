import { NavLink } from "react-router-dom";
import { datosUsuario, calcularNivel, obtenerRangoIcono } from "../playerData";
import "./SidebarPlayer.css";

const NAV_ITEMS = [
  { to: "/perfil-jugador", label: "Dashboard", iconSrc: `${import.meta.env.BASE_URL}assets/icons/dashboard-syncro.svg`, end: true },
  { to: "/perfil-jugador/reservas", label: "Reservas", iconSrc: `${import.meta.env.BASE_URL}assets/icons/reservas-dashboard.svg`, end: false },
  { to: "/perfil-jugador/historial", label: "Historial", iconSrc: `${import.meta.env.BASE_URL}assets/icons/historial-dashboard.svg`, end: false },
  { to: "/perfil-jugador/pagos", label: "Pagos", iconSrc: `${import.meta.env.BASE_URL}assets/icons/pagos-dashboard.svg`, end: false },
  { to: "/perfil-jugador/equipos", label: "Equipos", iconSrc: `${import.meta.env.BASE_URL}assets/icons/equipos-dashboard.svg`, end: false },
  { to: "/perfil-jugador/configuracion", label: "Configuración", iconSrc: `${import.meta.env.BASE_URL}assets/icons/config-dashboard.svg`, end: false },
];

const SidebarPlayer = () => {
  const { nivel, xpActual, xpRestante, porcentaje } = calcularNivel(datosUsuario.expTotal);

  return (
    <aside className="player-sidebar">
      <div className="player-sidebar__profile">
        <div className="player-sidebar__avatar">
          <img src={`${import.meta.env.BASE_URL}assets/icons/perfil-header.svg`} alt="" />
          <img
            className="player-sidebar__badge"
            src={`${import.meta.env.BASE_URL}assets/icons/${obtenerRangoIcono(nivel)}`}
            alt={`Rango nivel ${nivel}`}
          />
        </div>

        <span className="player-sidebar__username">/{datosUsuario.usuario}</span>
        <span className="player-sidebar__nivel">Nivel {nivel}</span>

        <div className="player-sidebar__progress">
          <span className="player-sidebar__bar">
            <span className="player-sidebar__bar-fill" style={{ width: `${porcentaje}%` }} />
          </span>
          <span className="player-sidebar__xp">{xpActual} / 1600 XP</span>
          <span className="player-sidebar__xp-restante">{xpRestante} XP para el próximo nivel</span>
        </div>
      </div>

      <nav className="player-sidebar__nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `player-sidebar__link ${isActive ? "is-active" : ""}`}
          >
            <span className="player-sidebar__icon">
              <img src={item.iconSrc} alt="" />
            </span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button type="button" className="player-sidebar__logout">
        <span className="player-sidebar__icon">
          <img src={`${import.meta.env.BASE_URL}assets/icons/logout.svg`} alt="" />
        </span>
        Cerrar sesión
      </button>
    </aside>
  );
};

export default SidebarPlayer;