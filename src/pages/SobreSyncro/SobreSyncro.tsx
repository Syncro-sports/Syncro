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
              Syncro es una plataforma deportiva pensada para el fútbol, nacida como proyecto dentro de Fundación Pescar. Nuestra misión es conectar tres puntas en un solo ecosistema digital: jugadores que quieren jugar, equipos que buscan rival y complejos que ofrecen sus canchas.</p>
            
            <div className="quienes-somos__cards">
              <div className="info-card">
                <h4 className="text-lime">Problema</h4>
                <p>Coordinar un partido es complejo: suelen faltar jugadores o rivales, cuesta conseguir cancha, juntar el pago es un caos y el historial deportivo termina perdiéndose.</p>
              </div>
              <div className="info-card">
                <h4 className="text-lime">Solución</h4>
                <p>Centralizar toda la organización en una sola app. Syncro busca reemplazos automáticos si alguien se baja, gestiona el pago dividido por adelantado y guarda todas tus estadísticas.</p>
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
          <h3>¿Quiénes usan Syncro?</h3>
          <div className="legal-grid">
            <TarjetaLegal
              titulo="Jugadores"
              textoCorto="Son quienes usan Syncro para organizar y participar de partidos, formar parte de equipos, buscar jugadores y llevar su historial deportivo."
              textoExtra="Al registrarse, eligen la cuenta de tipo Jugador."
            />
            <TarjetaLegal
              titulo="Complejos deportivos (Host)"
              textoCorto="Son los establecimientos que ofrecen canchas para jugar."
              textoExtra="Quien administra un complejo se registra con una cuenta de tipo Host, y tiene un panel propio para gestionar sus reservas, sus canchas, la caja de su negocio, sus estadísticas, su staff y las valoraciones que recibe."
            />
            <TarjetaLegal
              titulo="Equipo de Syncro"
              textoCorto="Además de Jugador y Host, existe un tercer tipo de cuenta interno, pensado para las personas que forman parte del equipo que desarrolla y mantiene Syncro."
              textoExtra="No es un tipo de cuenta que se elija al registrarse desde la app: es de uso interno."
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