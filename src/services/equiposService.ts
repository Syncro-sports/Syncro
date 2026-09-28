import { apiClient } from "./apiClient";
import { EQUIPOS_DETALLE_MOCK, EquipoDetalleData } from "../pages/Equipos/equipoDetalleData";
import { backendConectado as equiposBackendConectado } from "../pages/PerfilPlayer/Equipos";

// Backup generico: si no hay datos para el id pedido, mostramos este equipo
// de ejemplo en vez de nada (por ejemplo si el id vino de datos reales,
// como un _id de Mongo, que no matchea con las claves del mock)
const BACKUP_POR_DEFECTO = Object.values(EQUIPOS_DETALLE_MOCK)[0];

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
};
