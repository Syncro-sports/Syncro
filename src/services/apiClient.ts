// optimizacion-servicios-apiclient
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

type Metodo = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface OpcionesRequest {
  auth?: boolean;
  mensajeError?: string;
}

const CAMPOS_MENSAJE = ["mensaje", "message", "error"] as const;

const extraerMensaje = (datos: unknown, porDefecto: string): string => {
  if (datos && typeof datos === "object") {
    for (const campo of CAMPOS_MENSAJE) {
      const valor = (datos as Record<string, unknown>)[campo];
      if (typeof valor === "string" && valor.trim() !== "") return valor;
    }
  }
  return porDefecto;
};

const request = async <T = any>(
  metodo: Metodo,
  ruta: string,
  cuerpo?: unknown,
  opciones: OpcionesRequest = {},
): Promise<T> => {
  const { auth = true, mensajeError = "No se pudo completar la solicitud" } = opciones;

  const headers: Record<string, string> = {};
  if (cuerpo !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = localStorage.getItem("token");
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const respuesta = await fetch(`${API_URL}${ruta}`, {
    method: metodo,
    ...(Object.keys(headers).length > 0 ? { headers } : {}),
    ...(cuerpo !== undefined ? { body: JSON.stringify(cuerpo) } : {}),
  });

  const datos = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    const error = new Error(extraerMensaje(datos, mensajeError)) as Error & { status?: number };
    error.status = respuesta.status;
    throw error;
  }

  return datos as T;
};

export const apiClient = {
  get: <T = any>(ruta: string, opciones?: OpcionesRequest) => request<T>("GET", ruta, undefined, opciones),
  post: <T = any>(ruta: string, cuerpo?: unknown, opciones?: OpcionesRequest) =>
    request<T>("POST", ruta, cuerpo, opciones),
  put: <T = any>(ruta: string, cuerpo?: unknown, opciones?: OpcionesRequest) =>
    request<T>("PUT", ruta, cuerpo, opciones),
  patch: <T = any>(ruta: string, cuerpo?: unknown, opciones?: OpcionesRequest) =>
    request<T>("PATCH", ruta, cuerpo, opciones),
  del: <T = any>(ruta: string, opciones?: OpcionesRequest) => request<T>("DELETE", ruta, undefined, opciones),
};
