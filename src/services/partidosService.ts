import { PARTIDOS, Partido } from "../pages/Partidos/partidosData";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const partidosService = {
  obtenerPartidos: async (): Promise<Partido[]> => {
    try {
      const response = await fetch(`${API_URL}/partidos`);
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

  unirse: async (partidoId: string | number): Promise<any> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No hay sesión iniciada");

    const response = await fetch(`${API_URL}/matchmaking/${partidoId}/unirse`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.mensaje || "Error al unirse al partido");
    }

    return await response.json();
  }
};
