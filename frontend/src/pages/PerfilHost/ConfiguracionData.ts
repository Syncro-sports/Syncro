export interface MetodoPago {
  id: string;
  nombre: string;
  activo: boolean;
  icono?: string;
}

export interface ConfiguracionComplejo {
  id?: string;
  hostId?: string;
  nombre: string;
  email: string;
  descripcion?: string;
  telefono?: string;
  direccion?: string;
  logoUrl?: string;
  zonaHoraria: string;
  moneda: string;
  idioma: string;
  formatoHora: "12" | "24";
  metodosPago: MetodoPago[];
  createdAt?: string;
  updatedAt?: string;
}

export const CONFIGURACION_DEFAULT: ConfiguracionComplejo = {
  nombre: "",
  email: "",
  descripcion: "",
  telefono: "",
  direccion: "",
  zonaHoraria: "(GTM-03:00) Buenos Aires",
  moneda: "Peso Argentino (ARS)",
  idioma: "Español",
  formatoHora: "24",
  metodosPago: [
    { id: "mp", nombre: "MercadoPago", activo: true }
  ]
};