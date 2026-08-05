import { Schema, model, Document, Types } from "mongoose";

export enum EstadoPartido {
  PROGRAMADO = "PROGRAMADO",
  EN_CURSO = "EN_CURSO",
  FINALIZADO = "FINALIZADO",
  CANCELADO = "CANCELADO",
}

export enum TipoPartido {
  AMISTOSO = "AMISTOSO",
  COMPETITIVO = "COMPETITIVO",
}

export enum NivelPartido {
  PRINCIPIANTE = "PRINCIPIANTE",
  INTERMEDIO = "INTERMEDIO",
  AVANZADO = "AVANZADO",
  PROFESIONAL = "PROFESIONAL",
}

export interface Partido extends Document {
  canchaId: string;
  equipoLocalId: string;
  equipoVisitanteId?: string;
  reservaId?: string;
  fechaProgramada: Date;
  estado: EstadoPartido;
  tipo: TipoPartido;
  nivel: NivelPartido;
  precio: number;
}

const PartidoSchema = new Schema<Partido>(
  {
    canchaId: {
      type: String,
      required: true,
    },
    equipoLocalId: {
      type: String,
      required: true,
    },
    equipoVisitanteId: {
      type: String,
    },
    reservaId: {
      type: String,
    },
    fechaProgramada: {
      type: Date,
      required: true,
    },
    estado: {
      type: String,
      enum: Object.values(EstadoPartido),
      default: EstadoPartido.PROGRAMADO,
    },
    tipo: {
      type: String,
      enum: Object.values(TipoPartido),
      required: true,
    },
    nivel: {
      type: String,
      enum: Object.values(NivelPartido),
      required: true,
    },
    precio: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

export const PartidoModel = model<Partido>("Partido", PartidoSchema);
