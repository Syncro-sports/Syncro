import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { reservasService } from "../../../services/reservasService";
import { JugadorPago, ReservaDetalleData, ReservaJugador } from "../reservasData";
import { CalendarIcon } from "./icons";
import { linkGoogleCalendar, tituloEvento } from "../calendario";
import "./ReservaDetalle.css";

const ICON_BASE = `${import.meta.env.BASE_URL}assets/icons`;

const fmt = (n: number) => `$${n.toLocaleString("es-AR")}`;

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

interface ReservaDetalleProps {
  reserva: ReservaJugador;
  onVolver: () => void;
  onCancelada: () => void;
}

const ReservaDetalle = ({ reserva, onVolver, onCancelada }: ReservaDetalleProps) => {
  const navigate = useNavigate();
  const [detalle, setDetalle] = useState<ReservaDetalleData>(reserva.detalle);
  const [cargando, setCargando] = useState(!reserva.esMock);
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [linkCopiado, setLinkCopiado] = useState(false);
  const pagosRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let activo = true;
    setDetalle(reserva.detalle);
    setCargando(!reserva.esMock);
    reservasService.obtenerDetalle(reserva).then((d) => {
      if (!activo) return;
      setDetalle(d);
      setCargando(false);
    });
    return () => {
      activo = false;
    };
  }, [reserva]);

  const esSplit = detalle.metodoPago === "split";
  const tieneEquipo = Boolean(detalle.tuEquipo);
  const pendientes = detalle.jugadores.filter((j) => !j.pagado);
  const cantidadPagaron = detalle.jugadores.length - pendientes.length;
  const porcentajePropio = detalle.pagoTotalPor
    ? 100
    : detalle.jugadores.length > 0
      ? Math.round((cantidadPagaron / detalle.jugadores.length) * 100)
      : 0;
  const cuota = detalle.cuota ?? 0;
  const mostrarPagosEquipo = esSplit || Boolean(detalle.pagoTotalPor);

  const irAPagosEquipo = () => pagosRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  // Ejecuta un pago (pide el link a Mercado Pago y redirige). Con datos de
  // ejemplo no hay nada real que cobrar, asi que solo avisa.
  const pagar = async (obtenerLink: () => Promise<string>) => {
    if (reserva.esMock) {
      setMensaje("Estás viendo datos de ejemplo: el pago funciona con reservas reales.");
      return;
    }
    try {
      setProcesando(true);
      setMensaje("");
      window.location.href = await obtenerLink();
    } catch (error: any) {
      setMensaje(error?.message || "No se pudo iniciar el pago");
      setProcesando(false);
    }
  };

  const pagarMiCuota = () => {
    if (reserva.esMock) return pagar(async () => "");
    const entrada =
      detalle.jugadores.find((j) => j.esYo && !j.pagado && j.entradaId) ?? pendientes.find((j) => j.entradaId);
    if (!entrada?.entradaId) {
      setMensaje("No hay una cuota disponible para pagar en este momento.");
      return;
    }
    pagar(() => reservasService.pagarEntrada(entrada.entradaId!));
  };

  const pagarCuotaDe = (jugador: JugadorPago) => {
    if (reserva.esMock) return pagar(async () => "");
    if (!jugador.entradaId) {
      setMensaje("Pagar la cuota de otro jugador funciona con reservas reales.");
      return;
    }
    // Las filas reales son entradas sin jugador asignado: se paga la cuota
    // para quien paga. Con jugadores identificados se mandaria su id.
    pagar(() => reservasService.pagarEntrada(jugador.entradaId!, jugador.esSlot ? undefined : jugador.id));
  };

  const pagarReservaCompleta = (tipo: "senia" | "total") => pagar(() => reservasService.pagarReserva(detalle.reservaId, tipo));

  const titulo = tituloEvento(detalle);
  const linkCalendario = linkGoogleCalendar({ ...reserva, detalle });

  // Si la reserva viene de un partido se comparte su link; si es privada
  // (no tiene pagina publica) se comparte un resumen en texto.
  const handleCompartir = async () => {
    const contenido = detalle.partidoId
      ? `${window.location.origin}${import.meta.env.BASE_URL}partidos?partido=${detalle.partidoId}`
      : `${titulo} - ${detalle.fechaLabel}, ${detalle.hora} hs - ${detalle.canchaNombre}${
          detalle.direccion ? `, ${detalle.direccion}` : ""
        }`;
    try {
      await navigator.clipboard.writeText(contenido);
      setLinkCopiado(true);
      setTimeout(() => setLinkCopiado(false), 2000);
    } catch {
      window.prompt("Copiá este texto para compartir:", contenido);
    }
  };

  const handleCancelar = async () => {
    if (reserva.esMock) {
      setMensaje("Estás viendo datos de ejemplo: la cancelación funciona con reservas reales.");
      return;
    }
    if (!window.confirm("¿Querés cancelar esta reserva? Esta acción no se puede deshacer.")) return;
    try {
      setProcesando(true);
      setMensaje("");
      await reservasService.cancelar(detalle.reservaId);
      onCancelada();
    } catch (error: any) {
      setMensaje(error?.message || "No se pudo cancelar la reserva");
      setProcesando(false);
    }
  };

  const direccionMaps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    detalle.direccion || detalle.canchaNombre,
  )}`;

  // ---------- Panel de accion (lo primero que necesita el jugador) ----------
  const renderAccion = () => {
    if (detalle.pagoTotalPor) {
      return (
        <>
          <span className="rd-accion__label">TU CUOTA</span>
          <div className="rd-accion__ok">
            <span className="rd-check"><CheckIcon /></span>
            <div>
              <p className="rd-accion__ok-title">No tenés nada que pagar</p>
              <p className="rd-accion__ok-sub">{detalle.pagoTotalPor} pagó el total del equipo.</p>
            </div>
          </div>
        </>
      );
    }

    if (esSplit && !detalle.yoPagado) {
      return (
        <>
          <span className="rd-accion__label">TU CUOTA</span>
          <div className="rd-accion__monto-row">
            <span className="rd-accion__monto">{fmt(cuota)}</span>
            <span className="rd-estado rd-estado--pendiente">Pendiente</span>
          </div>
          {detalle.plazoLabel && (
            <p className="rd-accion__plazo">
              <img src={`${ICON_BASE}/reloj.svg`} alt="" />
              <span>
                Pagá hasta el <strong>{detalle.plazoLabel}</strong> (24 hs antes del partido).
              </span>
            </p>
          )}
          <button type="button" className="rd-cta" onClick={pagarMiCuota} disabled={procesando}>
            <img src={`${ICON_BASE}/billetera.svg`} alt="" />
            {procesando ? "Procesando..." : "Pagar mi cuota"}
          </button>
          <p className="rd-accion__nota">Pagás de forma segura con Mercado Pago.</p>
          {detalle.otrosPendientes > 0 && (
            <button type="button" className="rd-link" onClick={irAPagosEquipo}>
              ¿Querés pagar también la cuota de otro jugador? ↓
            </button>
          )}
        </>
      );
    }

    if (esSplit) {
      return (
        <>
          <span className="rd-accion__label">TU CUOTA</span>
          <div className="rd-accion__ok">
            <span className="rd-check"><CheckIcon /></span>
            <div>
              <p className="rd-accion__ok-title">Tu cuota está paga</p>
              <p className="rd-accion__ok-sub">Listo, tu lugar está asegurado.</p>
            </div>
          </div>
          {detalle.otrosPendientes > 0 && (
            <>
              <p className="rd-accion__plazo">
                <img src={`${ICON_BASE}/reloj.svg`} alt="" />
                <span>
                  Faltan <strong>{detalle.otrosPendientes} {detalle.otrosPendientes === 1 ? "cuota" : "cuotas"}</strong> de tu
                  equipo{detalle.plazoLabel ? `, hasta el ${detalle.plazoLabel}` : ""}.
                </span>
              </p>
              <button type="button" className="rd-btn rd-btn--outline rd-btn--block" onClick={irAPagosEquipo}>
                Ver quién falta pagar
              </button>
            </>
          )}
        </>
      );
    }

    // Reserva de pago completo
    if (detalle.estado === "confirmada") {
      return (
        <>
          <span className="rd-accion__label">TU RESERVA</span>
          <div className="rd-accion__ok">
            <span className="rd-check"><CheckIcon /></span>
            <div>
              <p className="rd-accion__ok-title">Reserva confirmada</p>
              <p className="rd-accion__ok-sub">
                Total {fmt(detalle.total)} · Seña {fmt(detalle.senia)}
              </p>
            </div>
          </div>
        </>
      );
    }

    return (
      <>
        <span className="rd-accion__label">SEÑA A PAGAR</span>
        <div className="rd-accion__monto-row">
          <span className="rd-accion__monto">{fmt(detalle.senia)}</span>
          <span className="rd-estado rd-estado--pendiente">Pendiente</span>
        </div>
        {detalle.plazoLabel && (
          <p className="rd-accion__plazo">
            <img src={`${ICON_BASE}/reloj.svg`} alt="" />
            <span>
              Tenés hasta <strong>{detalle.plazoLabel}</strong> para pagar.
            </span>
          </p>
        )}
        <button type="button" className="rd-cta" onClick={() => pagarReservaCompleta("senia")} disabled={procesando}>
          <img src={`${ICON_BASE}/billetera.svg`} alt="" />
          {procesando ? "Procesando..." : "Pagar seña"}
        </button>
        <button type="button" className="rd-link" onClick={() => pagarReservaCompleta("total")} disabled={procesando}>
          Prefiero pagar el total ({fmt(detalle.total)})
        </button>
        <p className="rd-accion__nota">Pagás de forma segura con Mercado Pago.</p>
      </>
    );
  };

  const renderJugador = (j: JugadorPago) => {
    const puedePagarOtro = !j.pagado && !j.esYo;
    return (
      <div className="rd-jugador" key={j.id}>
        <div className="rd-jugador__avatar">{j.iniciales}</div>
        <div className="rd-jugador__info">
          <div className="rd-jugador__nombre">
            {j.nombre}
            {j.esCapitan && <span className="rd-jugador__captain">C</span>}
            {j.esYo && <span className="rd-jugador__yo">VOS</span>}
          </div>
          {j.pagadoPor && <div className="rd-jugador__sub">Cuota pagada por {j.pagadoPor}</div>}
        </div>
        <div className="rd-jugador__accion">
          {j.pagado ? (
            <span className="rd-estado rd-estado--pagado">Pagado</span>
          ) : j.esYo ? (
            <span className="rd-estado rd-estado--pendiente">Pendiente</span>
          ) : (
            <>
              <span className="rd-estado">Pendiente</span>
              {puedePagarOtro && (
                <button
                  type="button"
                  className="rd-btn rd-btn--outline rd-btn--sm"
                  onClick={() => pagarCuotaDe(j)}
                  disabled={procesando}
                >
                  {j.esSlot ? "Pagar esta cuota" : "Pagar su cuota"} {fmt(cuota)}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="rd">
      <div className="rd__topbar">
        <button type="button" className="rd__volver" onClick={onVolver}>
          ← Mis reservas
        </button>
        <div className="rd__acciones">
          {linkCalendario && (
            <a
              className="rd-btn rd-btn--ghost rd-btn--sm"
              href={linkCalendario}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="rd-btn__icono"><CalendarIcon /></span>
              Añadir al calendario
            </a>
          )}
          <button type="button" className="rd-btn rd-btn--ghost rd-btn--sm" onClick={handleCompartir}>
            {linkCopiado ? "¡Copiado!" : "Compartir partido"}
            <img src={`${ICON_BASE}/compartir.svg`} alt="" />
          </button>
        </div>
      </div>

      {reserva.esMock && !reserva.esDemo && (
        <p className="rd-aviso">Estás viendo datos de ejemplo porque no se pudo conectar con el servidor.</p>
      )}
      {mensaje && <p className="rd-mensaje">{mensaje}</p>}

      <section className="player-card rd-hero">
        <div className="rd-hero__match">
          <div className="rd-chips">
            <span className="rd-chip">{detalle.estado === "confirmada" ? "Reserva confirmada" : "Pago pendiente"}</span>
            <span className="rd-chip rd-chip--muted">{detalle.tipoLabel}</span>
          </div>

          {tieneEquipo && (
            <div className="rd-vs">
              <div className="rd-vs__team">
                <div className="rd-shield rd-shield--local">
                  <img src={`${ICON_BASE}/remera-local.svg`} alt="" />
                </div>
                <div>
                  <div className="rd-vs__name">{detalle.tuEquipo}</div>
                  <div className="rd-vs__tag">TU EQUIPO</div>
                </div>
              </div>
              {detalle.rival && (
                <>
                  <span className="rd-vs__sep">VS</span>
                  <div className="rd-vs__team">
                    <div className="rd-shield rd-shield--rival">
                      <img src={`${ICON_BASE}/remera-rival.svg`} alt="" />
                    </div>
                    <div>
                      <div className="rd-vs__name">{detalle.rival.nombre}</div>
                      <div className="rd-vs__tag rd-vs__tag--muted">RIVAL</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="rd-hero__when">
            <p className="rd-hero__fecha">{detalle.fechaLabel}</p>
            <p className="rd-hero__hora">{detalle.hora}</p>
          </div>

          <div className="rd-hero__where">
            <img src={`${ICON_BASE}/lugar.svg`} alt="" />
            <div>
              <strong>{detalle.canchaNombre}</strong>
              {detalle.direccion && <span>{detalle.direccion}</span>}
              {detalle.direccion && <br />}
              <a href={direccionMaps} target="_blank" rel="noopener noreferrer">
                Ver en maps ↗
              </a>
            </div>
          </div>
        </div>

        {reserva.imagen && (
          <div className="rd-hero__photo">
            <img src={reserva.imagen} alt="" />
          </div>
        )}

        <aside className="rd-accion">{renderAccion()}</aside>
      </section>

      <div className="rd-cols">
        <div className="rd-col">
          {mostrarPagosEquipo ? (
            <section className="player-card rd-card" ref={pagosRef}>
              <h2 className="rd-card__title">
                <img src={`${ICON_BASE}/billetera.svg`} alt="" />
                Pagos de tu equipo
              </h2>

              <div className="rd-progreso">
                <div className="rd-progreso__row">
                  <span>
                    {detalle.pagoTotalPor
                      ? "Tu equipo pagó el total de la reserva"
                      : `${cantidadPagaron} de ${detalle.jugadores.length} jugadores pagaron`}
                  </span>
                  {cuota > 0 && detalle.jugadores.length > 0 && (
                    <strong>
                      {fmt(cantidadPagaron * cuota)} de {fmt(detalle.jugadores.length * cuota)}
                    </strong>
                  )}
                </div>
                <div className="rd-barra">
                  <div className="rd-barra__fill" style={{ width: `${porcentajePropio}%` }} />
                </div>
              </div>

              {detalle.pagoTotalPor && (
                <div className="rd-box-total">
                  <span className="rd-check"><CheckIcon /></span>
                  <span>
                    El pago total lo realizó <strong>{detalle.pagoTotalPor}</strong>. No hay cuotas pendientes.
                  </span>
                </div>
              )}

              {cargando && <p className="rd-vacio">Cargando pagos del equipo...</p>}
              {!cargando && esSplit && detalle.jugadores.length === 0 && (
                <p className="rd-vacio">Todavía no hay cuotas para mostrar.</p>
              )}
              <div className="rd-jugadores">{detalle.jugadores.map(renderJugador)}</div>

              {pendientes.length >= 2 && !detalle.jugadores.some((j) => j.esSlot) && (
                <div className="rd-pagar-todas">
                  <span>{pendientes.length} cuotas pendientes en total</span>
                  <button
                    type="button"
                    className="rd-btn rd-btn--ghost rd-btn--sm"
                    onClick={() => setMensaje("Pagar todas las cuotas a la vez todavía no está disponible.")}
                  >
                    Pagar todas las pendientes · {fmt(pendientes.length * cuota)}
                  </button>
                </div>
              )}

              <p className="rd-privacidad">
                <img src={`${ICON_BASE}/informacion.svg`} alt="" />
                <span>Este detalle lo ven solo los integrantes de tu equipo.</span>
              </p>
            </section>
          ) : (
            <section className="player-card rd-card">
              <h2 className="rd-card__title">
                <img src={`${ICON_BASE}/billetera.svg`} alt="" />
                Pago de la reserva
              </h2>
              <div className="rd-calculo__body">
                <div className="rd-fila"><span>Total de la reserva</span><strong>{fmt(detalle.total)}</strong></div>
                <div className="rd-fila"><span>Seña</span><strong>{fmt(detalle.senia)}</strong></div>
                <div className="rd-divider" />
                <div className="rd-fila">
                  <span>Estado</span>
                  <strong>{detalle.estado === "confirmada" ? "Confirmada" : "Pendiente de pago"}</strong>
                </div>
              </div>
            </section>
          )}

          {detalle.calculo && (
            <section className="player-card rd-card">
              <details className="rd-calculo">
                <summary>
                  <span>¿Cómo se calcula tu cuota?</span>
                  <span className="rd-calculo__chev">▾</span>
                </summary>
                <div className="rd-calculo__body">
                  <div className="rd-fila"><span>Costo total de la cancha ({detalle.duracion})</span><strong>{fmt(detalle.calculo.costoCancha)}</strong></div>
                  {detalle.calculo.promocion > 0 && (
                    <div className="rd-fila rd-fila--promo"><span>Promoción</span><strong>- {fmt(detalle.calculo.promocion)}</strong></div>
                  )}
                  <div className="rd-divider" />
                  <div className="rd-fila"><span>Total a repartir entre los dos equipos</span><strong>{fmt(detalle.calculo.totalConPromocion)}</strong></div>
                  <div className="rd-fila"><span>Parte de tu equipo</span><strong>{fmt(detalle.calculo.parteEquipo)}</strong></div>
                  <div className="rd-divider" />
                  <div className="rd-total">
                    <span>Entre {detalle.calculo.jugadoresPorEquipo} jugadores, cada uno paga</span>
                    <strong>{fmt(detalle.calculo.cuota)}</strong>
                  </div>
                </div>
              </details>
            </section>
          )}
        </div>

        <div className="rd-col">
          {detalle.rival && (
            <section className="player-card rd-card">
              <h2 className="rd-card__title">
                <img src={`${ICON_BASE}/equipos.svg`} alt="" />
                Equipo rival
              </h2>
              <div className="rd-rival">
                <div className="rd-shield rd-shield--rival">
                  <img src={`${ICON_BASE}/remera-rival.svg`} alt="" />
                </div>
                <div className="rd-rival__datos">
                  <div className="rd-vs__name rd-vs__name--sm">{detalle.rival.nombre}</div>
                  {(detalle.rival.ubicacion || detalle.rival.nivel) && (
                    <p className="rd-rival__sub">
                      {[detalle.rival.ubicacion, detalle.rival.nivel ? `Nivel ${detalle.rival.nivel}` : null]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  )}
                </div>
              </div>

              {detalle.rival.porcentajePagado !== undefined && (
                <div className="rd-progreso">
                  <div className="rd-progreso__row">
                    <span>{detalle.rival.porcentajePagado === 0 ? "Todavía no pagó" : "Pagado por el equipo"}</span>
                    <strong>{detalle.rival.porcentajePagado}%</strong>
                  </div>
                  <div className="rd-barra">
                    <div className="rd-barra__fill" style={{ width: `${detalle.rival.porcentajePagado}%` }} />
                  </div>
                </div>
              )}

              {detalle.rival.id && (
                <button
                  type="button"
                  className="rd-btn rd-btn--ghost rd-btn--sm rd-btn--block"
                  onClick={() => navigate(`/equipos/${encodeURIComponent(detalle.rival!.id!)}`)}
                >
                  Ver perfil del equipo ›
                </button>
              )}

              <p className="rd-privacidad">
                <img src={`${ICON_BASE}/informacion.svg`} alt="" />
                <span>Del equipo rival solo ves el porcentaje total pagado. Ellos tampoco ven el detalle de tu equipo.</span>
              </p>
            </section>
          )}

          <section className="player-card rd-card">
            <h2 className="rd-card__title">
              <img src={`${ICON_BASE}/canchas.svg`} alt="" />
              {tieneEquipo ? "Detalles del partido" : "Detalles de la reserva"}
            </h2>
            <dl className="rd-detalles">
              <div><dt>Formato</dt><dd>{detalle.formato}</dd></div>
              <div><dt>Superficie</dt><dd>{detalle.superficie}</dd></div>
              <div><dt>Duración</dt><dd>{detalle.duracion}</dd></div>
              <div><dt>Tipo de reserva</dt><dd>{detalle.tipoLabel}</dd></div>
              <div><dt>Método de pago</dt><dd>{esSplit ? "Split payment" : "Pago total"}</dd></div>
              <div><dt>Reserva N.º</dt><dd>{detalle.numero}</dd></div>
            </dl>
          </section>

          <section className="player-card rd-card">
            <h2 className="rd-card__title">
              <img src={`${ICON_BASE}/reloj.svg`} alt="" />
              Cancelación
            </h2>
            <div className="rd-cancelacion">
              <p>Podés cancelar sin costo hasta 12 hs antes del inicio del partido.</p>
              <button type="button" className="rd-btn-cancelar" onClick={handleCancelar} disabled={procesando}>
                Cancelar reserva
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ReservaDetalle;
