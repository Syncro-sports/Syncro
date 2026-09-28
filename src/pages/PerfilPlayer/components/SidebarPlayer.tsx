import { NavLink } from "react-router-dom";
import { datosUsuario, calcularNivel, obtenerRangoIcono } from "../playerData";
import "./SidebarPlayer.css";

// Iconos inline con currentColor para que reaccionen al hover/activo del link
// (dashboard-syncro.svg y config-dashboard.svg quedan como imagen porque son
// PNG incrustado, no vector, y no se pueden recolorear asi -- pendiente aparte)
const IconoReservas = () => (
  <svg viewBox="0 0 30 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 11.0272H28.6697" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" />
    <path d="M27.1042 3.99487H2.56787C1.70196 3.99487 1 4.67992 1 5.52496V29.4699C1 30.315 1.70196 31 2.56787 31H27.1042C27.9701 31 28.672 30.315 28.672 29.4699V5.52496C28.672 4.67992 27.9701 3.99487 27.1042 3.99487Z" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" />
    <path d="M8.58887 1V6.8078" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" />
    <path d="M20.3047 1V6.8078" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" />
    <path d="M15.2235 14.5912H14.4443V15.3516H15.2235V14.5912Z" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" />
    <path d="M15.2235 20.5016H14.4443V21.262H15.2235V20.5016Z" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" />
    <path d="M7.2733 14.5912H6.49414V15.3516H7.2733V14.5912Z" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" />
    <path d="M7.2733 20.5016H6.49414V21.262H7.2733V20.5016Z" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" />
    <path d="M23.1581 14.5912H22.3789V15.3516H23.1581V14.5912Z" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" />
    <path d="M23.1581 20.5016H22.3789V21.262H23.1581V20.5016Z" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" />
    <path d="M15.2235 25.5771H14.4443V26.3374H15.2235V25.5771Z" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" />
    <path d="M7.2733 25.5771H6.49414V26.3374H7.2733V25.5771Z" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" />
    <path d="M23.1581 25.5771H22.3789V26.3374H23.1581V25.5771Z" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" />
  </svg>
);

const IconoHistorial = () => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 31C24.2843 31 31 24.2843 31 16C31 7.71573 24.2843 1 16 1C7.71573 1 1 7.71573 1 16C1 24.2843 7.71573 31 16 31Z" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" />
    <path d="M14.6211 9.66318V17.2611H22.8613" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconoPagos = () => (
  <svg viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.6469 0H15.9594L19.4281 0.69375L23.1281 2.54375L25.4406 4.39375L27.525 7.16875L28.9125 10.1781L29.6063 13.6469V15.9594L28.9125 19.4281L27.0625 23.1281L25.2094 25.4406L22.4344 27.525L19.4281 28.9125L15.9594 29.6063H13.6469L10.1781 28.9125L6.475 27.0625L4.1625 25.2094L2.08125 22.4344L0.69375 19.4281L0 15.9594V13.6469L0.69375 10.1781L1.61875 8.09375L3.00625 5.78125L4.39375 4.1625L7.16875 2.08125L9.48438 0.925L12.0281 0.23125L13.6469 0ZM14.3406 2.3125L11.3344 2.775L8.55625 3.93125L6.24375 5.78125L4.39375 7.8625L3.00625 10.6406L2.54375 12.2594L2.3125 15.2656L2.775 18.2719L3.93125 21.0469L5.78125 23.3594L7.8625 25.2094L10.6406 26.6L12.2594 27.0625L15.2656 27.2938L18.2719 26.8313L20.5844 25.9031L22.8969 24.2844L24.7469 22.4344L26.3656 19.6594L27.0625 17.3469L27.2938 14.3406L26.8313 11.3344L25.6719 8.55625L24.0531 6.475L22.4344 4.85625L19.6594 3.2375L17.3469 2.54375L14.3406 2.3125Z" fill="currentColor" />
    <path d="M13.6473 6.24377H15.9598V8.78752H17.3473L18.966 9.9469L19.6598 11.3344V12.2594H17.3473L16.6535 11.3344H12.9535L12.491 11.7969L12.7223 12.9532L14.341 13.4157L17.8098 14.1094L19.1973 15.2657L19.6598 16.4219V18.2719L18.5035 20.1219L17.116 20.8157H15.9598V23.3594H13.6473V20.8157H12.2598L10.641 19.6594L9.94727 18.2719V17.3469H12.2598L12.9535 18.2719H16.6535L17.116 17.8094L16.8848 16.6532L15.266 16.1907L11.7973 15.4969L10.4098 14.3407L9.94727 13.1844V11.3344L11.1035 9.4844L12.2598 8.78752H13.6473V6.24377Z" fill="currentColor" />
  </svg>
);

const IconoEquipos = () => (
  <svg viewBox="0 0 36 31" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.3687 15.6293C16.4265 15.6293 19.716 12.3544 19.716 8.31465C19.716 4.27488 16.4265 1 12.3687 1C8.31096 1 5.02148 4.27488 5.02148 8.31465C5.02148 12.3544 8.31096 15.6293 12.3687 15.6293Z" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" />
    <path d="M26.7826 14.854C29.5641 14.854 31.819 12.6091 31.819 9.83987C31.819 7.07064 29.5641 4.82574 26.7826 4.82574C24.001 4.82574 21.7461 7.07064 21.7461 9.83987C21.7461 12.6091 24.001 14.854 26.7826 14.854Z" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" />
    <path d="M1 29.9959V25.7169C1 21.8297 4.16615 18.6776 8.07064 18.6776H16.6669C20.5714 18.6776 23.7376 21.8297 23.7376 25.7169V29.9959" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" />
    <path d="M22.6826 18.3895H27.9234C31.8279 18.3895 34.994 21.5416 34.994 25.4287V29.7078" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" />
  </svg>
);

const NAV_ITEMS = [
  { to: "/perfil-jugador", label: "Dashboard", iconSrc: `${import.meta.env.BASE_URL}assets/icons/dashboard-syncro.svg`, end: true },
  { to: "/perfil-jugador/reservas", label: "Reservas", Icono: IconoReservas, end: false },
  { to: "/perfil-jugador/historial", label: "Historial", Icono: IconoHistorial, end: false },
  { to: "/perfil-jugador/pagos", label: "Pagos", Icono: IconoPagos, end: false },
  { to: "/perfil-jugador/equipos", label: "Equipos", Icono: IconoEquipos, end: false },
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
              {item.Icono ? <item.Icono /> : <img src={item.iconSrc} alt="" />}
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
