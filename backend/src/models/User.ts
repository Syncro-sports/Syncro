import { Schema, model, Document, Types } from "mongoose";

export enum Rol {
  JUGADOR = "JUGADOR",
  HOST = "HOST",
  ADMIN = "ADMIN",
}

// Interfaz del documento
export interface User extends Document {
  nombre: String;
  email: String;
  password: String;
  rol: String;
  telefono: String;
}

// Schema de mongoose
const userSchema = new Schema<User>(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "La password es obligatoria"],
      select: false,
    },
    rol: {
      type: String,
      enum: Object.values(Rol),
      default: "JUGADOR",
    },
    telefono: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

export const User = model<User>("User", userSchema);
