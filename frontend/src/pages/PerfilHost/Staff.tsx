import { useMemo, useState } from "react";
import { HostCard } from "./components/StatCard";
import PeriodSelect from "./components/PeriodSelect";
import { ChevronLeftIcon, ChevronRightIcon } from "./components/icons";
import { datosStaff, STAFF_ROLES, STAFF_ESTADOS, StaffRolId, StaffEstado } from "./staffData";
import "./Staff.css";

const ICON_BASE = `${import.meta.env.BASE_URL}assets/icons`;
const POR_PAGINA = 5;

const rolLabel = (id: StaffRolId) => STAFF_ROLES.find((rol) => rol.id === id)?.nombre ?? id;

const Staff = () => {
  const porcentajeActivos = Math.round((datosStaff.usuariosActivos / datosStaff.usuariosTotales) * 100);
  const [busqueda, setBusqueda] = useState("");
  const [rolFiltro, setRolFiltro] = useState<StaffRolId | "todos">("todos");
  const [estadoFiltro, setEstadoFiltro] = useState<StaffEstado | "todos">("todos");
  const [pagina, setPagina] = useState(1);

  const usuariosFiltrados = useMemo(() => {
    return datosStaff.usuarios.filter((usuario) => {
      const coincideBusqueda = usuario.nombre.toLowerCase().includes(busqueda.toLowerCase());
      const coincideRol = rolFiltro === "todos" || usuario.rol === rolFiltro;
      const coincideEstado = estadoFiltro === "todos" || usuario.estado === estadoFiltro;
      return coincideBusqueda && coincideRol && coincideEstado;
    });
  }, [busqueda, rolFiltro, estadoFiltro]);

  const totalPaginas = Math.max(1, Math.ceil(usuariosFiltrados.length / POR_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);
  const usuariosPagina = usuariosFiltrados.slice(
    (paginaActual - 1) * POR_PAGINA,
    paginaActual * POR_PAGINA
  );

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
            onChange={(event) => {
              setBusqueda(event.target.value);
              setPagina(1);
            }}
          />
        </div>

        <PeriodSelect
          value={rolFiltro}
          onChange={(value) => {
            setRolFiltro(value as StaffRolId | "todos");
            setPagina(1);
          }}
          options={[{ value: "todos", label: "Todos los roles" }, ...STAFF_ROLES.map((rol) => ({ value: rol.id, label: rol.nombre }))]}
        />

        <PeriodSelect
          value={estadoFiltro}
          onChange={(value) => {
            setEstadoFiltro(value as StaffEstado | "todos");
            setPagina(1);
          }}
          options={[{ value: "todos", label: "Estado: Todos" }, ...STAFF_ESTADOS.map((estado) => ({ value: estado.id, label: estado.label }))]}
        />
      </div>

      <HostCard className="host-staff__table-card">
        <table className="host-staff-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Correo electronico</th>
              <th>Rol</th>
              <th>Ultimo acceso</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosPagina.length === 0 && (
              <tr className="host-staff-table__empty-row">
                <td colSpan={6}>Sin usuarios que coincidan con los filtros.</td>
              </tr>
            )}
            {usuariosPagina.map((usuario) => (
              <tr key={usuario.id}>
                <td>
                  <div className="host-staff-table__user">
                    <span className="host-staff-table__avatar">
                      <img src={`${ICON_BASE}/perfil-green.svg`} alt="" />
                    </span>
                    {usuario.nombre}
                    {usuario.esOwner && <span className="host-staff-table__owner-tag">Owner</span>}
                  </div>
                </td>
                <td>{usuario.email}</td>
                <td>
                  <span className={`host-staff-table__rol host-staff-table__rol--${usuario.rol}`}>
                    {rolLabel(usuario.rol)}
                  </span>
                </td>
                <td>{usuario.ultimoAcceso}</td>
                <td>
                  <span className="host-staff-table__estado">
                    <span className={`host-staff-table__estado-dot host-staff-table__estado-dot--${usuario.estado}`} />
                    {usuario.estado === "activo" ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td>
                  <button type="button" className="host-staff-table__actions">
                    ...
                  </button>
                </td>
              </tr>
            ))}
            {Array.from({ length: POR_PAGINA - usuariosPagina.length }).map((_, index) => (
              <tr key={`empty-${index}`} className="host-staff-table__empty-row">
                <td colSpan={6} />
              </tr>
            ))}
          </tbody>
        </table>

        <div className="host-staff__table-footer">
          <span>
            Mostrando {usuariosPagina.length} de {usuariosFiltrados.length} usuarios
          </span>
          <div className="host-staff__pagination">
            <button
              type="button"
              onClick={() => setPagina((prev) => Math.max(1, prev - 1))}
              disabled={paginaActual === 1}
            >
              <ChevronLeftIcon />
            </button>
            <span className="host-staff__pagination-page">{paginaActual}</span>
            <button
              type="button"
              onClick={() => setPagina((prev) => Math.min(totalPaginas, prev + 1))}
              disabled={paginaActual === totalPaginas}
            >
              <ChevronRightIcon />
            </button>
          </div>
        </div>
      </HostCard>

      <HostCard className="host-staff__roles">
        <div className="host-staff__roles-header">
          <div>
            <h2>Roles y permisos</h2>
            <p>Resumen de los roles disponibles en la plataforma.</p>
          </div>
          <button type="button" className="host-manage-roles-btn">
            Gestionar roles
          </button>
        </div>

        <div className="host-staff__roles-grid">
          {STAFF_ROLES.map((rol) => (
            <div className="host-role-card" key={rol.id}>
              <span className={`host-role-card__tag host-role-card__tag--${rol.id}`}>{rol.nombre}</span>
              <p>{rol.descripcion}</p>
            </div>
          ))}
        </div>
      </HostCard>
    </div>
  );
};

export default Staff;