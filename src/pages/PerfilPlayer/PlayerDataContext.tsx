import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { reservasService } from "../../services/reservasService";
import { cacheRespuestas } from "../../services/cacheRespuestas";
import { ReservaJugador } from "./reservasData";
import { obtenerEquiposJugador } from "./equiposJugador";
import type { Equipo } from "./components/EquipoCard";
import type { SolicitudIngreso } from "./equiposData";

// Datos que comparten varias pestañas del perfil (menu lateral, Dashboard y
// Reservas). Se piden una sola vez al entrar al perfil y se pueden recargar
// despues de pagar o cancelar.
interface PlayerDataValue {
  // Reservas vigentes (las que ya finalizaron van al historial), la mas proxima primero
  reservas: ReservaJugador[];
  esMock: boolean;
  cargando: boolean;
  recargar: () => Promise<void>;
  // Cantidad de reservas donde falta pagar la cuota propia
  pagosPendientes: number;
  // Equipos del jugador: reales si el backend responde, de ejemplo si no
  equipos: Equipo[];
  solicitudes: SolicitudIngreso[];
  equiposMock: boolean;
  cargandoEquipos: boolean;
  recargarEquipos: () => Promise<void>;
}

const PlayerDataContext = createContext<PlayerDataValue | null>(null);

export const PlayerDataProvider = ({ children }: { children: ReactNode }) => {
  const [reservas, setReservas] = useState<ReservaJugador[]>([]);
  const [esMock, setEsMock] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [solicitudes, setSolicitudes] = useState<SolicitudIngreso[]>([]);
  const [equiposMock, setEquiposMock] = useState(false);
  const [cargandoEquipos, setCargandoEquipos] = useState(true);

  // Con "silencioso" no se muestra la carga: se usa al volver de otra pestaña (por ejemplo, de Mercado Pago)
  const recargar = useCallback(async (silencioso = false) => {
    if (!silencioso) setCargando(true);
    const datos = await reservasService.obtenerMisReservas();
    setReservas(datos.reservas);
    setEsMock(datos.esMock);
    setCargando(false);
  }, []);

  const recargarEquipos = useCallback(async () => {
    setCargandoEquipos(true);
    const datos = await obtenerEquiposJugador();
    setEquipos(datos.equipos);
    setSolicitudes(datos.solicitudes);
    setEquiposMock(datos.esMock);
    setCargandoEquipos(false);
  }, []);

  useEffect(() => {
    recargar();
    recargarEquipos();
  }, [recargar, recargarEquipos]);

  // Al volver a esta pestaña (por ejemplo, despues de pagar en Mercado Pago) se actualizan las reservas,
  // porque un pago hecho afuera no pasa por la app y lo guardado podria estar viejo.
  useEffect(() => {
    let ultimo = Date.now();
    const alVolver = () => {
      if (document.visibilityState !== "visible" || Date.now() - ultimo < 10000) return;
      ultimo = Date.now();
      cacheRespuestas.limpiarRuta("/reservas");
      recargar(true);
    };
    document.addEventListener("visibilitychange", alVolver);
    window.addEventListener("focus", alVolver);
    return () => {
      document.removeEventListener("visibilitychange", alVolver);
      window.removeEventListener("focus", alVolver);
    };
  }, [recargar]);

  const valor = useMemo<PlayerDataValue>(
    () => ({
      reservas,
      esMock,
      cargando,
      recargar,
      pagosPendientes: reservas.filter((r) => r.pagoBadge?.tono === "pendiente").length,
      equipos,
      solicitudes,
      equiposMock,
      cargandoEquipos,
      recargarEquipos,
    }),
    [reservas, esMock, cargando, recargar, equipos, solicitudes, equiposMock, cargandoEquipos, recargarEquipos],
  );

  return <PlayerDataContext.Provider value={valor}>{children}</PlayerDataContext.Provider>;
};

export const usePlayerData = (): PlayerDataValue => {
  const contexto = useContext(PlayerDataContext);
  if (!contexto) throw new Error("usePlayerData debe usarse dentro de <PlayerDataProvider>");
  return contexto;
};
