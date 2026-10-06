// Cache de respuestas GET para no esperar al servidor cada vez que se vuelve a una pantalla
// o se reabre un modal dentro de la misma pestaña.
//
// Funciona asi:
//  - Respuesta "fresca" (menos de TTL_FRESCO): se devuelve al instante, sin pedir nada.
//  - Respuesta "vieja" (hasta TTL_MAXIMO): se devuelve al instante y se actualiza en segundo plano,
//    asi la proxima vez ya esta al dia.
//  - Mas vieja que eso, o inexistente: se pide al servidor.
//  - Cualquier cambio (POST, PUT, PATCH, DELETE) borra todo el cache, para no mostrar datos desactualizados.
//  - Se guarda en memoria y en sessionStorage: sobrevive a recargar la pestaña y se pierde al cerrarla.
//
// Solo se cachean datos de listados y detalles que cambian poco. Pagos, entradas, reservas y
// matchmaking van siempre al servidor.

const TTL_FRESCO = 2 * 60 * 1000;
const TTL_MAXIMO = 30 * 60 * 1000;
const PREFIJO_STORAGE = "syncro:cache:";
const RUTAS_CACHEABLES = ["/canchas", "/equipos", "/partidos"];

// Rutas que cambian mas seguido (por ejemplo, un pago hecho en Mercado Pago): se guardan con
// tiempos mas cortos, para que volver a una pantalla sea instantaneo sin mostrar datos viejos mucho rato.
const TIEMPOS_PROPIOS: { prefijo: string; fresco: number; maximo: number }[] = [
  { prefijo: "/reservas/mis-reservas", fresco: 20 * 1000, maximo: 10 * 60 * 1000 },
  { prefijo: "/caja", fresco: 20 * 1000, maximo: 10 * 60 * 1000 },
  { prefijo: "/host/configuracion", fresco: 30 * 1000, maximo: 10 * 60 * 1000 },
];

const tiemposDe = (ruta: string) => TIEMPOS_PROPIOS.find((t) => ruta.startsWith(t.prefijo)) ?? { fresco: TTL_FRESCO, maximo: TTL_MAXIMO };

interface Entrada {
  datos: unknown;
  guardadoEn: number;
}

// Cada pantalla recibe su propia copia: si la modifica (por ejemplo, al ordenar una lista),
// no altera lo que quedo guardado.
const copia = <T,>(datos: T): T => (typeof structuredClone === "function" ? structuredClone(datos) : datos);

const memoria = new Map<string, Entrada>();
const enCurso = new Map<string, Promise<unknown>>();

export const esCacheable = (ruta: string): boolean =>
  TIEMPOS_PROPIOS.some((t) => ruta.startsWith(t.prefijo)) ||
  RUTAS_CACHEABLES.some((p) => ruta === p || ruta.startsWith(`${p}/`) || ruta.startsWith(`${p}?`));

// La clave incluye al usuario: lo que ve una cuenta no se le muestra a otra
const clave = (ruta: string, token: string | null) => `${token ? token.slice(-12) : "anon"}|${ruta}`;

const leerStorage = (k: string): Entrada | null => {
  try {
    const raw = sessionStorage.getItem(PREFIJO_STORAGE + k);
    return raw ? (JSON.parse(raw) as Entrada) : null;
  } catch {
    return null;
  }
};

const guardarStorage = (k: string, entrada: Entrada) => {
  try {
    sessionStorage.setItem(PREFIJO_STORAGE + k, JSON.stringify(entrada));
  } catch {
    /* sin lugar o sin storage: queda solo en memoria */
  }
};

export const cacheRespuestas = {
  // pedir() hace el GET real. Si hay algo guardado, lo devuelve sin esperar.
  obtener: async <T>(ruta: string, token: string | null, pedir: () => Promise<T>): Promise<T> => {
    const k = clave(ruta, token);
    const guardada = memoria.get(k) ?? leerStorage(k);
    const edad = guardada ? Date.now() - guardada.guardadoEn : Infinity;
    const { fresco, maximo } = tiemposDe(ruta);

    const refrescar = (): Promise<T> => {
      const previa = enCurso.get(k) as Promise<T> | undefined;
      if (previa) return previa;
      const promesa = pedir()
        .then((datos) => {
          const entrada = { datos, guardadoEn: Date.now() };
          memoria.set(k, entrada);
          guardarStorage(k, entrada);
          return datos;
        })
        .finally(() => enCurso.delete(k));
      enCurso.set(k, promesa);
      return promesa;
    };

    if (guardada && edad < maximo) {
      memoria.set(k, guardada);
      if (edad >= fresco) refrescar().catch(() => undefined);
      return copia(guardada.datos as T);
    }
    return copia(await refrescar());
  },

  // Borra solo lo guardado de una ruta (por ejemplo, al volver de pagar en Mercado Pago)
  limpiarRuta: (prefijo: string) => {
    for (const k of [...memoria.keys()]) if (k.split("|")[1]?.startsWith(prefijo)) memoria.delete(k);
    try {
      Object.keys(sessionStorage)
        .filter((k) => k.startsWith(PREFIJO_STORAGE) && k.slice(PREFIJO_STORAGE.length).split("|")[1]?.startsWith(prefijo))
        .forEach((k) => sessionStorage.removeItem(k));
    } catch {
      /* sin storage */
    }
  },

  // Despues de crear, editar o borrar algo, lo guardado puede estar viejo
  limpiar: () => {
    memoria.clear();
    try {
      Object.keys(sessionStorage)
        .filter((k) => k.startsWith(PREFIJO_STORAGE))
        .forEach((k) => sessionStorage.removeItem(k));
    } catch {
      /* sin storage */
    }
  },
};
