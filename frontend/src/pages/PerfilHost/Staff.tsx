import { useState } from "react";
import { HostCard } from "./components/StatCard";
import PeriodSelect from "./components/PeriodSelect";
import { datosStaff, STAFF_ROLES, STAFF_ESTADOS, StaffRolId, StaffEstado } from "./staffData";
import "./Staff.css";

const ICON_BASE = `${import.meta.env.BASE_URL}assets/icons`;

const Staff = () => {
  const porcentajeActivos = Math.round((datosStaff.usuariosActivos / datosStaff.usuariosTotales) * 100);
  const [busqueda, setBusqueda] = useState("");
  const [rolFiltro, setRolFiltro] = useState<StaffRolId | "todos">("todos");
  const [estadoFiltro, setEstadoFiltro] = useState<StaffEstado | "todos">("todos");

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

      <div className="host-staff__filters">
        <div className="host-staff__search">
          <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="host-staff__search-icon">
            <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
            <path d="M13.5 13.5L17.5 17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Buscar usuario..."
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
          />
        </div>

        <PeriodSelect
          value={rolFiltro}
          onChange={(value) => setRolFiltro(value as StaffRolId | "todos")}
          options={[{ value: "todos", label: "Todos los roles" }, ...STAFF_ROLES.map((rol) => ({ value: rol.id, label: rol.nombre }))]}
        />

        <PeriodSelect
          value={estadoFiltro}
          onChange={(value) => setEstadoFiltro(value as StaffEstado | "todos")}
          options={[{ value: "todos", label: "Estado: Todos" }, ...STAFF_ESTADOS.map((estado) => ({ value: estado.id, label: estado.label }))]}
        />
      </div>
    </div>
  );
};

export default Staff;