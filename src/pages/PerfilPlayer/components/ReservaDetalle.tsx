import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../../services/authService";
import { reservasService } from "../../../services/reservasService";
import {
  aplicarPagosInvitados,
  armarLista,
  compartirService,
  participantesService,
  EstadoLink,
} from "../../../services/participantesReserva";
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
  // Si ya se abrio antes, se muestra lo guardado al instante y se actualiza por atras
  const [detalle, setDetalle] = useState<ReservaDetalleData>(
    () => reservasService.detalleGuardado(reserva.detalle.reservaId) ?? reserva.detalle,
  );
  const [cargando, setCargando] = useState(() => !reserva.esMock && !reservasService.detalleGuardado(reserva.detalle.reservaId));
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const pagosRef = useRef<HTMLElement>(null);
  const procesandoRef = useRef(false);
  const [link, setLink] = useState<EstadoLink>(() => compartirService.obtenerEstado(reserva.detalle.reservaId));
  const [linkCopiado, setLinkCopiado] = useState(false);
  const [cambiandoLink, setCambiandoLink] = useState(false);
  const [confirmandoCancelacion, setConfirmandoCancelacion] = useState(false);

  // Cerrar el aviso con Escape (si no se esta cancelando)
  useEffect(() => {
    if (!confirmandoCancelacion) return;
    const alTeclear = (e: KeyboardEvent) => e.key === "Escape" && !procesandoRef.current && setConfirmandoCancelacion(false);
    window.addEventListener("keydown", alTeclear);
    return () => window.removeEventListener("keydown", alTeclear);
  }, [confirmandoCancelacion]);

  useEffect(() => {
    let activo = true;
    const guardado = reservasService.detalleGuardado(reserva.detalle.reservaId);
    setDetalle(guardado ?? reserva.detalle);
    setCargando(!reserva.esMock && !guardado);
    const actualizar = () =>
      reservasService.obtenerDetalle(reserva).then((d) => {
        if (!activo) return;
        setDetalle(d);
        setCargando(false);
      });
    actualizar();

    // Al volver a esta pestaña (por ejemplo, de pagar en Mercado Pago) se actualizan las cuotas
    let ultimo = Date.now();
    const alVolver = () => {
      if (document.visibilityState !== "visible" || Date.now() - ultimo < 10000) return;
      ultimo = Date.now();
      actualizar();
    };
    document.addEventListener("visibilitychange", alVolver);
    window.addEventListener("focus", alVolver);
    return () => {
      activo = false;
      document.removeEventListener("visibilitychange", alVolver);
      window.removeEventListener("focus", alVolver);
    };
  }, [reserva]);

  const esSplit = detalle.metodoPago === "split";
  const tieneEquipo = Boolean(detalle.tuEquipo);
  // Los pagos que hicieron invitados desde el link (guardados en este navegador) tambien cuentan
  const jugadoresVista = link.token
    ? aplicarPagosInvitados(detalle.jugadores, compartirService.pagosInvitados(link.token))
    : detalle.jugadores;
  const pendientes = jugadoresVista.filter((j) => !j.pagado);
  const cantidadPagaron = jugadoresVista.length - pendientes.length;
  const porcentajePropio = detalle.pagoTotalPor
    ? 100
    : jugadoresVista.length > 0
      ? Math.round((cantidadPagaron / jugadoresVista.length) * 100)
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

  // Con 24 horas o mas de anticipacion se reembolsa; con menos, no. Si no se sabe cuando es el partido, no se promete reembolso.
  const horasParaElPartido = (() => {
    if (!reserva.fechaISO) return null;
    const inicio = new Date(`${reserva.fechaISO}T${reserva.hora}:00`).getTime();
    return Number.isNaN(inicio) ? null : (inicio - Date.now()) / 3600000;
  })();
  const conReembolso = horasParaElPartido !== null && horasParaElPartido >= 24;

  const handleCancelar = () => {
    if (reserva.esMock) {
      setMensaje("Estás viendo datos de ejemplo: la cancelación funciona con reservas reales.");
      return;
    }
    setConfirmandoCancelacion(true);
  };

  const confirmarCancelacion = async () => {
    try {
      procesandoRef.current = true;
      setProcesando(true);
      setMensaje("");
      await reservasService.cancelar(detalle.reservaId);
      setConfirmandoCancelacion(false);
      onCancelada();
    } catch (error: any) {
      setMensaje(error?.message || "No se pudo cancelar la reserva");
      setConfirmandoCancelacion(false);
      setProcesando(false);
    } finally {
      procesandoRef.current = false;
    }
  };

  const direccionMaps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    detalle.direccion || detalle.canchaNombre,
  )}`;

  // ---------- Link para compartir ----------
  // La foto es lo que ve quien entra con el link: la reserva y quienes ya pagaron
  const fotoParaCompartir = () => {
    const participantes = participantesService.obtener(detalle.reservaId);
    const lugares = (Number.parseInt(detalle.formato.replace(/\D/g, ""), 10) || 5) * 2;
    const lista =
      jugadoresVista.length > 0
        ? jugadoresVista.map((j) => ({ nombre: j.nombre, pagado: j.pagado }))
        : armarLista(participantes ?? { jugadores: [], cantidad: lugares }).map((j, i) => ({
            nombre: j.nombre,
            pagado: i === 0 && detalle.yoPagado,
          }));
    return {
      reservaId: detalle.reservaId,
      canchaNombre: detalle.canchaNombre,
      ...(detalle.direccion ? { direccion: detalle.direccion } : {}),
      fechaLabel: detalle.fechaLabel,
      hora: detalle.hora,
      formato: detalle.formato,
      organizador: authService.obtenerUsuario()?.nombre ?? "Tu equipo",
      cuota,
      jugadores: lista,
    };
  };

  useEffect(() => {
    if (link.token && link.activo) compartirService.actualizarFoto(link.token, fotoParaCompartir());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detalle, link.token, link.activo]);

  const cambiarLink = async (activo: boolean) => {
    setCambiandoLink(true);
    setLink(await compartirService.cambiar(detalle.reservaId, activo, fotoParaCompartir(), reserva.esMock));
    setCambiandoLink(false);
  };

  const copiarLink = async () => {
    if (!link.token) return;
    try {
      await navigator.clipboard.writeText(compartirService.urlPublica(link.token));
      setLinkCopiado(true);
      setTimeout(() => setLinkCopiado(false), 2500);
    } catch {
      setMensaje("No se pudo copiar el link. Seleccionalo y copialo a mano.");
    }
  };

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
          <div className="rd-share" role="group" aria-label="Compartir partido">
            <span className="rd-share__titulo">
              Compartir
              <span
                className="rd-share__info"
                tabIndex={0}
                aria-label="Con el interruptor activo, cualquiera que tenga el link ve la reserva y puede pagar su cuota. No se publica en ningún listado."
              >
                ⓘ
                <span className="rd-share__tip" role="tooltip">
                  Con el interruptor activo, cualquiera que tenga el link ve la reserva y puede pagar su cuota. No se
                  publica en ningún listado. Si lo desactivás, el link deja de funcionar.
                </span>
              </span>
            </span>
            <label className="rd-switch">
              <input
                type="checkbox"
                checked={link.activo}
                disabled={cambiandoLink}
                onChange={(e) => cambiarLink(e.target.checked)}
                aria-label="Activar el link del partido"
              />
              <span />
            </label>
            <button
              type="button"
              className="rd-btn rd-btn--ghost rd-btn--sm"
              onClick={copiarLink}
              disabled={!link.activo || !link.token}
            >
              {linkCopiado ? "¡Copiado!" : "Copiar link"}
            </button>
          </div>
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
                      : `${cantidadPagaron} de ${jugadoresVista.length} jugadores pagaron`}
                  </span>
                  {cuota > 0 && jugadoresVista.length > 0 && (
                    <strong>
                      {fmt(cantidadPagaron * cuota)} de {fmt(jugadoresVista.length * cuota)}
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
              {!cargando && esSplit && jugadoresVista.length === 0 && (
                <p className="rd-vacio">Todavía no hay cuotas para mostrar.</p>
              )}
              <div className="rd-jugadores">{jugadoresVista.map(renderJugador)}</div>

              {pendientes.length >= 2 && !jugadoresVista.some((j) => j.esSlot) && (
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

          {!detalle.rival && detalle.esMatchmaking && (
            <section className="player-card rd-card">
              <h2 className="rd-card__title">
                <img src={`${ICON_BASE}/equipos.svg`} alt="" />
                Equipo rival
              </h2>
              <p className="rd-vacio">
                Buscando oponente. Cuando otro equipo se postule, vas a ver acá su porcentaje pagado.
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
              <p>Si cancelás con 24 hs o más de anticipación, se te reembolsa lo pagado. Con menos tiempo, no hay reembolso.</p>
              <button type="button" className="rd-btn-cancelar" onClick={handleCancelar} disabled={procesando}>
                Cancelar reserva
              </button>
            </div>
          </section>
        </div>
      </div>

      {confirmandoCancelacion && (
        <div
          className="rd-confirm-overlay"
          onClick={() => !procesando && setConfirmandoCancelacion(false)}
        >
          <div
            className="rd-confirm"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="rd-confirm-titulo"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="rd-confirm__icono" aria-hidden="true">
              !
            </span>
            <h3 id="rd-confirm-titulo">¿Seguro que querés cancelar la reserva?</h3>
            <p>
              Se cancela <strong>{detalle.canchaNombre}</strong>, {detalle.fechaLabel} a las {detalle.hora}. Esta acción no se puede deshacer.
            </p>
            <p className={`rd-confirm__aviso ${conReembolso ? "rd-confirm__aviso--ok" : "rd-confirm__aviso--no"}`}>
              {conReembolso
                ? "Faltan 24 horas o más para el partido: se te reembolsará lo que pagaste."
                : "Faltan menos de 24 horas para el partido: no hay reembolso, según las condiciones que aceptaste al reservar."}
            </p>
            <div className="rd-confirm__acciones">
              <button type="button" className="rd-btn rd-btn--ghost" onClick={() => setConfirmandoCancelacion(false)} disabled={procesando}>
                Volver
              </button>
              <button type="button" className="rd-confirm__peligro" onClick={confirmarCancelacion} disabled={procesando}>
                {procesando ? "Cancelando..." : "Sí, cancelar reserva"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservaDetalle;
