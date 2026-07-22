import "./NotificationsDropdown.css";

const NOTIFICACIONES = [
  {
    id: 1,
    icono: "/assets/icons/reserva.svg",
    titulo: "Nueva reserva registrada",
    detalle: "Juan Pérez reservó Cancha 2 para hoy a las 18:00.",
    tiempo: "Hace 5 min",
  },
  {
    id: 2,
    icono: "/assets/icons/dinero.svg",
    titulo: "Pago recibido",
    detalle: "Se registró un pago de $18.000 por la reserva #AA1234.",
    tiempo: "Hace 47 min",
  },
  {
    id: 3,
    icono: "/assets/icons/notificaciones.svg",
    titulo: "Reserva cancelada",
    detalle: "María Gómez canceló su reserva del viernes a las 20:00.",
    tiempo: "Hace 2 h",
    tono: "negativo" as const,
  },
  {
    id: 4,
    icono: "/assets/icons/equipos.svg",
    titulo: "Ingreso de personal",
    detalle: "Carlos (staff) inició sesión en el panel de administración.",
    tiempo: "Ayer",
  },
];

const NotificationsDropdown = () => {
  return (
    <div className="host-notifications">
      <div className="host-notifications__header">
        <h3>Notificaciones</h3>
        <span>{NOTIFICACIONES.length} nuevas</span>
      </div>

      <div className="host-notifications__list">
        {NOTIFICACIONES.map((notificacion) => (
          <div className="host-notifications__item" key={notificacion.id}>
            <span
              className={`host-notifications__icon ${
                notificacion.tono === "negativo" ? "is-negativo" : ""
              }`}
            >
              <img src={notificacion.icono} alt="" />
            </span>
            <div>
              <strong>{notificacion.titulo}</strong>
              <p>{notificacion.detalle}</p>
              <span className="host-notifications__time">{notificacion.tiempo}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsDropdown;
