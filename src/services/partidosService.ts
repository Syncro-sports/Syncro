// optimizacion-servicios-apiclient
import { partidoDePrueba } from "../pages/Partidos/partidoPrueba"; // TEMP-PRUEBA
import { PARTIDOS, Partido } from "../pages/Partidos/partidosData";
import { apiClient } from "./apiClient";

// El backend todavia manda los nombres de los equipos como "Equipo <id>" (ver
// partidos.service.ts del backend) y no trae ni el id ni la foto. Mientras tanto
// extraemos el id del texto y pedimos el equipo real (GET /equipos/:id, publico).
// TODO(back): devolver equipoLocalId / equipoLocalNombre / equipoLocalFoto reales
// (populate del equipo) y borrar esta resolucion.
const NOMBRE_PROVISORIO = /^Equipo ([0-9a-f]{24})$/i;

interface EquipoResumen {
  nombre: string;
  foto?: string;
}

const cacheEquipos = new Map<string, EquipoResumen | null>();

const resolverEquipo = async (id: string): Promise<EquipoResumen | null> => {
  if (cacheEquipos.has(id)) return cacheEquipos.get(id) ?? null;
  try {
    const equipo = await apiClient.get<{ nombre: string; fotoPerfil?: string }>(`/equipos/${id}`, { auth: false });
    const resumen = equipo?.nombre ? { nombre: equipo.nombre, foto: equipo.fotoPerfil || undefined } : null;
    cacheEquipos.set(id, resumen);
    return resumen;
  } catch {
    cacheEquipos.set(id, null);
    return null;
  }
};

// Nunca mostramos un id crudo: si no se puede resolver, queda un nombre generico.
const completarEquipos = async (partido: Partido): Promise<Partido> => {
  const local = NOMBRE_PROVISORIO.exec(partido.equipoLocalNombre ?? "");
  const visitante = partido.equipoVisitanteNombre ? NOMBRE_PROVISORIO.exec(partido.equipoVisitanteNombre) : null;
  if (!local && !visitante) return partido;

  const [equipoLocal, equipoVisitante] = await Promise.all([
    local ? resolverEquipo(local[1]) : Promise.resolve(null),
    visitante ? resolverEquipo(visitante[1]) : Promise.resolve(null),
  ]);

  return {
    ...partido,
    ...(local && {
      equipoLocalId: local[1],
      equipoLocalNombre: equipoLocal?.nombre ?? "Equipo local",
      equipoLocalFoto: equipoLocal?.foto ?? partido.equipoLocalFoto,
    }),
    ...(visitante && {
      equipoVisitanteNombre: equipoVisitante?.nombre ?? "Equipo visitante",
    }),
  };
};

// El backend escribe siempre "Hoy, <dia> de <mes>" y marca todo como "hoy", aunque el partido
// sea otro dia. Calculamos la etiqueta y el filtro desde la fecha real (fechaProgramada),
// en la zona horaria del complejo.
// TODO(back): devolver fechaLabel / fechaTag correctos y borrar este calculo.
const DIAS_SEMANA = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

const diaEnZona = (fecha: Date, zona: string): { y: number; m: number; d: number } => {
  const partes = new Intl.DateTimeFormat("en-CA", { timeZone: zona, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(fecha);
  const valor = (tipo: string) => Number(partes.find((x) => x.type === tipo)?.value);
  return { y: valor("year"), m: valor("month"), d: valor("day") };
};

// El backend puede mandar el creador como id o como objeto ya populado
const normalizarCreador = (p: Partido): Partido => {
  const raw = (p as unknown as { creadorId?: unknown }).creadorId;
  const id = raw && typeof raw === "object" ? (raw as { _id?: unknown })._id : raw;
  return id ? { ...p, creadorId: String(id) } : p;
};

const completarFecha = (partido: Partido): Partido => {
  if (!partido.fechaProgramada) return partido;
  const fecha = new Date(partido.fechaProgramada);
  if (Number.isNaN(fecha.getTime())) return partido;

  try {
    const zona = partido.zonaHoraria || partido.zonaHorariaComplejo || "America/Argentina/Buenos_Aires";
    const evento = diaEnZona(fecha, zona);
    const hoy = diaEnZona(new Date(), zona);
    const diasHasta = Math.round((Date.UTC(evento.y, evento.m - 1, evento.d) - Date.UTC(hoy.y, hoy.m - 1, hoy.d)) / 86400000);
    const diaSemana = new Date(Date.UTC(evento.y, evento.m - 1, evento.d)).getUTCDay();

    const diaMes = `${evento.d} de ${MESES[evento.m - 1]}`;
    const nombreDia = DIAS_SEMANA[diaSemana];
    const fechaLabel = diasHasta === 0 ? `Hoy, ${diaMes}` : diasHasta === 1 ? `Mañana, ${diaMes}` : `${nombreDia}, ${diaMes}`;
    const fechaTag: Partido["fechaTag"] =
      diasHasta === 0 ? "hoy" : diasHasta === 1 ? "manana" : diaSemana === 0 || diaSemana === 6 ? "finde" : "semana";

    return { ...partido, fechaLabel, fechaTag, fechaCompleta: `${nombreDia}, ${diaMes} ${evento.y}` };
  } catch {
    return partido;
  }
};

export const partidosService = {
  obtenerPartidos: async (): Promise<Partido[]> => {
    try {
      const data = await apiClient.get<Partido[]>("/partidos", { auth: false });

      // Si el backend no devolvió datos, usamos los mocks
      if (!data || data.length === 0) {
        console.warn("No hay partidos en la DB, usando mock data");
        return [partidoDePrueba(), ...PARTIDOS]; // TEMP-PRUEBA
      }

      return [partidoDePrueba(), ...(await Promise.all(data.map((p) => completarEquipos(completarFecha(normalizarCreador(p))))))]; // TEMP-PRUEBA
    } catch (error) {
      console.warn("Backend offline o error CORS, usando fallback a PARTIDOS mock", error);
      return [partidoDePrueba(), ...PARTIDOS]; // TEMP-PRUEBA
    }
  },

  // Salir de un partido (por ejemplo, si despues de unirse no se pudo preparar el pago)
  bajarse: async (partidoId: string | number): Promise<void> => {
    await apiClient.post(`/matchmaking/${partidoId}/bajar`, {}, { mensajeError: "No se pudo salir del partido" });
  },

  unirse: async (partidoId: string | number, equipoId?: string): Promise<any> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No hay sesión iniciada");

    return apiClient.post(`/matchmaking/${partidoId}/unirse`, { equipoId }, {
      mensajeError: "Error al unirse al partido",
    });
  },
};
