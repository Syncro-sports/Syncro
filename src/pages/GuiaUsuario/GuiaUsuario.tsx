import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./GuiaUsuario.css";

const ICON_BASE = `${import.meta.env.BASE_URL}assets/icons`;

const pasosIniciales = [
  {
    icono: `${ICON_BASE}/perfil.svg`,
    titulo: "Creá tu cuenta",
    texto: "Te registrás y verificás tu identidad con tu número de teléfono.",
  },
  {
    icono: `${ICON_BASE}/perfil-edit.svg`,
    titulo: "Elegí tu rol",
    texto: "Jugador, si querés organizar y sumarte a partidos, o Host, si administrás un complejo con canchas.",
  },
  {
    icono: `${ICON_BASE}/juega.svg`,
    titulo: "Empezá a usarlo",
    texto: "Cada rol tiene su propia sección más abajo en esta guía, con el paso a paso completo.",
  },
];

const beneficiosJugador = [
  {
    icono: `${ICON_BASE}/pelota-header.svg`,
    titulo: "Matchmaking",
    texto: "Buscá rival de tu nivel y elegí si el partido es amistoso o competitivo.",
  },
  {
    icono: `${ICON_BASE}/clipboard-list.svg`,
    titulo: "Partidos abiertos",
    texto: "Postulate a un partido que le falten jugadores; el capitán aprueba o rechaza tu solicitud.",
  },
  {
    icono: `${ICON_BASE}/billetera.svg`,
    titulo: "Pago dividido",
    texto: "Pagás solo tu parte del partido, desde la app, antes de jugar.",
  },
  {
    icono: `${ICON_BASE}/torneos.svg`,
    titulo: "Progresión",
    texto: "Sumás puntos por equipo (competitivo), experiencia siempre, y un rango que te empareja con rivales parejos.",
  },
  {
    icono: `${ICON_BASE}/equipos.svg`,
    titulo: "Hasta 3 equipos",
    texto: "Podés pertenecer a 3 equipos distintos a la vez, cada uno con su propio historial y puntaje.",
  },
  {
    icono: `${ICON_BASE}/historial.svg`,
    titulo: "Historial y estadísticas",
    texto: "Revisá tus partidos jugados, victorias, derrotas y goles en cualquier momento.",
  },
];

const pasosJugador = [
  {
    icono: `${ICON_BASE}/pelota-header.svg`,
    titulo: "Organizá o sumate a un partido",
    texto: "Creá tu propio partido eligiendo cancha, horario y modo, o postulate a uno abierto que ya exista.",
  },
  {
    icono: `${ICON_BASE}/billetera.svg`,
    titulo: "Pagá tu parte",
    texto: "Una vez confirmado, pagás tu parte del costo total desde la app.",
  },
  {
    icono: `${ICON_BASE}/juega.svg`,
    titulo: "Jugá",
    texto: "Podés cancelar gratis hasta 12 horas antes si algo cambia.",
  },
  {
    icono: `${ICON_BASE}/historial.svg`,
    titulo: "Cargá el resultado",
    texto: "Si fue competitivo, te va a llegar un recordatorio para confirmarlo y sumar tus puntos.",
  },
];

const faqJugador = [
  {
    pregunta: "¿Cómo funciona el pago dividido?",
    respuesta:
      "El costo total de la cancha se divide de forma equitativa entre los jugadores. Cada uno paga su parte desde la app antes de entrar a la cancha.",
  },
  {
    pregunta: "¿Qué pasa si un rival cancela a último momento?",
    respuesta:
      "Syncro no cancela el partido: reabre la búsqueda automáticamente ofreciendo el cruce a otros equipos. Si no se llega a jugar, tu dinero vuelve como crédito.",
  },
  {
    pregunta: "¿Diferencia entre partido Amistoso y Competitivo?",
    respuesta:
      "El Amistoso no afecta estadísticas. El Competitivo suma/resta puntos en el ranking y requiere la validación del resultado por parte del complejo.",
  },
  {
    pregunta: "¿En cuántos equipos puedo jugar?",
    respuesta:
      "Podés formar parte de hasta 3 equipos simultáneamente, manteniendo historiales y puntajes separados.",
  },
];

const beneficiosHost = [
  {
    icono: `${ICON_BASE}/barra-dashboard.svg`,
    titulo: "Dashboard de ingresos",
    texto: "Vista general de tus reservas y ganancias, y la ocupación de tus canchas por turno.",
  },
  {
    icono: `${ICON_BASE}/canchas.svg`,
    titulo: "Gestión de canchas",
    texto: "Cargá tus canchas y definí precios distintos por horario (día/noche).",
  },
  {
    icono: `${ICON_BASE}/torneos.svg`,
    titulo: "Modo competitivo",
    texto: "Habilitalo por cancha y horario para que los equipos puedan jugar partidos que suman al ranking.",
  },
  {
    icono: `${ICON_BASE}/equipos-2.svg`,
    titulo: "Staff con permisos",
    texto: "Sumá a tu equipo de trabajo con roles y accesos distintos dentro del panel.",
  },
  {
    icono: `${ICON_BASE}/valoracion.svg`,
    titulo: "Reseñas de Google",
    texto: "Consultalas y respondé a tus jugadores directamente desde el panel.",
  },
  {
    icono: `${ICON_BASE}/arbitro.svg`,
    titulo: "Resolución de disputas",
    texto: "Intervenís cuando dos equipos no coinciden en el resultado de un partido competitivo.",
  },
];

const pasosHost = [
  {
    icono: `${ICON_BASE}/perfil.svg`,
    titulo: "Dá de alta tu perfil de complejo",
    texto: "Completá el registro institucional y subí los datos de verificación.",
  },
  {
    icono: `${ICON_BASE}/canchas.svg`,
    titulo: "Cargá tus canchas",
    texto: "Elegí la superficie, el formato y asigná tarifas por horario.",
  },
  {
    icono: `${ICON_BASE}/reserva.svg`,
    titulo: "Empezá a recibir reservas",
    texto: "Tu complejo aparece automáticamente en el buscador de la app.",
  },
  {
    icono: `${ICON_BASE}/equipos-2.svg`,
    titulo: "Sumá staff y gestioná el día a día",
    texto: "Invitá empleados con permisos, revisá tu caja y respondé reseñas.",
  },
];

const faqHost = [
  {
    pregunta: "¿Cómo invito a los jugadores a reservar en mi complejo?",
    respuesta:
      "Una vez activado tu perfil, tu complejo aparece automáticamente en el mapa y buscador de la app. También podés compartir el enlace directo de tu perfil por WhatsApp o redes sociales.",
  },
  {
    pregunta: "¿Puedo establecer precios según el horario?",
    respuesta: "Sí, podés definir tarifas diferenciadas para horarios nocturnos o fines de semana.",
  },
  {
    pregunta: "¿Qué sucede si un jugador pide la devolución de su pago?",
    respuesta:
      "Si la cancelación cumple con el plazo de anticipación (12 horas), el sistema reintegra el importe automáticamente en formato de créditos dentro de la app, por lo que el dinero no sale de tu caja ni requiere gestiones manuales.",
  },
  {
    pregunta: "¿Cómo sumo a un recepcionista o empleado?",
    respuesta:
      'En la sección Staff, enviá una invitación por e-mail y asignale el rol de "Recepcionista" o "Administrador".',
  },
];

const GuiaUsuario = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" });
  }, [hash]);

  return (
    <div className="guia-usuario">
      <Header />

      <section className="guia-usuario__hero">
        <img src={`${ICON_BASE}/guia-usuario.svg`} alt="" />
        <h1>Guía de usuario</h1>
        <p>
          Todo lo que necesitás saber sobre cómo funciona Syncro: primero un panorama general, y
          después el detalle según seas Jugador o Host.
        </p>
      </section>

      {/* ============ SECCIÓN 1: INTRO GENERAL ============ */}
      <section className="guia-usuario__intro">
        <div className="guia-usuario__list">
          {pasosIniciales.map((paso) => (
            <div className="guia-usuario__step" key={paso.titulo}>
              <img src={paso.icono} alt="" />
              <div>
                <h3>{paso.titulo}</h3>
                <p>{paso.texto}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="overview-roles">
          <div className="overview-role-card">
            <h3 className="overview-role-card__titulo">
              <img src={`${ICON_BASE}/pelota-header.svg`} alt="" />
              Como Jugador
            </h3>
            <ul>
              <li>Organizar partidos o sumarte a partidos abiertos</li>
              <li>Pagar tu parte del partido dividido entre todos</li>
              <li>Formar parte de hasta 3 equipos a la vez</li>
              <li>Subir de nivel con puntos, experiencia y ranking</li>
            </ul>
            <a className="overview-role-card__ir" href="#seccion-jugador">
              Ver todo lo que podés hacer como Jugador →
            </a>
          </div>
          <div className="overview-role-card">
            <h3 className="overview-role-card__titulo">
              <img src={`${ICON_BASE}/canchas.svg`} alt="" />
              Como Host
            </h3>
            <ul>
              <li>Publicar y gestionar las canchas de tu complejo</li>
              <li>Ver tu dashboard de ingresos y ocupación</li>
              <li>Definir precios por horario y habilitar modo competitivo</li>
              <li>Sumar staff con permisos y responder reseñas</li>
            </ul>
            <a className="overview-role-card__ir" href="#seccion-host">
              Ver todo lo que podés hacer como Host →
            </a>
          </div>
        </div>
      </section>

      <hr className="guia-usuario__divider" />

      {/* ============ SECCIÓN 2: JUGADOR — imagen a la derecha ============ */}
      <section className="rol-banner" id="seccion-jugador">
        <div className="rol-banner__texto">
          <span className="rol-banner__numero">2</span>
          <h2>Todo lo que podés hacer como Jugador</h2>
          <p>
            Desde organizar tu propio partido hasta sumarte a uno que ya existe — y un beneficio
            que no tiene ninguna otra app de reservas.
          </p>
          <div className="rol-banner__highlights">
            <div className="rol-banner__highlight">
              <img src={`${ICON_BASE}/positivo.svg`} alt="" />
              <span>
                <strong>El corazón de Syncro:</strong> si tu rival cancela, el sistema busca uno
                nuevo o te devuelve el pago en crédito — el partido nunca se pierde.
              </span>
            </div>
            <div className="rol-banner__highlight">
              <img src={`${ICON_BASE}/positivo.svg`} alt="" />
              <span>Pago dividido entre todos los jugadores, sin adelantar el total vos solo.</span>
            </div>
            <div className="rol-banner__highlight">
              <img src={`${ICON_BASE}/positivo.svg`} alt="" />
              <span>Progresión propia: puntos, experiencia y ranking en hasta 3 equipos.</span>
            </div>
          </div>
        </div>
        <div className="rol-banner__imagen">
          {/* TODO: reemplazar por <img src="..." alt="" /> cuando llegue la foto real */}
          <img src={`${ICON_BASE}/remera-local.svg`} alt="" className="rol-banner__imagen-placeholder-icon" />
          <span>Imagen placeholder — va una foto real de jugadores en cancha o de la app en uso</span>
        </div>
      </section>

      <section className="rol-contenido">
        <p className="rol-contenido__titulo">Beneficios y capacidades</p>
        <div className="beneficios">
          {beneficiosJugador.map((b) => (
            <div className="beneficio-card" key={b.titulo}>
              <img src={b.icono} alt="" />
              <h4>{b.titulo}</h4>
              <p>{b.texto}</p>
            </div>
          ))}
        </div>

        <p className="rol-contenido__titulo">Paso a paso: tu primer partido</p>
        <div className="pasos-grid">
          {pasosJugador.map((paso) => (
            <div className="pasos-grid__card" key={paso.titulo}>
              <img src={paso.icono} alt="" />
              <h4>{paso.titulo}</h4>
              <p>{paso.texto}</p>
            </div>
          ))}
        </div>

        <p className="rol-contenido__titulo">Preguntas frecuentes de jugadores</p>
        <div className="faq-lista">
          {faqJugador.map((f) => (
            <div className="faq-item" key={f.pregunta}>
              <div className="faq-item__pregunta">
                <span>{f.pregunta}</span>
                <span className="faq-item__flecha">▾</span>
              </div>
              <p className="faq-item__respuesta">{f.respuesta}</p>
            </div>
          ))}
        </div>

        <div className="faq-cta">
          <p>
            ¿Tenés otra duda como jugador? <strong>En el Centro de Ayuda vas a encontrar la respuesta.</strong>
          </p>
          <Link to="/centro-de-ayuda">Ir al Centro de Ayuda →</Link>
        </div>
      </section>

      <hr className="guia-usuario__divider" />

      {/* ============ SECCIÓN 3: HOST — imagen a la izquierda ============ */}
      <section className="rol-banner rol-banner--host" id="seccion-host">
        <div className="rol-banner__imagen">
          {/* TODO: reemplazar por <img src="..." alt="" /> cuando llegue la foto real */}
          <img src={`${ICON_BASE}/canchas.svg`} alt="" className="rol-banner__imagen-placeholder-icon" />
          <span>Imagen placeholder — va una foto real de un complejo o del panel de Host en uso</span>
        </div>
        <div className="rol-banner__texto">
          <span className="rol-banner__numero">3</span>
          <h2>Todo lo que podés hacer como Host</h2>
          <p>Administrá tu complejo, tus canchas y tu equipo de trabajo desde un solo panel.</p>
          <div className="rol-banner__highlights">
            <div className="rol-banner__highlight">
              <img src={`${ICON_BASE}/positivo.svg`} alt="" />
              <span>Dashboard de ingresos, reservas y ocupación de tus canchas por turno.</span>
            </div>
            <div className="rol-banner__highlight">
              <img src={`${ICON_BASE}/positivo.svg`} alt="" />
              <span>Precios propios por cancha y por horario, y modo competitivo cuando quieras habilitarlo.</span>
            </div>
            <div className="rol-banner__highlight">
              <img src={`${ICON_BASE}/positivo.svg`} alt="" />
              <span>Staff con permisos propios, reseñas de Google y resolución de disputas, todo desde el panel.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="rol-contenido">
        <p className="rol-contenido__titulo">Beneficios y capacidades</p>
        <div className="beneficios">
          {beneficiosHost.map((b) => (
            <div className="beneficio-card" key={b.titulo}>
              <img src={b.icono} alt="" />
              <h4>{b.titulo}</h4>
              <p>{b.texto}</p>
            </div>
          ))}
        </div>

        <p className="rol-contenido__titulo">Paso a paso: poné tu complejo en Syncro</p>
        <div className="pasos-grid">
          {pasosHost.map((paso) => (
            <div className="pasos-grid__card" key={paso.titulo}>
              <img src={paso.icono} alt="" />
              <h4>{paso.titulo}</h4>
              <p>{paso.texto}</p>
            </div>
          ))}
        </div>

        <p className="rol-contenido__titulo">Preguntas frecuentes de hosts</p>
        <div className="faq-lista">
          {faqHost.map((f) => (
            <div className="faq-item" key={f.pregunta}>
              <div className="faq-item__pregunta">
                <span>{f.pregunta}</span>
                <span className="faq-item__flecha">▾</span>
              </div>
              <p className="faq-item__respuesta">{f.respuesta}</p>
            </div>
          ))}
        </div>

        <div className="faq-cta">
          <p>
            ¿Tenés otra duda como host? <strong>En el Centro de Ayuda vas a encontrar la respuesta.</strong>
          </p>
          <Link to="/centro-de-ayuda">Ir al Centro de Ayuda →</Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GuiaUsuario;
