import { Link, NavLink } from "react-router-dom";
import { ClockIcon, DashboardIcon, GearIcon, StarIcon } from "./icons";
import "./Sidebar.css";

const NAV_ITEMS = [
  { to: "/perfil-host", label: "Dashboard", icon: DashboardIcon, end: true },
  { to: "/perfil-host/reservas", label: "Reservas", icon: ClockIcon, end: false },
  { to: "/perfil-host/canchas", label: "Canchas", icon: null, iconSrc: `${import.meta.env.BASE_URL}assets/icons/canchas.svg`, end: false },
  { to: "/perfil-host/caja", label: "Caja", icon: null, iconSrc: `${import.meta.env.BASE_URL}assets/icons/dinero.svg`, end: false },
  { to: "/perfil-host/estadisticas", label: "Estadisticas", icon: null, iconSrc: `${import.meta.env.BASE_URL}assets/icons/estadistica.svg`, end: false },
  { to: "/perfil-host/staff", label: "Staff", icon: null, iconSrc: `${import.meta.env.BASE_URL}assets/icons/equipos.svg`, end: false },
  { to: "/perfil-host/valoraciones", label: "Valoraciones", icon: StarIcon, end: false },
  { to: "/perfil-host/configuracion", label: "Configuración", icon: GearIcon, end: false },
];

const Sidebar = () => {
  return (
    <aside className="host-sidebar">
      <Link to="/" className="host-sidebar__brand">
        <img src={`${import.meta.env.BASE_URL}assets/logo-white.svg`} alt="Syncro" />
        <span>Syncro</span>
      </Link>

      <nav className="host-sidebar__nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `host-sidebar__link ${isActive ? "is-active" : ""}`}
          >
            <span className="host-sidebar__icon">
              {item.icon ? <item.icon /> : <img src={item.iconSrc} alt="" />}
            </span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
