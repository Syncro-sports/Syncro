export interface FAQItem {
  id: number;
  pregunta: string;
  respuesta: string;
}

export interface CategoriaAyuda {
  id: string;
  titulo: string;
  descripcion: string;
  icono: string;
}

const ICON_BASE = `${import.meta.env.BASE_URL}assets/icons`;

// Datos de Preguntas Frecuentes
export const FAQS_RAPIDAS: FAQItem[] = [
  {
    id: 1,
    pregunta: "¿Cómo funciona el pago dividido?",
    respuesta:
      "El costo total de la cancha se divide de forma equitativa entre los jugadores. Cada uno paga su parte desde la app antes de entrar a la cancha.",
  },
  {
    id: 2,
    pregunta: "¿Qué pasa si un rival cancela a último momento?",
    respuesta:
      "Syncro no cancela el partido: reabre la búsqueda automáticamente ofreciendo el cruce a otros equipos. Si no se llega a jugar, tu dinero vuelve como crédito.",
  },
  {
    id: 3,
    pregunta: "¿Con cuánto tiempo de anticipación puedo cancelar?",
    respuesta:
      "Podés cancelar la reserva sin costo ni penalizaciones hasta 12 horas antes del inicio del partido.",
  },
  {
    id: 4,
    pregunta: "¿Diferencia entre partido Amistoso y Competitivo?",
    respuesta:
      "El Amistoso no afecta estadísticas. El Competitivo suma/resta puntos en el ranking y requiere la validación del resultado por parte del complejo.",
  },
  {
    id: 5,
    pregunta: "¿Cómo me sumo a un partido abierto?",
    respuesta:
      "Podés postularte desde la lista de partidos. El capitán revisará tu perfil y, al aceptarte, pagás tu parte para quedar confirmado.",
  },
  {
    id: 6,
    pregunta: "¿En cuántos equipos puedo jugar?",
    respuesta:
      "Podés formar parte de hasta 3 equipos simultáneamente, manteniendo historiales y puntajes separados.",
  },
];

// Datos de Categorías
export const CATEGORIAS: CategoriaAyuda[] = [
  {
    id: "primeros-pasos",
    titulo: "Primeros pasos",
    descripcion: "Aprendé a configurar tu complejo y recibir reservas.",
    icono: `${ICON_BASE}/clipboard-list.svg`,
  },
  {
    id: "reservas",
    titulo: "Reservas",
    descripcion: "Gestioná reservas, calendarios, turnos y cancelaciones.",
    icono: `${ICON_BASE}/reserva.svg`,
  },
  {
    id: "canchas",
    titulo: "Canchas",
    descripcion: "Agregá y editá tus canchas, precios y horarios.",
    icono: `${ICON_BASE}/canchas.svg`,
  },
  {
    id: "pagos-caja",
    titulo: "Pagos y caja",
    descripcion: "Conocé cómo funcionan los pagos y transferencias.",
    icono: `${ICON_BASE}/dinero.svg`,
  },
  {
    id: "staff-permisos",
    titulo: "Staff y permisos",
    descripcion: "Invitá miembros y asigná permisos para administrar.",
    icono: `${ICON_BASE}/equipos-2.svg`,
  },
  {
    id: "valoraciones",
    titulo: "Valoraciones",
    descripcion: "Gestioná reseñas y respondé a tus jugadores.",
    icono: `${ICON_BASE}/valoracion.svg`,
  },
  {
    id: "torneos",
    titulo: "Torneos",
    descripcion: "Creá, administrá y publicá torneos en tu complejo.",
    icono: `${ICON_BASE}/torneos.svg`,
  },
  {
    id: "cuenta-configuracion",
    titulo: "Cuenta y configuración",
    descripcion: "Editá tu perfil, método de pago y ajustes.",
    icono: `${ICON_BASE}/configuracion.svg`,
  },
];
