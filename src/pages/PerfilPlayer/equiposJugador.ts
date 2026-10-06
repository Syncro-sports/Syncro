import { equiposService, MiEquipo } from "../../services/equiposService";
import type { Equipo } from "./components/EquipoCard";
import { EQUIPOS_MOCK, SOLICITUDES_MOCK, SolicitudIngreso } from "./equiposData";

const ESCUDO_POR_DEFECTO = `${import.meta.env.BASE_URL}assets/icons/escudo-green.svg`;

export interface EquiposJugador {
  equipos: Equipo[];
  solicitudes: SolicitudIngreso[];
  // true cuando no se pudo hablar con el backend y se muestran los datos de ejemplo
  esMock: boolean;
}

const iniciales = (nombre: string): string =>
  nombre
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

// Equipo del backend -> forma que usa la tarjeta del perfil
const aTarjeta = (e: MiEquipo): Equipo => ({
  id: e.id,
  nombre: e.nombre,
  logoUrl: e.fotoPerfil || ESCUDO_POR_DEFECTO,
  categoria: `Nivel ${e.nivel}`,
  descripcion: e.descripcion,
  integrantesActuales: e.jugadoresCant,
  integrantesMax: e.cupoMaximo,
  esPropietario: e.esPropietario,
  solicitudesPendientes: e.solicitudesPendientes,
});

const datosDeEjemplo = (): EquiposJugador => ({
  equipos: EQUIPOS_MOCK,
  solicitudes: SOLICITUDES_MOCK,
  esMock: true,
});

// Si el backend tarda mas que esto en contestar (por ejemplo, Render arrancando en frio),
// se considera no conectado y se muestran los datos de ejemplo en vez de dejar la pantalla cargando.
const ESPERA_MAXIMA_MS = 10000;

const conLimite = <T,>(promesa: Promise<T>): Promise<T> =>
  Promise.race([
    promesa,
    new Promise<never>((_, rechazar) => setTimeout(() => rechazar(new Error("El backend tardó demasiado en responder")), ESPERA_MAXIMA_MS)),
  ]);

// Detecta si el backend esta conectado: si responde, se muestran los equipos reales
// (aunque la lista este vacia); si falla, se muestran los de ejemplo.
export const obtenerEquiposJugador = async (): Promise<EquiposJugador> => {
  try {
    const { equipos } = await conLimite(equiposService.obtenerMisEquipos());

    // Solo el capitan y el propietario pueden ver las solicitudes
    const conSolicitudes = equipos.filter((e) => e.solicitudesPendientes > 0 && (e.esPropietario || e.esCapitan));
    const solicitudes = (
      await Promise.all(
        conSolicitudes.map(async (e) => {
          try {
            const { solicitudes: lista } = await equiposService.listarSolicitudes(e.id);
            return lista.map<SolicitudIngreso>((s) => ({
              id: `${e.id}-${s.usuarioId}`,
              usuarioId: s.usuarioId,
              equipoId: e.id,
              equipoNombre: e.nombre,
              nombre: s.nombre,
              iniciales: iniciales(s.nombre),
              mensaje: s.mensaje,
            }));
          } catch {
            return [];
          }
        }),
      )
    ).flat();

    return { equipos: equipos.map(aTarjeta), solicitudes, esMock: false };
  } catch (error) {
    console.warn("Backend de equipos no disponible, usando datos de ejemplo", error);
    return datosDeEjemplo();
  }
};
