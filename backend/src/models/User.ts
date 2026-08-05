import {Schema, model, Document, Types} from 'mongoose';

// Interfaz del documento
export interface User extends Document{
    nombre: String;
    email: String;
    password: String;
    rol: 'JUGADOR' | 'HOST' | 'ADMIN';
    telefono: String;
}

// Schema de mongoose
const userSchema = new Schema<User>(
    {
        nombre: {
            type: String,
            required: [true, 'El nombre es obligatorio'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'El email es obligatorio'],
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: [true, 'La password es obligatoria'],
            select: false
        },
        rol: {
            type: String,
            enum: ['JUGADOR', 'HOST', 'ADMIN'],
            default: 'JUGADOR'
        },
        telefono: {
            type: String,
            default: ''
        }
    },
    {timestamps: true}
);

export const User = model<User>('User', userSchema);
