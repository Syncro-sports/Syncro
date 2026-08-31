const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export interface MetricasCaja {
  ingresosTotales: number;
  totalReservas: number;
  reservas: any[];
}

export const cajaService = {
  obtenerMetricas: async (): Promise<MetricasCaja> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No hay sesión iniciada");

    const response = await fetch(`${API_URL}/caja/metricas`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.mensaje || "Error al obtener las métricas de caja");
    }

    return await response.json();
  }
};
