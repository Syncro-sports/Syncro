// optimizacion-servicios-apiclient
import { apiClient } from "./apiClient";

export const pagosService = {
  crearPreferencia: async (titulo: string, precio: number, cantidad: number = 1): Promise<string> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No hay sesión iniciada");

    const data = await apiClient.post<{ init_point: string }>(
      "/pagos/preferencia",
      { titulo, precio, cantidad },
      { mensajeError: "Error al conectar con MercadoPago" },
    );
    return data.init_point;
  },
};
