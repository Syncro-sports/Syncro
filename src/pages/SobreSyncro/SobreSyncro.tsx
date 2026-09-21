import React, { useState } from 'react';
import './SobreSyncro.css';
import heroBg from './Componentes/cancha_fondo.png';
import cleatsImg from './Componentes/botines.png';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const TarjetaLegal = ({
  titulo,
  textoCorto,
  textoExtra,
}: {
  titulo: string;
  textoCorto: string;
  textoExtra: string;
}) => {
  const [expandido, setExpandido] = useState(false);

  return (
    <div className="legal-item">
      <h4 className="text-lime">{titulo}</h4>
      <p>{textoCorto}</p>
      {expandido && <p className="legal-item__extra">{textoExtra}</p>}
      <button className="btn-link" onClick={() => setExpandido(!expandido)}>
        {expandido ? 'Ocultar <' : 'Leer más >'}
      </button>
    </div>
  );
};

const SobreSyncro = () => {
  return (
    <>
      <Header />

      <div className="sobre-syncro">
        <section
          className="sobre-hero"
          style={{ backgroundImage: `linear-gradient(to bottom, rgba(5,7,11,0.6), rgba(5,7,11,1)), url("${heroBg}")` }}
        >
          <div className="sobre-hero__content">
            <h1>SOBRE <span className="text-lime">SYNCRO</span></h1>
            <h2>REDES QUE CONECTAN PASIONES.</h2>
            <p>
              Nuestra misión es eliminar las barreras entre los jugadores y el juego,
              creando un ecosistema digital donde la pasión por el deporte nunca se detiene.
            </p>
          </div>
        </section>

        <section className="sobre-section quienes-somos">
          <div className="quienes-somos__text">
            <h3>¿Quiénes Somos?</h3>
            <p className="desc">
              Syncro nació de una necesidad simple: la frustración de querer jugar y no encontrar
              equipo, o de tener un equipo pero no encontrar cancha. Somos un equipo de
              deportistas y tecnólogos dedicados a digitalizar la experiencia del fútbol amateur.
            </p>
            <div className="quienes-somos__cards">
              <div className="info-card">
                <h4 className="text-lime">Misión</h4>
                <p>Conectar a la comunidad deportiva global a través de herramientas tecnológicas eficientes que fomenten el encuentro y la competencia sana.</p>
              </div>
              <div className="info-card">
                <h4 className="text-lime">Visión</h4>
                <p>Ser la plataforma líder mundial en gestión de encuentros deportivos, reconocida por su facilidad de uso y compromiso con el desarrollo del deporte base.</p>
              </div>
            </div>
          </div>
          <div className="quienes-somos__image">
            <img src={cleatsImg} alt="Jugador de fútbol pisando la cancha" />
          </div>
        </section>

        <section className="sobre-section nuestro-equipo">
          <div className="section-header text-center">
            <h3>Nuestro Equipo</h3>
            <p>Impulsando la innovación en el deporte amateur</p>
          </div>
          <div className="equipo-grid">
            <div className="equipo-item">
              <div className="icon-circle">{/*odio vectorizar TT   */}</div>
              <h4>Innovación</h4>
              <p>Siempre buscando la mejor tecnología para tu juego</p>
            </div>
            <div className="equipo-item">
              <div className="icon-circle">{/*odio vectorizar TT x2 */}</div>
              <h4>Comunidad</h4>
              <p>Poniendo a los jugadores y la plataforma en el centro</p>
            </div>
            <div className="equipo-item">
              <div className="icon-circle">{/*odio vectorizar TT x3 */}</div>
              <h4>Transparencia</h4>
              <p>Procesos claros en reservas y pagos</p>
            </div>
            <div className="equipo-item">
              <div className="icon-circle">{/*odio vectorizar TT x4*/}</div>
              <h4>Pasión</h4>
              <p>Amamos el deporte tanto como vos</p>
            </div>
          </div>
        </section>

        <hr className="divider" />

        <section className="sobre-section info-legal">
          <h3>Información Legal</h3>
          <div className="legal-grid">
            <TarjetaLegal
              titulo="Términos y Condiciones"
              textoCorto="Reglas fundamentales sobre el uso de la plataforma, responsabilidades del usuario y gestión de reservas."
              textoExtra="Acá va el texto completo de tus Términos y Condiciones. Reemplazá este placeholder con el contenido real que quieras mostrar al expandir."
            />
            <TarjetaLegal
              titulo="Uso de Cookies"
              textoCorto="Información técnica sobre las cookies que utilizamos para mantener tu sesión activa y analizar el rendimiento."
              textoExtra="Acá va el detalle completo sobre el uso de cookies: qué tipos usás (sesión, analíticas, terceros) y cómo el usuario puede gestionarlas."
            />
            <TarjetaLegal
              titulo="Política de Privacidad"
              textoCorto="Detalles sobre cómo protegemos tus datos personales y qué información recolectamos para mejorar tu experiencia."
              textoExtra="Acá va el texto completo de tu Política de Privacidad: qué datos se recolectan, con qué fines, y los derechos del usuario sobre ellos."
            />
            <TarjetaLegal
              titulo="Aviso Legal"
              textoCorto="Identificación oficial de la empresa, datos registrales y propiedad intelectual del contenido de Syncro."
              textoExtra="Acá va el Aviso Legal completo: razón social, CUIT/datos registrales, y notas sobre la propiedad intelectual del contenido de Syncro."
            />
          </div>
        </section>

        <hr className="divider" />

        <section className="sobre-section ayuda-contacto">
          <div className="ayuda-text">
            <h3 className="text-lime">¿Necesitás ayuda?</h3>
            <p>Nuestro equipo de soporte está disponible para resolver cualquier duda o inconveniente que tengas.</p>
          </div>
          <div className="ayuda-cards">
            <div className="contact-box">
              <span className="icon text-lime">{/*odio vectorizar TT x5 */}</span>
              <div>
                <span className="label">EMAIL</span>
                <p>syncrosports5@gmail.com</p>
              </div>
            </div>
            <div className="contact-box">
              <span className="icon text-lime">{/*odio vectorizar TT x6 */}</span>
              <div>
                <span className="label">TELÉFONO</span>
                <p>+54 11 1234-5678</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default SobreSyncro;