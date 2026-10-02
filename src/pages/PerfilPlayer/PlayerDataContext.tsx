import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { reservasService } from "../../services/reservasService";
import { ReservaJugador } from "./reservasData";

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
}

const PlayerDataContext = createContext<PlayerDataValue | null>(null);

export const PlayerDataProvider = ({ children }: { children: ReactNode }) => {
  const [reservas, setReservas] = useState<ReservaJugador[]>([]);
  const [esMock, setEsMock] = useState(false);
  const [cargando, setCargando] = useState(true);

  const recargar = useCallback(async () => {
    setCargando(true);
    const datos = await reservasService.obtenerMisReservas();
    setReservas(datos.reservas);
    setEsMock(datos.esMock);
    setCargando(false);
  }, []);

  useEffect(() => {
    recargar();
  }, [recargar]);

  const valor = useMemo<PlayerDataValue>(
    () => ({
      reservas,
      esMock,
      cargando,
      recargar,
      pagosPendientes: reservas.filter((r) => r.pagoBadge?.tono === "pendiente").length,
    }),
    [reservas, esMock, cargando, recargar],
  );

  return <PlayerDataContext.Provider value={valor}>{children}</PlayerDataContext.Provider>;
};

export const usePlayerData = (): PlayerDataValue => {
  const contexto = useContext(PlayerDataContext);
  if (!contexto) throw new Error("usePlayerData debe usarse dentro de <PlayerDataProvider>");
  return contexto;
};
