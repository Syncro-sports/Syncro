export type StaffRolId = "administrador" | "gestor" | "operador" | "soporte" | "personalizado";
export type StaffEstado = "activo" | "inactivo";

export interface StaffUsuario {
  id: string;
  nombre: string;
  esOwner?: boolean;
  email: string;
  rol: StaffRolId;
  ultimoAcceso: string;
  estado: StaffEstado;
}

export interface StaffRolInfo {
  id: StaffRolId;
  nombre: string;
  descripcion: string;
}

export const STAFF_ROLES: StaffRolInfo[] = [
  {
    id: "administrador",
    nombre: "Administrador",
    descripcion: "Acceso completo a todas las funciones y configuraciones de la plataforma.",
  },
  {
    id: "gestor",
    nombre: "Gestor",
    descripcion: "Gestiona reservas, canchas, caja y reportes. Sin acceso a configuración.",
  },
  {
    id: "operador",
    nombre: "Operador",
    descripcion: "Puede gestionar reservas y canchas. Acceso limitado a caja.",
  },
  {
    id: "soporte",
    nombre: "Soporte",
    descripcion: "Acceso a reservas y contacto para brindar soporte a usuarios.",
  },
  {
    id: "personalizado",
    nombre: "Personalizado",
    descripcion: "Roles con permisos específicos configurados manualmente.",
  },
];

export const STAFF_ESTADOS: { id: StaffEstado; label: string }[] = [
  { id: "activo", label: "Activo" },
  { id: "inactivo", label: "Inactivo" },
];

interface DatosStaff {
  usuariosTotales: number;
  usuariosTotalesDeltaMes: number;
  usuariosActivos: number;
  invitacionesPendientes: number;
  ultimoAccesoUsuario: string;
  ultimoAccesoFecha: string;
  usuarios: StaffUsuario[];
}

// Cuando el equipo de backend conecte esta vista, esta bandera pasa a venir
// de un contexto de autenticacion o de la respuesta real del fetch
const sesionIniciada = false;

const datosStaffMock: DatosStaff = {
  usuariosTotales: 6,
  usuariosTotalesDeltaMes: 1,
  usuariosActivos: 5,
  invitacionesPendientes: 1,
  ultimoAccesoUsuario: "/insertUser",
  ultimoAccesoFecha: "Hoy, 16:25",
  usuarios: [
    { id: "1", nombre: "/insertUser", esOwner: true, email: "insertUser@gmail.com", rol: "administrador", ultimoAcceso: "Hoy, 16:25", estado: "activo" },
    { id: "2", nombre: "Juan Pérez", email: "insertUser@gmail.com", rol: "gestor", ultimoAcceso: "Hoy, 16:25", estado: "activo" },
    { id: "3", nombre: "Martin Juarez", email: "insertUser@gmail.com", rol: "operador", ultimoAcceso: "Hoy, 16:25", estado: "inactivo" },
    { id: "4", nombre: "Pedro Gómez", email: "insertUser@gmail.com", rol: "soporte", ultimoAcceso: "Hoy, 16:25", estado: "inactivo" },
    { id: "5", nombre: "Ricardo almada", email: "insertUser@gmail.com", rol: "operador", ultimoAcceso: "Hoy, 16:25", estado: "activo" },
    // Página 2: datos genéricos de ejemplo, no estaban definidos en el Figma
    { id: "6", nombre: "Usuario Seis", email: "usuarioseis@gmail.com", rol: "gestor", ultimoAcceso: "Ayer, 10:12", estado: "activo" },
    { id: "7", nombre: "Usuario Siete", email: "usuariosiete@gmail.com", rol: "soporte", ultimoAcceso: "Ayer, 09:40", estado: "activo" },
    { id: "8", nombre: "Usuario Ocho", email: "usuarioocho@gmail.com", rol: "operador", ultimoAcceso: "Hace 3 días", estado: "inactivo" },
    { id: "9", nombre: "Usuario Nueve", email: "usuarionueve@gmail.com", rol: "administrador", ultimoAcceso: "Hace 5 días", estado: "activo" },
    { id: "10", nombre: "Usuario Diez", email: "usuariodiez@gmail.com", rol: "personalizado", ultimoAcceso: "Hace 1 semana", estado: "inactivo" },
  ],
};

const datosStaffReal: DatosStaff = {
  usuariosTotales: 0, // ddbb_usuarios_totales
  usuariosTotalesDeltaMes: 0, // ddbb_usuarios_delta_mes
  usuariosActivos: 0, // ddbb_usuarios_activos
  invitacionesPendientes: 0, // ddbb_invitaciones_pendientes
  ultimoAccesoUsuario: "", // ddbb_ultimo_acceso_usuario
  ultimoAccesoFecha: "", // ddbb_ultimo_acceso_fecha
  usuarios: [], // ddbb_usuarios
};

export const datosStaff: DatosStaff = sesionIniciada ? datosStaffReal : datosStaffMock;