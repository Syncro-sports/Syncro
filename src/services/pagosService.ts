// optimizacion-servicios-apiclient
import { apiClient } from "./apiClient";

export type TipoPago = "senia" | "total";

// El backend documenta "initPoint", pero algunas versiones devuelven "init_point" (nombre que usa
// Mercado Pago): se aceptan ambos para no quedar sin link de pago.
interface RespuestaPreferencia {
  preferenceId?: string;
  initPoint?: string;
  init_point?: string;
  sandboxInitPoint?: string;
  sandbox_init_point?: string;
}

export const extraerLinkDePago = (respuesta: RespuestaPreferencia | null | undefined): string => {
  const link =
    respuesta?.initPoint ?? respuesta?.init_point ?? respuesta?.sandboxInitPoint ?? respuesta?.sandbox_init_point ?? "";
  if (!link) console.warn("La respuesta de pago no trae un link de Mercado Pago:", respuesta);
  return link;
};

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
    return extraerLinkDePago(data);
  },
};
