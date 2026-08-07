import { Schema, model, Document, Types } from "mongoose";

export enum Superficie{
  SINTETICO = 'SINTETICO',
  CESPED = 'CESPED',
  CEMENTO = 'CEMENTO',
  FUTSAL = "FUTSAL",
}


// Interfaz del documento
export interface Cancha extends Document {
  complejoId: Types.ObjectId;
  nombre: String;
  deporte: String;
  superficie: String;
  formato: String;
  senia: Number;
  precioDia: Number;
  precioNoche: Number;
  estaActiva: Boolean;
  estaDisponible: Boolean;
  esTechada: Boolean;
  esIluminada: Boolean;
  imagenUrl: String;
  replay: Boolean;
  descuento: Boolean;
}

// Schema de mongoose
const canchaSchema = new Schema<Cancha>(
  {
    complejoId: {
      type: Schema.Types.ObjectId,
      ref: "Complejo",
      required: [true, "El ID del complejo es obligatorio"],
    },
    nombre: {
      type: String,
      required: [true, "El nombre de la cancha es obligatorio"],
      trim: true,
    },
    deporte: {
      type: String,
      required: [true, "El deporte es obligatorio"],
    },
    superficie: {
      type: String,
      enum: Object.values(Superficie),
      default: '',
      required: [true, "La superficie es obligatoria"],
    },
    formato: {
      type: String,
      required: [true, "El formato es obligatorio"],
    },
    senia: {
      type: Number,
      required: [true, "La seña es obligatoria"],
    },
    precioDia: {
      type: Number,
      required: [true, "El precio de día es obligatorio"],
    },
    precioNoche: {
      type: Number,
      required: [true, "El precio de noche es obligatorio"],
    },
    estaActiva: {
      type: Boolean,
      default: true,
    },
    estaDisponible: {
      type: Boolean,
      default: true,
    },
    esTechada: {
      type: Boolean,
      default: false,
    },
    esIluminada: {
      type: Boolean,
      default: true,
    },
    imagenUrl: {
      type: String,
      default: "",
    },
    replay: {
      type: Boolean,
      default: false,
    },
    descuento: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Cancha = model<Cancha>("Cancha", canchaSchema);
