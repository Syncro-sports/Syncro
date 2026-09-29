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

export interface PoliticaComplejo {
  id: string;
  titulo: string;
  texto: string;
  editable: boolean;
}

export const POLITICAS_COMPLEJO_DEFAULT: Record<string, PoliticaComplejo> = {
  reglas: {
    id: "reglas",
    titulo: "Reglas de las canchas",
    texto:
      "Uso obligatorio de calzado adecuado a la superficie de cada cancha. No se permite el ingreso con bebidas alcohólicas. Respetar el horario reservado: 10 minutos de tolerancia, pasado ese tiempo se libera el turno.",
    editable: true,
  },
  cancelaciones: {
    id: "cancelaciones",
    titulo: "Política de cancelaciones",
    texto:
      "Podés cancelar tu reserva sin cargo hasta 12 horas antes del turno. Cancelaciones con menos de 12 horas de anticipación no tienen reembolso de la seña.",
    editable: false,
  },
  conducta: {
    id: "conducta",
    titulo: "Código de conducta",
    texto:
      "Se espera un trato respetuoso entre jugadores, staff y vecinos del complejo. No se tolerarán actos de violencia física o verbal. El incumplimiento puede derivar en la suspensión de la cuenta.",
    editable: true,
  },
  terminos: {
    id: "terminos",
    titulo: "Términos y condiciones",
    texto:
      "Al reservar en este complejo, aceptás las políticas generales de Syncro y las condiciones particulares definidas por el host, incluyendo horarios, tarifas y normas de uso de las instalaciones.",
    editable: false,
  },
};

export const CONFIGURACION_DEFAULT: ConfiguracionComplejo = {
  nombre: "Complejo Los Pibes",
  email: "contacto@lospibes.com",
  descripcion:
    "Complejo deportivo con 4 canchas de futbol 5, vestuarios, estacionamiento y cantina. El mejor lugar para jugar con amigos.",
  telefono: "+54 11 1234-5678",
  direccion: "Av. Siempre Viva 1234, CABA",
  zonaHoraria: "(GTM-03:00) Buenos Aires",
  moneda: "Peso Argentino (ARS)",
  idioma: "Español",
  formatoHora: "24",
  metodosPago: [
    { id: "mp", nombre: "MercadoPago", activo: true }
  ]
};