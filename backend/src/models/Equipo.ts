import { Schema, model, Document, Types } from "mongoose";

// Interfaz auxiliar para la subdocumentación de historial
export interface HistorialPartido {
  idPartido: Types.ObjectId;
  fecha: String;
  resultado: String;
}

export enum Sexo{
  MASCULINO = 'MASCULINO',
  FEMENINO = ' FEMENINO',
  MIXTO = 'MIXTO',
}

// Interfaz del documento
export interface Equipo extends Document {
  nombre: String;
  fotoPerfil: String;
  descripcion: String;
  puntos: Number;
  ubicacion: String;
  sexo: String;
  historial: HistorialPartido[];
}

// Schema de mongoose
const equipoSchema = new Schema<Equipo>(
  {
    nombre: {
      type: String,
      required: [true, "El nombre del equipo es obligatorio"],
      trim: true,
    },
    fotoPerfil: {
      type: String,
      default: "",
    },
    descripcion: {
      type: String,
      default: "",
    },
    puntos: {
      type: Number,
      default: 0,
    },
    ubicacion: {
      type: String,
      required: [true, "La ubicación del equipo es obligatoria"],
    },
    sexo: {
      type: String,
      enum: Object.values(Sexo),
      default: '',
      required: [true, "El sexo del equipo es obligatorio"],
    },
    historial: [
      {
        idPartido: {
          type: Schema.Types.ObjectId,
          ref: "Partido",
        },
        fecha: {
          type: String,
          required: true,
        },
        resultado: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true },
);

export const Equipo = model<Equipo>("Equipo", equipoSchema);
