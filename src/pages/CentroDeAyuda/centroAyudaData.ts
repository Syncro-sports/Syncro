export interface Pregunta {
  id: string;
  pregunta: string;
  respuesta: string;
}
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
  preguntas: Pregunta[];
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
    preguntas: [
      {
        id: "pp-1",
        pregunta: "¿Cómo doy de alta mi perfil en Syncro?",
        respuesta:
          "Completá el formulario de registro institucional y subí los datos de verificación de tu complejo.",
      },
      {
        id: "pp-2",
        pregunta:
          "¿Cómo invito a los jugadores o usuarios a reservar en mi complejo?",
        respuesta:
          "Una vez activado tu perfil, tu complejo aparecerá automáticamente en el mapa y buscador de la app. Además, podés compartir el enlace directo de tu perfil por WhatsApp o redes sociales.",
      },
    ],
  },
  {
    id: "reservas",
    titulo: "Reservas",
    descripcion: "Gestioná reservas, calendarios, turnos y cancelaciones.",
    icono: `${ICON_BASE}/reserva.svg`,
    preguntas: [
      {
        id: "res-1",
        pregunta: "¿Cómo cancelo o reprogramo una reserva?",
        respuesta:
          'Ingresá al apartado de Reservas, elegí el turno correspondiente y presioná "Reprogramar" o "Cancelar".',
      },
      {
        id: "res-2",
        pregunta: "¿Qué sucede si hay mal tiempo?",
        respuesta:
          "El complejo puede marcar las canchas como No Disponibles y el sistema devolverá automáticamente el dinero o saldo a favor a los jugadores.",
      },
    ],
  },
  {
    id: "canchas",
    titulo: "Canchas",
    descripcion: "Agregá y editá tus canchas, precios y horarios.",
    icono: `${ICON_BASE}/canchas.svg`,
    preguntas: [
      {
        id: "can-1",
        pregunta: "¿Cómo creo una nueva cancha?",
        respuesta:
          'Desde la pestaña Canchas, hacé clic en "Agregar Cancha", elegí la superficie (fútbol, pádel, etc.) y asigná los valores de la hora.',
      },
      {
        id: "can-2",
        pregunta: "¿Puedo establecer precios según el horario?",
        respuesta:
          "Sí, podés definir tarifas diferenciadas para horarios nocturnos o fines de semana.",
      },
    ],
  },
  {
    id: "pagos-caja",
    titulo: "Pagos y caja",
    descripcion: "Conocé cómo funcionan los pagos y transferencias.",
    icono: `${ICON_BASE}/dinero.svg`,
    preguntas: [
      {
        id: "pag-1",
        pregunta: "¿Cuándo se acreditan las reservas pagadas por la app?",
        respuesta:
          "Las acreditaciones se liquidan de forma diaria o semanal según las preferencias configuradas en tu cuenta.",
      },
      {
        id: "pag-2",
        pregunta: "¿Qué sucede si un jugador pide la devolución de su pago?",
        respuesta:
          "Si la cancelación cumple con el plazo de anticipación (12 horas), el sistema reintegra el importe automáticamente en formato de créditos dentro de la app, por lo que el dinero no sale de tu caja ni requiere gestiones manuales.",
      },
    ],
  },
  {
    id: "staff-permisos",
    titulo: "Staff y permisos",
    descripcion: "Invitá miembros y asigná permisos para administrar.",
    icono: `${ICON_BASE}/equipos-2.svg`,
    preguntas: [
      {
        id: "stf-1",
        pregunta: "¿Cómo sumo a un recepcionista o empleado?",
        respuesta:
          'En la sección Staff, enviá una invitación por e-mail y asignale el rol de "Recepcionista" o "Administrador".',
      },
    ],
  },
  {
    id: "valoraciones",
    titulo: "Valoraciones",
    descripcion: "Gestioná reseñas y respondé a tus jugadores.",
    icono: `${ICON_BASE}/valoracion.svg`,
    preguntas: [
      {
        id: "val-1",
        pregunta: "¿Puedo responder las opiniones de los usuarios?",
        respuesta:
          "Sí, tenés la opción de responder de forma pública a cada reseña dejada por los jugadores.",
      },
    ],
  },
  {
    id: "torneos",
    titulo: "Torneos",
    descripcion: "Creá, administrá y publicá torneos en tu complejo.",
    icono: `${ICON_BASE}/torneos.svg`,
    preguntas: [
      {
        id: "tor-1",
        pregunta: "¿Cómo armar las fases de grupos?",
        respuesta:
          "El módulo de torneos incluye un generador automático de fixtures y tablas de posiciones en tiempo real.",
      },
    ],
  },
  {
    id: "cuenta-configuracion",
    titulo: "Cuenta y configuración",
    descripcion: "Editá tu perfil, método de pago y ajustes.",
    icono: `${ICON_BASE}/configuracion.svg`,
    preguntas: [
      {
        id: "cfg-1",
        pregunta: "¿Cómo modifico mis datos bancarios?",
        respuesta:
          "Accedé a Configuración > Métodos de cobro para actualizar tu CBU/CVU o datos de transferencia.",
      },
    ],
  },
];
