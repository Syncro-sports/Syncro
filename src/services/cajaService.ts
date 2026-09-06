// optimizacion-servicios-apiclient
import { apiClient } from "./apiClient";

export interface MetricasCaja {
  ingresosTotales: number;
  totalReservas: number;
  reservas: any[];
}

export const cajaService = {
  obtenerMetricas: async (): Promise<MetricasCaja> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No hay sesión iniciada");

    return apiClient.get<MetricasCaja>("/caja/metricas", {
      mensajeError: "Error al obtener las métricas de caja",
    });
  },
};
