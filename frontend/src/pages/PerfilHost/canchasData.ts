export interface Cancha {
  id: number;
  nombre: string;
  imagen: string;
  tags: string[];
  precioOriginal: number;
  precioDescuento: number;
  descuentoLabel: string;
}

export const CANCHAS: Cancha[] = [
  {
    id: 1,
    nombre: "Cancha 1",
    imagen: `${import.meta.env.BASE_URL}assets/canchas/cancha-1.jpg`,
    tags: ["Futbol 5", "Techada", "Replay", "4.8 ★"],
    precioOriginal: 25000,
    precioDescuento: 20000,
    descuentoLabel: "20% off",
  },
  {
    id: 2,
    nombre: "Cancha 2",
    imagen: `${import.meta.env.BASE_URL}assets/canchas/cancha-2.jpg`,
    tags: ["Futbol 11", "Cesped natural", "11vs11", "4.9 ★"],
    precioOriginal: 25000,
    precioDescuento: 20000,
    descuentoLabel: "20% off",
  },
  {
    id: 3,
    nombre: "Cancha 3",
    imagen: `${import.meta.env.BASE_URL}assets/canchas/cancha-3.jpg`,
    tags: ["Futsal", "Sintetico", "5vs5", "4.7 ★"],
    precioOriginal: 25000,
    precioDescuento: 20000,
    descuentoLabel: "20% off",
  },
  {
    id: 4,
    nombre: "Cancha 4",
    imagen: `${import.meta.env.BASE_URL}assets/canchas/cancha-4.jpg`,
    tags: ["Futsal", "Techada", "1vs1", "4.6 ★"],
    precioOriginal: 25000,
    precioDescuento: 20000,
    descuentoLabel: "20% off",
  },
  {
    id: 5,
    nombre: "Cancha 5",
    imagen: `${import.meta.env.BASE_URL}assets/canchas/cancha-5.jpg`,
    tags: ["Futsal", "Techada", "5vs5", "4.8 ★"],
    precioOriginal: 25000,
    precioDescuento: 20000,
    descuentoLabel: "20% off",
  },
];
