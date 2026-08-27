import { PARTIDOS, Partido } from "../pages/Partidos/partidosData";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const partidosService = {
  // Cambio para el merge: se combinan los filtros (confirmados contra el
  // controller real, que sí los lee) con el tipado de develop
  obtenerPartidos: async (filtros?: any): Promise<Partido[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (filtros) {
        if (filtros.tipo) queryParams.append("tipo", filtros.tipo);
        if (filtros.nivel) queryParams.append("nivel", filtros.nivel);
        if (filtros.orden) queryParams.append("orden", filtros.orden);
        if (filtros.horario) queryParams.append("horario", filtros.horario);
      }

      const response = await fetch(`${API_URL}/partidos?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error("Error al obtener partidos del backend");
      }

      const data = await response.json();
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

  // Cambio para el merge: se mantiene esta versión (pega a /matchmaking, que
  // es la ruta real que existe en el backend); la otra pegaba a /partidos/:id/unirse,
  // que no existe, y además nada del código llama a ese nombre
  unirse: async (partidoId: string | number): Promise<any> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No hay sesión iniciada");

    const response = await fetch(`${API_URL}/matchmaking/${partidoId}/unirse`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.mensaje || "Error al unirse al partido");
    }

    return await response.json();
  },
};
