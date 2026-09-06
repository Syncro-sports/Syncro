// optimizacion-servicios-apiclient
import { PARTIDOS, Partido } from "../pages/Partidos/partidosData";
import { apiClient } from "./apiClient";

export const partidosService = {
  obtenerPartidos: async (): Promise<Partido[]> => {
    try {
      const data = await apiClient.get<Partido[]>("/partidos", { auth: false });

      // Si el backend no devolvió datos, usamos los mocks
      if (!data || data.length === 0) {
        console.warn("No hay partidos en la DB, usando mock data");
        return PARTIDOS;
      }

      return data;
    } catch (error) {
      console.warn("Backend offline o error CORS, usando fallback a PARTIDOS mock", error);
      return PARTIDOS;
    }
  },

  unirse: async (partidoId: string | number): Promise<any> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No hay sesión iniciada");

    return apiClient.post(`/matchmaking/${partidoId}/unirse`, undefined, {
      mensajeError: "Error al unirse al partido",
    });
  },
};
