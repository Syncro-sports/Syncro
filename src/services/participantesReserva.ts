// Quienes juegan en una reserva y el link para compartirla.
//
// TODO(back): hoy el backend no guarda nada de esto (POST /reservas no recibe equipo ni
// jugadores, y no hay link publico). Mientras tanto se guarda en este navegador, por
// reserva, para que el flujo se vea completo. Cuando el backend lo soporte hay que:
//  - mandar `equipoId`, `jugadores` (ids) y `lugaresSinUsuario` en POST /reservas,
//  - crear/activar el link con PATCH /reservas/:id/compartir y leerlo con
//    GET /reservas/compartida/:token (sin sesion),
//  - cobrar sin sesion con POST /reservas/compartida/:token/pagar { nombre }.
// Cada funcion de abajo ya intenta primero el backend y usa el navegador como respaldo.
import { apiClient } from "./apiClient";

export interface JugadorElegido {
  // id de usuario de Syncro; los lugares sin usuario no tienen id
  id?: string;
  nombre: string;
  esYo?: boolean;
}

export interface ParticipantesReserva {
  equipoId?: string;
  equipoNombre?: string;
  jugadores: JugadorElegido[];
  // Solo en matchmaking: que tipo de partido se busca
  tipoPartido?: "Competitivo" | "Amistoso";
  // total de lugares del partido (con y sin usuario)
  cantidad: number;
}

export interface PagoInvitado {
  nombre: string;
  fecha: string;
}

// Foto de la reserva que ve quien entra con el link
export interface ReservaCompartida {
  token: string;
  reservaId: string;
  activo: boolean;
  canchaNombre: string;
  direccion?: string;
  fechaLabel: string;
  hora: string;
  formato: string;
  organizador: string;
  cuota: number;
  jugadores: { nombre: string; pagado: boolean }[];
  pagosInvitados: PagoInvitado[];
}

const clave = (reservaId: string) => `syncro:participantes:${reservaId}`;
const claveToken = (reservaId: string) => `syncro:link:${reservaId}`;
const claveFoto = (token: string) => `syncro:compartida:${token}`;

const leer = <T,>(k: string): T | null => {
  try {
    const raw = localStorage.getItem(k);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};

const guardar = (k: string, valor: unknown) => {
  try {
    localStorage.setItem(k, JSON.stringify(valor));
  } catch {
    /* sin almacenamiento: el flujo sigue, solo que sin recordar */
  }
};

export const nombreLugarLibre = (posicion: number) => `Usuario ${posicion}`;

// Completa con "Usuario N" hasta llegar a la cantidad total de lugares
export const armarLista = (p: ParticipantesReserva): JugadorElegido[] => {
  const faltan = Math.max(0, p.cantidad - p.jugadores.length);
  return [
    ...p.jugadores,
    ...Array.from({ length: faltan }, (_, i) => ({ nombre: nombreLugarLibre(p.jugadores.length + i + 1) })),
  ];
};

export const participantesService = {
  guardar: (reservaId: string, p: ParticipantesReserva) => guardar(clave(reservaId), p),
  obtener: (reservaId: string) => leer<ParticipantesReserva>(clave(reservaId)),
};

// ---------- Link para compartir ----------

const nuevoToken = () =>
  Array.from(crypto.getRandomValues(new Uint8Array(9)), (b) => "abcdefghijkmnpqrstuvwxyz23456789"[b % 32]).join("");

export interface EstadoLink {
  activo: boolean;
  token: string | null;
}

export const compartirService = {
  obtenerEstado: (reservaId: string): EstadoLink => leer<EstadoLink>(claveToken(reservaId)) ?? { activo: false, token: null },

  // Activa o desactiva el link. El token no cambia: si se reactiva es el mismo link.
  // Con datos de ejemplo no se consulta al backend. Si el backend tarda (Render arrancando en
  // frio) o no tiene el endpoint, se sigue en este navegador para que el interruptor responda.
  cambiar: async (
    reservaId: string,
    activo: boolean,
    foto: Omit<ReservaCompartida, "token" | "activo" | "pagosInvitados">,
    sinBackend = false,
  ): Promise<EstadoLink> => {
    const actual = compartirService.obtenerEstado(reservaId);
    let token = actual.token;
    if (!sinBackend) {
      try {
        const r = await Promise.race([
          apiClient.patch<{ token?: string }>(`/reservas/${reservaId}/compartir`, { activo }, { mensajeError: "No se pudo cambiar el link" }),
          new Promise<never>((_, rechazar) => setTimeout(() => rechazar(new Error("tardó demasiado")), 3000)),
        ]);
        if (r?.token) token = r.token;
      } catch {
        // TODO(back): sin endpoint, se maneja solo en este navegador
      }
    }
    if (!token) token = nuevoToken();
    const estado = { activo, token };
    guardar(claveToken(reservaId), estado);
    const previa = leer<ReservaCompartida>(claveFoto(token));
    guardar(claveFoto(token), { ...foto, token, activo, pagosInvitados: previa?.pagosInvitados ?? [] });
    return estado;
  },

  // Mantiene al dia la foto que ve quien entra con el link (jugadores, cuota)
  actualizarFoto: (token: string, foto: Partial<ReservaCompartida>) => {
    const previa = leer<ReservaCompartida>(claveFoto(token));
    if (previa) guardar(claveFoto(token), { ...previa, ...foto });
  },

  // El link lleva una copia de la reserva despues del "#" (el servidor nunca la recibe), asi la pagina
  // se ve completa aunque se abra en otro navegador o dispositivo mientras el backend no tenga la ruta.
  urlPublica: (token: string) => {
    const foto = leer<ReservaCompartida>(claveFoto(token));
    const base = `${window.location.origin}${import.meta.env.BASE_URL.replace(/\/$/, "")}/reserva/${token}`;
    return foto ? `${base}#${codificarFoto(foto)}` : base;
  },

  // Pagos hechos por invitados (modo navegador): sirven para marcarlos en el detalle del organizador
  pagosInvitados: (token: string): PagoInvitado[] => leer<ReservaCompartida>(claveFoto(token))?.pagosInvitados ?? [],

  // ---- Lado de quien entra con el link (sin sesion) ----
  // Primero el backend; si no tiene la ruta, la foto guardada en este navegador y, por ultimo,
  // la copia que viaja en el propio link. Devuelve null si no hay nada de eso.
  obtenerPublica: async (token: string): Promise<ReservaCompartida | null> => {
    try {
      const r = await apiClient.get<ReservaCompartida>(`/reservas/compartida/${token}`, { auth: false });
      return { ...r, token, pagosInvitados: r.pagosInvitados ?? [] };
    } catch {
      return leerFoto(token);
    }
  },

  // Devuelve el link de Mercado Pago para pagar la cuota con el nombre escrito.
  // TODO(back): POST /reservas/compartida/:token/pagar todavia no existe. Mientras tanto la cuota queda
  // anotada en este navegador y se abre la pagina de Mercado Pago, pero no se cobra nada.
  pagarComoInvitado: async (token: string, nombre: string): Promise<{ initPoint: string }> => {
    try {
      const r = await apiClient.post<any>(
        `/reservas/compartida/${token}/pagar`,
        { nombre },
        { auth: false, mensajeError: "No se pudo iniciar el pago" },
      );
      const link = r?.initPoint ?? r?.init_point ?? r?.url ?? null;
      if (link) return { initPoint: String(link) };
    } catch {
      /* sin endpoint: sigue el modo sin cobro de abajo */
    }
    const previa = leerFoto(token);
    if (!previa) throw new Error("No encontramos esta reserva.");
    guardar(claveFoto(token), {
      ...previa,
      pagosInvitados: [...previa.pagosInvitados, { nombre, fecha: new Date().toISOString() }],
    });
    return { initPoint: MERCADO_PAGO_SIN_COBRO };
  },
};

// Pagina de Mercado Pago a la que se lleva mientras no hay cobro real
const MERCADO_PAGO_SIN_COBRO = "https://www.mercadopago.com.ar/";

// Copia de la reserva dentro del link (JSON en base64, seguro para acentos)
const codificarFoto = (foto: ReservaCompartida): string =>
  btoa(unescape(encodeURIComponent(JSON.stringify(foto)))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

const decodificarFoto = (texto: string): ReservaCompartida | null => {
  try {
    const normal = texto.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(escape(atob(normal + "=".repeat((4 - (normal.length % 4)) % 4))));
    const foto = JSON.parse(json) as ReservaCompartida;
    return foto && Array.isArray(foto.jugadores) ? { ...foto, pagosInvitados: foto.pagosInvitados ?? [] } : null;
  } catch {
    return null;
  }
};

const leerFoto = (token: string): ReservaCompartida | null => {
  const local = leer<ReservaCompartida>(claveFoto(token));
  if (local) return local;
  const desdeLink = decodificarFoto(window.location.hash.replace(/^#/, ""));
  return desdeLink ? { ...desdeLink, token } : null;
};

// Une la lista de jugadores con los pagos hechos por invitados: cada pago ocupa el
// primer lugar libre ("Usuario N") y lleva el nombre que escribio quien pago.
export const aplicarPagosInvitados = <T extends { nombre: string; pagado: boolean }>(
  jugadores: T[],
  pagos: PagoInvitado[],
): T[] => {
  const lista = jugadores.map((j) => ({ ...j }));
  pagos.forEach((p) => {
    const libre = lista.find((j) => !j.pagado && /^Usuario \d+$|^Cuota \d+$/.test(j.nombre)) ?? lista.find((j) => !j.pagado);
    if (libre) {
      libre.nombre = `${p.nombre} (invitado)`;
      libre.pagado = true;
      // Las filas del detalle llevan iniciales propias: se actualizan con el nombre nuevo
      if ("iniciales" in libre) {
        (libre as { iniciales?: string }).iniciales = p.nombre
          .split(" ")
          .filter(Boolean)
          .slice(0, 2)
          .map((x) => x[0]?.toUpperCase())
          .join("");
      }
    }
  });
  return lista;
};
