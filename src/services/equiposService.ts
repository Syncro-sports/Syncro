// Conecta con /api/equipos. Mismo patrón que authService: apiClient + tipos explícitos.
import { apiClient } from "./apiClient";
import { authService } from "./authService";

export type Sexo = "MASCULINO" | "FEMENINO" | "MIXTO";
export type Nivel = "A" | "B" | "C";
export type Posicion = "ARQ" | "DEF" | "MED" | "DEL";
export type ResultadoPartido = "VICTORIA" | "EMPATE" | "DERROTA";

export interface Jugador {
  id: string;
  nombre: string;
  fotoPerfil: string;
  posicion: Posicion | null;
  esCapitan: boolean;
  esPropietario: boolean;
  desde: string;
}

export interface PartidoHistorial {
  idPartido: string | null;
  fecha: string;
  resultado: ResultadoPartido;
  rivalNombre: string;
  golesFavor: number;
  golesContra: number;
}

// Se completa solo cuando hay un usuario logueado (GET /equipos/:id con token)
export interface ViewerEquipo {
  esMiembro: boolean;
  esPropietario: boolean;
  esCapitan: boolean;
  solicitudPendiente: boolean;
  puedeSolicitar: boolean;
}

export interface Equipo {
  id: string;
  nombre: string;
  fotoPerfil: string;
  descripcion: string;
  puntos: number;
  ubicacion: string;
  sexo: Sexo;
  nivel: Nivel;
  cupoMaximo: number;
  jugadoresCant: number;
  creadorId: string;
  creadoEn?: string;
}

export interface EquipoDetalle extends Equipo {
  jugadores: Jugador[];
  historial: PartidoHistorial[];
  racha: ResultadoPartido[];
  viewer: ViewerEquipo | null;
}

// Equipo + banderas propias de "mis equipos", que el listado público no trae
export interface MiEquipo extends Equipo {
  esPropietario: boolean;
  esCapitan: boolean;
  solicitudesPendientes: number;
}

export interface Solicitud {
  usuarioId: string;
  nombre: string;
  fotoPerfil: string;
  mensaje: string;
  fecha: string;
}

export interface ListarEquiposFiltros {
  nivel?: Nivel[];
  sexo?: Sexo[];
  ubicacion?: string;
  orden?: "puntos" | "nombre" | "recientes";
  pagina?: number;
  limite?: number;
}

export interface ListadoEquipos {
  equipos: Equipo[];
  total: number;
  pagina: number;
  limite: number;
  totalPaginas: number;
}

export interface MisEquipos {
  equipos: MiEquipo[];
  ranurasUsadas: number;
  ranurasMax: number;
}

export interface CrearEquipoDatos {
  nombre: string;
  ubicacion: string;
  sexo: Sexo;
  nivel: Nivel;
  descripcion?: string;
  fotoPerfil?: string;
  cupoMaximo?: number;
  posicion?: Posicion;
}

export type ActualizarEquipoDatos = Partial<
  Pick<CrearEquipoDatos, "nombre" | "descripcion" | "fotoPerfil" | "ubicacion" | "sexo" | "nivel" | "cupoMaximo">
>;

// Arma el query string de /equipos a partir de los filtros, sin mandar claves vacías
const armarQuery = (filtros: ListarEquiposFiltros): string => {
  const params = new URLSearchParams();
  if (filtros.nivel?.length) params.set("nivel", filtros.nivel.join(","));
  if (filtros.sexo?.length) params.set("sexo", filtros.sexo.join(","));
  if (filtros.ubicacion) params.set("ubicacion", filtros.ubicacion);
  if (filtros.orden) params.set("orden", filtros.orden);
  if (filtros.pagina) params.set("pagina", String(filtros.pagina));
  if (filtros.limite) params.set("limite", String(filtros.limite));
  const query = params.toString();
  return query ? `?${query}` : "";
};

export const equiposService = {
  // Público: no hace falta estar logueado
  listar: (filtros: ListarEquiposFiltros = {}) =>
    apiClient.get<ListadoEquipos>(`/equipos${armarQuery(filtros)}`, { auth: false }),

  // Público, pero con token manda más info en "viewer" (si ya sos miembro, si podés solicitar, etc.)
  obtenerPorId: (id: string) => apiClient.get<EquipoDetalle>(`/equipos/${id}`, { auth: authService.haySesion() }),

  obtenerMisEquipos: () => apiClient.get<MisEquipos>("/equipos/mis-equipos"),

  crear: (datos: CrearEquipoDatos) =>
    apiClient.post<{ mensaje: string; equipo: Equipo }>("/equipos", datos, {
      mensajeError: "No se pudo crear el equipo",
    }),

  actualizar: (id: string, datos: ActualizarEquipoDatos) =>
    apiClient.put<{ mensaje: string; equipo: Equipo }>(`/equipos/${id}`, datos, {
      mensajeError: "No se pudo actualizar el equipo",
    }),

  eliminar: (id: string) =>
    apiClient.del<{ mensaje: string }>(`/equipos/${id}`, { mensajeError: "No se pudo eliminar el equipo" }),

  // "Solicitar entrar", desde el detalle público del equipo
  solicitarIngreso: (id: string, mensaje?: string) =>
    apiClient.post<{ mensaje: string }>(
      `/equipos/${id}/solicitudes`,
      { mensaje },
      { mensajeError: "No se pudo enviar la solicitud" },
    ),

  // Para el capitán/propietario: ver quién pidió entrar
  listarSolicitudes: (id: string) =>
    apiClient.get<{ solicitudes: Solicitud[] }>(`/equipos/${id}/solicitudes`, {
      mensajeError: "No se pudieron obtener las solicitudes",
    }),

  responderSolicitud: (id: string, usuarioId: string, accion: "ACEPTAR" | "RECHAZAR", posicion?: Posicion) =>
    apiClient.patch<{ mensaje: string }>(
      `/equipos/${id}/solicitudes/${usuarioId}`,
      { accion, posicion },
      { mensajeError: "No se pudo responder la solicitud" },
    ),

  actualizarMiembro: (id: string, usuarioId: string, cambios: { posicion?: Posicion; esCapitan?: boolean }) =>
    apiClient.patch<{ mensaje: string }>(`/equipos/${id}/miembros/${usuarioId}`, cambios, {
      mensajeError: "No se pudo actualizar al jugador",
    }),

  // Expulsar a alguien (o salir uno mismo, pasando el propio id)
  quitarMiembro: (id: string, usuarioId: string) =>
    apiClient.del<{ mensaje: string }>(`/equipos/${id}/miembros/${usuarioId}`, {
      mensajeError: "No se pudo quitar al jugador del equipo",
    }),
};