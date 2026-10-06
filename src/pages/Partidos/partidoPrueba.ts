// TEMP-PRUEBA: partido de otro equipo, solo para grabar/probar la postulacion ("Unirme") con una cuenta que no lo creo.
// No se sube a GitHub. Para quitarlo: borrar este archivo y las lineas marcadas
// TEMP-PRUEBA en partidosService.ts y PartidoDetalleModal.tsx (buscar con: grep -rn "TEMP-PRUEBA" src).
import { Partido } from "./partidosData";

export const ID_PARTIDO_PRUEBA = "prueba-local";

const capitalizar = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

export const partidoDePrueba = (): Partido => {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + 3);
  const dia = capitalizar(fecha.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" }));
  return {
    id: ID_PARTIDO_PRUEBA,
    tipo: "Competitivo",
    nivel: "Intermedio",
    fechaLabel: dia,
    fechaTag: "semana",
    fechaCompleta: `${dia} ${fecha.getFullYear()}`,
    hora: "20:00",
    bloque: "noche",
    precio: 30000,
    ubicacion: "Av. Libertad 569, Merlo, Bs As",
    direccion: "Av. Libertad 569, Merlo, Buenos Aires.",
    canchaNombre: "Arenas del Sur",
    canchaTipo: "Futbol 7 - 50x30 m",
    canchaSuperficie: "Césped sintético",
    equipoLocalNombre: "Halcones FC",
    equipoVisitanteNombre: null,
    rankingEstimado: null,
    partidosJugados: null,
    nivelRival: null,
    costoCancha: 42000,
    promocion: 0,
    entradaJugador: 3000,
    maxJugadores: 14,
    formato: "7 vs 7",
    duracion: "60 mins",
    estado: "Abierto",
  };
};
