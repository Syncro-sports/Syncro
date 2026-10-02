import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { usePlayerData } from "./PlayerDataContext";
import { calcularNivel, datosUsuario, obtenerRangoIcono, obtenerSaludo } from "./playerData";
import { EQUIPOS_MOCK, MAX_EQUIPOS } from "./equiposData";
import { linkGoogleCalendar } from "./calendario";
import { ReservaJugador } from "./reservasData";
import "./Dashboard.css";

const ICON_BASE = `${import.meta.env.BASE_URL}assets/icons`;

const fmt = (n: number) => `$${n.toLocaleString("es-AR")}`;

const fechaDia = (iso: string) => new Date(`${iso}T12:00:00`);

// "Hoy", "Mañana" o "En N dias". Null si la fecha ya paso.
const cuentaRegresiva = (fechaISO?: string): string | null => {
  if (!fechaISO) return null;
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const objetivo = fechaDia(fechaISO);
  objetivo.setHours(0, 0, 0, 0);
  const dias = Math.round((objetivo.getTime() - hoy.getTime()) / 86400000);
  if (dias < 0) return null;
  if (dias === 0) return "Hoy";
  if (dias === 1) return "Mañana";
  return `En ${dias} días`;
};

// Lo que el jugador tiene que pagar de esa reserva (cuota si es split, seña si es pago completo)
const montoAPagar = (reserva: ReservaJugador) =>
  reserva.detalle.metodoPago === "split" ? (reserva.detalle.cuota ?? 0) : reserva.detalle.senia;

const tituloReserva = (reserva: ReservaJugador) => {
  const { tuEquipo, rival } = reserva.detalle;
  return tuEquipo && rival ? `${tuEquipo} vs ${rival.nombre}` : reserva.tipo;
};

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { reservas, cargando, pagosPendientes } = usePlayerData();

  const usuario = authService.obtenerUsuario();
  const primerNombre = (usuario?.nombre || datosUsuario.usuario).split(" ")[0];
  const { nivel, xpActual, xpRestante, porcentaje } = calcularNivel(datosUsuario.expTotal);

  const esNuevo = !cargando && reservas.length === 0 && datosUsuario.partidosJugados === 0;
  const siguiente = reservas[0];
  const despues = reservas.slice(1, 3);
  const pendientes = reservas.filter((r) => r.pagoBadge?.tono === "pendiente");
  const totalPendiente = pendientes.reduce((suma, r) => suma + montoAPagar(r), 0);

  const irAReserva = (id: string) => navigate(`/perfil-jugador/reservas?reserva=${id}`);

  // ---------- Bloques reutilizables ----------
  const progreso = (
    <div className="player-card pj-card">
      <div className="pj-card__head">
        <h3>Tu progreso</h3>
      </div>
      <div className="pj-level">
        <img src={`${ICON_BASE}/${obtenerRangoIcono(nivel)}`} alt={`Rango nivel ${nivel}`} />
        <div>
          <div className="pj-level__name">Nivel {nivel}</div>
          <div className="pj-level__sub">
            {datosUsuario.partidosJugados === 0 ? (
              "Jugá tu primer partido para sumar XP"
            ) : (
              <>
                Te faltan <strong>{xpRestante} XP</strong> para el nivel {nivel + 1}
              </>
            )}
          </div>
        </div>
      </div>
      <div className="pj-xp">
        <div className="pj-xp__row">
          <span>Experiencia</span>
          <span>{xpActual} / 1600 XP</span>
        </div>
        <div className="pj-barra">
          <div className="pj-barra__fill" style={{ width: `${porcentaje}%` }} />
        </div>
      </div>
      <div className="pj-stats">
        <div className="pj-stat">
          <b>{datosUsuario.partidosJugados}</b>
          <span>Partidos</span>
        </div>
        <div className="pj-stat">
          <b>{datosUsuario.horasJugadas} h</b>
          <span>Jugadas</span>
        </div>
        <div className="pj-stat">
          <b>{datosUsuario.complejosVisitados}</b>
          <span>Complejos</span>
        </div>
      </div>
    </div>
  );

  const equipos = (
    <div className="player-card pj-card">
      <div className="pj-card__head">
        <h3>Mis equipos</h3>
        <span className="pj-pill">
          {EQUIPOS_MOCK.length} de {MAX_EQUIPOS}
        </span>
      </div>
      {EQUIPOS_MOCK.map((equipo) => (
        <div className="pj-team" key={equipo.id}>
          <img className="pj-team__shield" src={equipo.logoUrl} alt="" />
          <div className="pj-team__main">
            <div className="pj-team__name">{equipo.nombre}</div>
            <div className="pj-team__sub">
              {equipo.esPropietario ? "Capitán" : "Jugador"} · {equipo.integrantesActuales}/{equipo.integrantesMax}{" "}
              integrantes
            </div>
          </div>
          {equipo.solicitudesPendientes ? (
            <span className="pj-pill pj-pill--alert">{equipo.solicitudesPendientes} solicitud</span>
          ) : null}
        </div>
      ))}
      {EQUIPOS_MOCK.length < MAX_EQUIPOS && (
        <div className="pj-team">
          <span className="pj-team__plus">+</span>
          <div className="pj-team__main">
            <div className="pj-team__name">Te queda {MAX_EQUIPOS - EQUIPOS_MOCK.length} lugar</div>
            <div className="pj-team__sub">Unite a un equipo o creá el tuyo</div>
          </div>
          <button type="button" className="pj-btn pj-btn--ghost pj-btn--sm" onClick={() => navigate("/perfil-jugador/equipos")}>
            Explorar
          </button>
        </div>
      )}
      <div className="pj-card__foot">
        <Link to="/perfil-jugador/equipos" className="pj-link">
          Ver mis equipos →
        </Link>
      </div>
    </div>
  );

  const acciones = (
    <div className="pj-head__actions">
      <Link to="/canchas" className="pj-btn pj-btn--ghost pj-btn--md">
        Reservar cancha
      </Link>
      <Link to="/partidos" className="pj-btn pj-btn--primary pj-btn--md">
        Buscar partido
      </Link>
    </div>
  );

  // ---------- Jugador nuevo: primeros pasos ----------
  if (esNuevo) {
    return (
      <div className="pj">
        <div className="pj-head">
          <div>
            <h2>¡Bienvenido, {primerNombre}!</h2>
            <p>Estos son tus primeros pasos para jugar tu primer partido.</p>
          </div>
          {acciones}
        </div>

        <div className="pj-duo">
          <div className="player-card pj-card">
            <div className="pj-card__head">
              <h3>Primeros pasos</h3>
              <span className="pj-pill">1 de 3</span>
            </div>
            <div className="pj-barra" style={{ marginBottom: "0.5rem" }}>
              <div className="pj-barra__fill" style={{ width: "33%" }} />
            </div>
            <div className="pj-steps">
              <div className="pj-step pj-step--done">
                <span className="pj-step__n">✓</span>
                <div className="pj-step__main">
                  <div className="pj-step__title">Crear tu cuenta</div>
                </div>
              </div>
              <div className="pj-step">
                <span className="pj-step__n">2</span>
                <div className="pj-step__main">
                  <div className="pj-step__title">Completá tu perfil</div>
                  <div className="pj-step__sub">Sumá tu foto, posición y nivel para que te encuentren.</div>
                </div>
                <button type="button" className="pj-btn pj-btn--outline pj-btn--sm" onClick={() => navigate("/perfil-jugador/configuracion")}>
                  Completar
                </button>
              </div>
              <div className="pj-step">
                <span className="pj-step__n">3</span>
                <div className="pj-step__main">
                  <div className="pj-step__title">Sumate a un equipo o creá el tuyo</div>
                  <div className="pj-step__sub">Podés estar en hasta {MAX_EQUIPOS} equipos a la vez.</div>
                </div>
                <button type="button" className="pj-btn pj-btn--outline pj-btn--sm" onClick={() => navigate("/equipos")}>
                  Explorar equipos
                </button>
              </div>
            </div>
          </div>
          {progreso}
        </div>

        <div className="player-card pj-empty">
          <img src={`${ICON_BASE}/pelota.svg`} alt="" />
          <div className="pj-empty__txt">
            <h3>Todavía no tenés partidos</h3>
            <p>
              Cuando reserves una cancha o te unas a un partido, vas a ver acá cuándo y dónde se juega, y si te falta
              pagar.
            </p>
          </div>
          <Link to="/partidos" className="pj-btn pj-btn--primary pj-btn--md">
            Buscar mi primer partido
          </Link>
        </div>
      </div>
    );
  }

  // ---------- Dashboard principal ----------
  const cuenta = cuentaRegresiva(siguiente?.fechaISO);
  const siguientePendiente = siguiente?.pagoBadge?.tono === "pendiente";
  const linkCalendario = siguiente ? linkGoogleCalendar(siguiente) : null;

  return (
    <div className="pj">
      <div className="pj-head">
        <div>
          <h2>
            {obtenerSaludo()}, {primerNombre}
          </h2>
          <p>
            {cargando
              ? "Cargando tus partidos..."
              : reservas.length === 0
                ? "Todavía no tenés partidos programados."
                : `Tenés ${reservas.length} ${reservas.length === 1 ? "reserva próxima" : "reservas próximas"}.`}
          </p>
        </div>
        {acciones}
      </div>

      {pagosPendientes > 0 && (
        <div className="pj-alert">
          <span className="pj-alert__dot" />
          <div className="pj-alert__txt">
            <strong>
              Tenés {pagosPendientes} {pagosPendientes === 1 ? "pago pendiente" : "pagos pendientes"} · {fmt(totalPendiente)}
            </strong>
          </div>
          <button
            type="button"
            className="pj-btn pj-btn--primary pj-btn--sm"
            onClick={() => (pendientes[0] ? irAReserva(pendientes[0].id) : navigate("/perfil-jugador/pagos"))}
          >
            Ir a pagar
          </button>
        </div>
      )}

      <div className="pj-grid">
        <div className="pj-col">
          {cargando && <div className="player-card pj-empty pj-empty--hero">Cargando tu próximo partido...</div>}

          {!cargando && !siguiente && (
            <div className="player-card pj-empty pj-empty--hero">
              <img src={`${ICON_BASE}/pelota.svg`} alt="" />
              <div className="pj-empty__txt">
                <h3>No tenés partidos próximos</h3>
                <p>Reservá una cancha o unite a un partido abierto para volver a jugar.</p>
              </div>
              {acciones}
            </div>
          )}

          {!cargando && siguiente && (
            <>
            <div className="player-card pj-next">
              <div className="pj-next__body">
                <div className="pj-next__main">
                  <div className="pj-next__top">
                    <span className="pj-eyebrow">PRÓXIMO PARTIDO</span>
                    {cuenta && <span className="pj-countdown">{cuenta}</span>}
                  </div>

                  <div className="pj-chips">
                    <span className="pj-chip">{siguiente.tipo}</span>
                    <span className="pj-chip pj-chip--muted">
                      {siguiente.estado === "confirmada" ? "Reserva confirmada" : "Pago pendiente"}
                    </span>
                  </div>

                  {siguiente.detalle.tuEquipo && (
                    <div className="pj-vs">
                      <div className="pj-vs__team">
                        <div className="pj-shield pj-shield--local">
                          <img src={`${ICON_BASE}/remera-local.svg`} alt="" />
                        </div>
                        <div>
                          <div className="pj-vs__name">{siguiente.detalle.tuEquipo}</div>
                          <div className="pj-vs__tag">TU EQUIPO</div>
                        </div>
                      </div>
                      {siguiente.detalle.rival && (
                        <>
                          <span className="pj-vs__sep">VS</span>
                          <div className="pj-vs__team">
                            <div className="pj-shield pj-shield--rival">
                              <img src={`${ICON_BASE}/remera-rival.svg`} alt="" />
                            </div>
                            <div>
                              <div className="pj-vs__name">{siguiente.detalle.rival.nombre}</div>
                              <div className="pj-vs__tag pj-vs__tag--muted">RIVAL</div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  <div className="pj-next__when">
                    <span className="pj-next__hora">{siguiente.detalle.hora}</span>
                    <span className="pj-next__fecha">{siguiente.detalle.fechaLabel}</span>
                  </div>

                  <div className="pj-next__where">
                    <img src={`${ICON_BASE}/lugar.svg`} alt="" />
                    <span>
                      <strong>{siguiente.complejo}</strong>
                      {siguiente.direccion ? ` · ${siguiente.direccion}` : ""}
                    </span>
                  </div>

                  {siguientePendiente ? (
                    <div className="pj-pago">
                      <div className="pj-pago__txt">
                        {siguiente.detalle.metodoPago === "split" ? "Tu cuota" : "Seña a pagar"}
                        <strong>{fmt(montoAPagar(siguiente))}</strong>
                      </div>
                      <div className="pj-pago__acciones">
                        <span className="pj-pill pj-pill--alert">Pendiente</span>
                        <button type="button" className="pj-btn pj-btn--primary pj-btn--sm" onClick={() => irAReserva(siguiente.id)}>
                          {siguiente.detalle.metodoPago === "split" ? "Pagar mi cuota" : "Pagar seña"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="pj-pago">
                      <div className="pj-pago__ok">
                        <span className="pj-pago__check">
                          <CheckIcon />
                        </span>
                        <div className="pj-pago__txt">
                          {siguiente.detalle.metodoPago === "split" ? "Tu cuota está paga" : "Reserva confirmada"}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pj-next__actions">
                    <button type="button" className="pj-btn pj-btn--outline pj-btn--sm" onClick={() => irAReserva(siguiente.id)}>
                      Ver reserva
                    </button>
                    {linkCalendario && (
                      <a className="pj-btn pj-btn--ghost pj-btn--sm" href={linkCalendario} target="_blank" rel="noopener noreferrer">
                        Añadir al calendario
                      </a>
                    )}
                  </div>
                </div>

                <div className="pj-next__photo">
                  <img src={siguiente.imagen} alt="" />
                </div>
              </div>

              {despues.length > 0 && (
                <div className="pj-later">
                  <div className="pj-later__title">DESPUÉS</div>
                  {despues.map((reserva) => {
                    const fecha = reserva.fechaISO ? fechaDia(reserva.fechaISO) : null;
                    return (
                      <div className="pj-row" key={reserva.id}>
                        <div className="pj-date">
                          <b>{fecha ? fecha.getDate() : "-"}</b>
                          <small>{fecha ? fecha.toLocaleDateString("es-AR", { month: "short" }).replace(".", "") : ""}</small>
                        </div>
                        <div className="pj-row__main">
                          <div className="pj-row__title">{tituloReserva(reserva)}</div>
                          <div className="pj-row__sub">
                            {reserva.detalle.hora} · {reserva.complejo}
                          </div>
                        </div>
                        <span
                          className={`pj-pill ${
                            reserva.pagoBadge?.tono === "pendiente"
                              ? "pj-pill--alert"
                              : reserva.pagoBadge?.tono === "ok" || !reserva.pagoBadge
                                ? "pj-pill--ok"
                                : ""
                          }`}
                        >
                          {reserva.pagoBadge?.texto ?? "Confirmada"}
                        </span>
                      </div>
                    );
                  })}
                  <div className="pj-later__foot">
                    <Link to="/perfil-jugador/reservas" className="pj-link">
                      Ver todas mis reservas →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {despues.length === 0 && (
              <div className="player-card pj-card">
                <div className="pj-card__head">
                  <h3>Después</h3>
                </div>
                <p className="pj-row__sub" style={{ marginBottom: "0.9rem" }}>
                  No tenés más reservas programadas.
                </p>
                <div className="pj-card__foot">
                  <Link to="/canchas" className="pj-btn pj-btn--outline pj-btn--sm">
                    Reservar una cancha
                  </Link>
                </div>
              </div>
            )}
            </>
          )}
        </div>

        <div className="pj-col">
          {progreso}
          {equipos}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
