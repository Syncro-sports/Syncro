import "./NotificationsDropdownPlayer.css";

// Contenido de ejemplo: no está definido en Figma todavía, confirmar con PM
const NOTIFICACIONES = [
  {
    id: 1,
    icono: `${import.meta.env.BASE_URL}assets/icons/reserva.svg`,
    titulo: "Reserva confirmada",
    detalle: "Tu reserva en Cancha Central para hoy a las 20:00 fue confirmada.",
    tiempo: "Hace 1 día",
  },
  {
    id: 2,
    icono: `${import.meta.env.BASE_URL}assets/icons/equipos.svg`,
    titulo: "Invitación a partido",
    detalle: "CAU FC te invitó a un partido amistoso el sábado.",
    tiempo: "Hace 1 día",
  },
  {
    id: 3,
    icono: `${import.meta.env.BASE_URL}assets/icons/notificaciones.svg`,
    titulo: "Partido cancelado",
    detalle: "El partido del viernes a las 20:00 fue cancelado por el organizador.",
    tiempo: "Hace 3 días",
    tono: "negativo" as const,
  },
  {
    id: 4,
    icono: `${import.meta.env.BASE_URL}assets/icons/reserva.svg`,
    titulo: "Subiste de nivel",
    detalle: "Alcanzaste el Nivel 18. ¡Seguí sumando XP!",
    tiempo: "Hace 4 días",
  },
];

const NotificationsDropdownPlayer = () => {
  return (
    <div className="player-notifications">
      <div className="player-notifications__header">
        <h3>Notificaciones</h3>
        <span>{NOTIFICACIONES.length} nuevas</span>
      </div>

      <div className="player-notifications__list">
        {NOTIFICACIONES.map((notificacion) => (
          <div className="player-notifications__item" key={notificacion.id}>
            <span
              className={`player-notifications__icon ${
                notificacion.tono === "negativo" ? "is-negativo" : ""
              }`}
            >
              <img src={notificacion.icono} alt="" />
            </span>
            <div>
              <strong>{notificacion.titulo}</strong>
              <p>{notificacion.detalle}</p>
              <span className="player-notifications__time">{notificacion.tiempo}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsDropdownPlayer;