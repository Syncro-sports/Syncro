import { HostCard } from "./components/StatCard";
import { datosStaff } from "./staffData";
import "./Staff.css";

const ICON_BASE = `${import.meta.env.BASE_URL}assets/icons`;

const Staff = () => {
  const porcentajeActivos = Math.round((datosStaff.usuariosActivos / datosStaff.usuariosTotales) * 100);

  return (
    <div className="host-staff">
      <div className="host-staff__header">
        <div>
          <h1>Staff</h1>
          <p>Gestiona los usuarios que pueden acceder y administrar la plataforma.</p>
        </div>
        <button type="button" className="host-invite-btn">
          + Invitar usuario
        </button>
      </div>

      <div className="host-staff__stats">
        <HostCard className="staff-stat-card">
          <span className="staff-stat-card__label">
            <img src={`${ICON_BASE}/equipos-2.svg`} alt="" />
            Usuarios totales
          </span>
          <strong className="staff-stat-card__value">{datosStaff.usuariosTotales}</strong>
          <span className="staff-stat-card__footer staff-stat-card__footer--green">
            +{datosStaff.usuariosTotalesDeltaMes} este mes
          </span>
        </HostCard>

        <HostCard className="staff-stat-card">
          <span className="staff-stat-card__label">
            <img src={`${ICON_BASE}/escudo-green.svg`} alt="" />
            Usuarios activos
          </span>
          <strong className="staff-stat-card__value">{datosStaff.usuariosActivos}</strong>
          <span className="staff-stat-card__footer staff-stat-card__footer--green">{porcentajeActivos}% del total</span>
        </HostCard>

        <HostCard className="staff-stat-card">
          <span className="staff-stat-card__label">
            <img src={`${ICON_BASE}/balon-mas.svg`} alt="" />
            Invitaciones pendientes
          </span>
          <strong className="staff-stat-card__value">{datosStaff.invitacionesPendientes}</strong>
          <a href="#" className="staff-stat-card__footer staff-stat-card__footer-link">
            Ver invitaciones →
          </a>
        </HostCard>

        <HostCard className="staff-stat-card">
          <span className="staff-stat-card__label">
            <img src={`${ICON_BASE}/reloj.svg`} alt="" />
            Último acceso
          </span>
          <strong className="staff-stat-card__value">{datosStaff.ultimoAccesoFecha}</strong>
          <span className="staff-stat-card__footer staff-stat-card__footer--green">{datosStaff.ultimoAccesoUsuario}</span>
        </HostCard>
      </div>
    </div>
  );
};

export default Staff;