export type TipoPartido = "Competitivo" | "Amistoso";

export interface PartidoHistorial {
  id: number;
  tipo: TipoPartido;
  fecha: string;
  complejo: string;
  direccion: string;
  rival: string;
  marcadorLocal: number;
  marcadorVisitante: number;
  escudoLocalLabel: string;
  escudoVisitanteLabel: string;
}