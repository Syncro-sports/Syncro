import { PARTIDOS } from "../pages/Partidos/partidosData";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const partidosService = {
  obtenerPartidos: async (filtros?: any) => {
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
      if (!data || data.length === 0) {
        console.warn("No hay partidos en la DB, usando mock data");
        return PARTIDOS;
      }
      return data;
    } catch (error) {
      console.warn("Backend offline o error, usando fallback a PARTIDOS", error);
      return PARTIDOS;
    }
  },

  unirseAPartido: async (idPartido: string) => {
    try {
      const token = localStorage.getItem("token");
      const headers: any = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(`${API_URL}/partidos/${idPartido}/unirse`, {
        method: "POST",
        headers,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.mensaje || "Error al unirse al partido");
      }
      return await response.json();
    } catch (error) {
      console.error("Error en partidosService.unirseAPartido:", error);
      throw error; // Propagamos para que el UI muestre el toast
    }
  }
};
