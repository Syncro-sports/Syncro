import { Schema, model, Document, Types } from "mongoose";

// Interfaz del documento
export interface Complejo extends Document {
  nombre: String;
  hostId: Types.ObjectId;
  direccion: String;
  telefono: String;
  fotos: String[];
  servicios: String[];
  horarioApertura: String;
  horarioCierre: String;
}

// Schema de mongoose
const complejoSchema = new Schema<Complejo>(
  {
    nombre: {
      type: String,
      required: [true, "El nombre del complejo es obligatorio"],
      trim: true,
    },
    hostId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El ID del dueño es obligatorio"],
    },
    direccion: {
      type: String,
      required: [true, "La dirección es obligatoria"],
      trim: true,
    },
    telefono: {
      type: String,
      default: "",
    },
    fotos: {
      type: [String],
      default: [],
    },
    servicios: {
      type: [String],
      default: [],
    },
    horarioApertura: {
      type: String,
      required: [true, "El horario de apertura es obligatorio"],
    },
    horarioCierre: {
      type: String,
      required: [true, "El horario de cierre es obligatorio"],
    },
  },
  { timestamps: true },
);

export const Complejo = model<Complejo>("Complejo", complejoSchema);
