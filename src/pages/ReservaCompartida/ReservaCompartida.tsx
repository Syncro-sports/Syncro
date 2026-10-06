import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { abrirVentanaPago, irAMercadoPago } from "../../services/mercadoPago";
import { aplicarPagosInvitados, compartirService, ReservaCompartida as Reserva } from "../../services/participantesReserva";
import "./ReservaCompartida.css";

const BASE = import.meta.env.BASE_URL;
const fmt = (n: number) => `$${n.toLocaleString("es-AR")}`;

const iniciales = (nombre: string) =>
  nombre
    .replace(/\(.*\)/, "")
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

// Pagina publica de una reserva: la abre cualquiera que tenga el link, sin iniciar sesion.
// Muestra quienes pagaron y quienes faltan, y deja pagar la cuota escribiendo un nombre.
const ReservaCompartida = () => {
  const { token = "" } = useParams();
  const [reserva, setReserva] = useState<Reserva | null>(null);
  const [cargando, setCargando] = useState(true);
  const [nombre, setNombre] = useState("");
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagoUrl, setPagoUrl] = useState<string | null>(null);
  const [pagoHecho, setPagoHecho] = useState<string | null>(null);

  const cargar = () =>
    compartirService.obtenerPublica(token).then((r) => {
      setReserva(r);
      setCargando(false);
    });

  useEffect(() => {
    setCargando(true);
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const jugadores = reserva ? aplicarPagosInvitados(reserva.jugadores, reserva.pagosInvitados) : [];
  const pagaron = jugadores.filter((j) => j.pagado).length;
  const porcentaje = jugadores.length ? Math.round((pagaron / jugadores.length) * 100) : 0;
  const nombreValido = nombre.trim().length >= 2;
  const completo = jugadores.length > 0 && pagaron === jugadores.length;

  const pagar = async () => {
    if (!reserva || !nombreValido) return;
    const limpio = nombre.trim();
    // La pestaña de Mercado Pago se abre ahora, con el clic, para que el navegador no la bloquee
    const ventana = abrirVentanaPago();
    setProcesando(true);
    setError(null);
    try {
      const { initPoint } = await compartirService.pagarComoInvitado(token, limpio);
      irAMercadoPago(ventana, initPoint);
      setPagoUrl(initPoint);
      await cargar();
    } catch (err) {
      ventana?.close();
      setError(err instanceof Error ? err.message : "No se pudo iniciar el pago");
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="rc">
      <header className="rc-top">
        <Link to="/" className="rc-top__logo">
          <img src={`${BASE}assets/logo-white.svg`} alt="Syncro" />
        </Link>
        <Link to="/login" className="rc-top__login">
          Iniciar sesión
        </Link>
      </header>

      <main className="rc-main">
        {cargando && <p className="rc-estado">Cargando la reserva...</p>}

        {!cargando && !reserva && (
          <div className="rc-card rc-bloqueado">
            <h1>No encontramos esta reserva</h1>
            <p>El link puede estar incompleto. Pedile a quien organiza el partido que te lo pase de nuevo.</p>
          </div>
        )}

        {!cargando && reserva && !reserva.activo && (
          <div className="rc-card rc-bloqueado">
            <h1>Este link ya no está disponible</h1>
            <p>Quien organiza el partido lo desactivó. Pedile que te pase uno nuevo.</p>
          </div>
        )}

        {!cargando && reserva && reserva.activo && (
          <>
            <section className="rc-card rc-hero">
              <span className="rc-tag">{reserva.formato}</span>
              <h1>{reserva.canchaNombre}</h1>
              <p className="rc-hero__cuando">
                {reserva.fechaLabel} · {reserva.hora} hs
              </p>
              {reserva.direccion && <p className="rc-muted">{reserva.direccion}</p>}
              <p className="rc-muted">Organiza: {reserva.organizador}</p>
            </section>

            <section className="rc-card">
              <div className="rc-fila">
                <h2>Pagos del equipo</h2>
                <span className="rc-muted">
                  {pagaron} de {jugadores.length} pagaron
                </span>
              </div>
              <div className="rc-barra">
                <i style={{ width: `${porcentaje}%` }} />
              </div>
              <div className="rc-lista">
                {jugadores.map((j, i) => (
                  <div className="rc-jugador" key={`${j.nombre}-${i}`}>
                    <span className="rc-av">{iniciales(j.nombre)}</span>
                    <span className="rc-jugador__n">{j.nombre}</span>
                    <span className={j.pagado ? "rc-pago" : "rc-falta"}>{j.pagado ? "Pagó" : "Falta pagar"}</span>
                  </div>
                ))}
              </div>
            </section>

            {pagoHecho ? (
              <section className="rc-card rc-gracias">
                <span className="rc-ok">✓</span>
                <h2>¡Listo, {pagoHecho}!</h2>
                <p>Tu cuota quedó registrada. Ya figurás en la lista de arriba.</p>
              </section>
            ) : pagoUrl ? (
              <section className="rc-card rc-gracias">
                <span className="rc-ok">✓</span>
                <h2>Completá el pago en Mercado Pago</h2>
                <p>Lo abrimos en otra pestaña. Si no se abrió, usá el botón.</p>
                <a className="rc-btn" href={pagoUrl} target="_blank" rel="noopener noreferrer">
                  Abrir Mercado Pago
                </a>
              </section>
            ) : completo ? (
              <section className="rc-card rc-gracias">
                <span className="rc-ok">✓</span>
                <h2>Todas las cuotas están pagas</h2>
                <p>No falta nadie: ya no hay lugares para pagar.</p>
              </section>
            ) : (
              <section className="rc-card">
                <h2>Sumate al partido</h2>
                <p className="rc-muted">
                  Tu cuota: <strong className="rc-cuota">{fmt(reserva.cuota)}</strong>
                </p>
                <input
                  className="rc-input"
                  placeholder="Tu nombre (así te ven los demás)"
                  maxLength={30}
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  aria-label="Tu nombre"
                />
                <button type="button" className="rc-btn" onClick={pagar} disabled={!nombreValido || procesando}>
                  {procesando ? "Abriendo Mercado Pago..." : "Pagar mi cuota con Mercado Pago"}
                </button>
                {error && (
                  <p className="rc-error" role="alert">
                    {error}
                  </p>
                )}
                <p className="rc-muted rc-nota">
                  No necesitás crear una cuenta. ¿Ya tenés una? <Link to="/login">Iniciá sesión</Link> y tu pago queda en tu perfil.
                </p>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default ReservaCompartida;
