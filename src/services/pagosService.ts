// optimizacion-servicios-apiclient
import { apiClient } from "./apiClient";

export type TipoPago = "senia" | "total";

interface RespuestaPreferencia {
  preferenceId: string;
  initPoint: string;
}

export const pagosService = {
  // El frontend NO manda ningun monto: solo identifica la reserva y que se quiere
  // pagar (seña o total). El backend calcula el importe a partir de la reserva,
  // asi que modificar valores desde DevTools no cambia lo que se cobra.
  crearPreferencia: async (reservaId: string, tipo: TipoPago): Promise<string> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No hay sesión iniciada");

    const data = await apiClient.post<RespuestaPreferencia>(
      "/pagos/preferencia",
      { reservaId, tipo },
      { mensajeError: "Error al conectar con MercadoPago" },
    );
    return data.initPoint;
  },
};
