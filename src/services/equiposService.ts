import { apiClient } from "./apiClient";
import { EQUIPOS_DETALLE_MOCK, EquipoDetalleData } from "../pages/Equipos/equipoDetalleData";
import { backendConectado as equiposBackendConectado } from "../pages/PerfilPlayer/Equipos";

// Backup generico: si no hay datos para el id pedido, mostramos este equipo
// de ejemplo en vez de nada (por ejemplo si el id vino de datos reales,
// como un _id de Mongo, que no matchea con las claves del mock)
const BACKUP_POR_DEFECTO = Object.values(EQUIPOS_DETALLE_MOCK)[0];

export interface MiEquipoResumen {
  id: string;
  nombre: string;
  logoUrl?: string;
}

const ICON_BASE = `${import.meta.env.BASE_URL}assets/icons`;

// Mismos equipos de ejemplo que usa "Mis Equipos" del jugador (ver
// pages/PerfilPlayer/Equipos.tsx), resumidos a lo minimo que necesita un
// selector: id y nombre. Cuando el backend este listo, "obtenerMisEquipos"
// pasa a pedirlos de verdad sin que el componente que lo consume cambie nada.
const MIS_EQUIPOS_MOCK: MiEquipoResumen[] = [
  { id: "titanes", nombre: "Los Titanes", logoUrl: `${ICON_BASE}/titanes-escudo.png` },
  { id: "norte-united", nombre: "Norte United", logoUrl: `${ICON_BASE}/norte-united-escudo.png` },
];

export const equiposService = {
  obtenerDetalle: async (id: string): Promise<EquipoDetalleData | undefined> => {
    // Mientras el dominio "equipos" siga en modo mock (misma bandera que usa
    // la lista "Mis Equipos"), ni intentamos el fetch real: evita que el
    // detalle diga "no encontrado" para un id mock que el backend real,
    // aunque este online, nunca va a reconocer.
    if (!equiposBackendConectado) {
      return EQUIPOS_DETALLE_MOCK[id] ?? BACKUP_POR_DEFECTO;
    }

    try {
      const data = await apiClient.get<EquipoDetalleData>(`/equipos/${id}`, { auth: false });

      if (!data) {
        // el backend respondio pero no hay datos: el equipo realmente no existe
        console.warn(`El backend de equipos respondio sin datos para el id "${id}"`);
        return undefined;
      }

      return data;
    } catch (error) {
      // el dominio ya esta conectado pero esta puntual llamada fallo (offline, CORS, etc.):
      // mostramos el mock del propio id si existe, y si no, el backup generico
      console.warn("Backend de equipos no disponible en este momento, usando backup", error);
      return EQUIPOS_DETALLE_MOCK[id] ?? BACKUP_POR_DEFECTO;
    }
  },

  // Equipos propios del jugador logueado, para elegir con cual postularse a
  // un partido abierto. Mismo criterio que el resto del dominio: mientras
  // "equipos" siga en modo mock, devolvemos el mock directamente.
  obtenerMisEquipos: async (): Promise<MiEquipoResumen[]> => {
    if (!equiposBackendConectado) {
      return MIS_EQUIPOS_MOCK;
    }

    try {
      const data = await apiClient.get<MiEquipoResumen[]>("/equipos/mios");
      return data && data.length > 0 ? data : MIS_EQUIPOS_MOCK;
    } catch (error) {
      console.warn("No se pudieron obtener tus equipos, usando mock", error);
      return MIS_EQUIPOS_MOCK;
    }
  },
};
