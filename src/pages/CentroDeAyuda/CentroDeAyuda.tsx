import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { FAQS_RAPIDAS, CATEGORIAS } from "./centroAyudaData";
import "./CentroDeAyuda.css";

const ICON_BASE = `${import.meta.env.BASE_URL}assets/icons`;

const CentroDeAyuda: React.FC = () => {
  const [busqueda, setBusqueda] = useState("");
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [faqSeleccionada, setFaqSeleccionada] = useState<number | null>(null);
  const searchWrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(event.target as Node)
      ) {
        setMostrarDropdown(false);
        setFaqSeleccionada(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const faqsFiltradas = FAQS_RAPIDAS.filter(
    (faq) =>
      faq.pregunta.toLowerCase().includes(busqueda.toLowerCase()) ||
      faq.respuesta.toLowerCase().includes(busqueda.toLowerCase()),
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setBusqueda(valor);

    if (valor.trim().length > 0) {
      setMostrarDropdown(true);
    } else {
      setMostrarDropdown(false);
    }
  };

  const irAlChatbot = () => {
    alert("Proximamente el chatbot");
  };

  return (
    <div className="ayuda-page">
      <Header />

      <main className="ayuda-container">
        <section className="ayuda-hero">
          <div className="ayuda-hero__content">
            <h1 className="ayuda-hero__title">¿En qué podemos ayudarte?</h1>
            <p className="ayuda-hero__subtitle">
              Buscá respuestas, explorá guías o contactá a nuestro equipo.
            </p>
            <div className="ayuda-search-wrapper" ref={searchWrapperRef}>
              <div className="ayuda-hero__search">
                <input
                  type="text"
                  className="ayuda-hero__input"
                  placeholder="Buscar en el centro de ayuda..."
                  value={busqueda}
                  onChange={handleInputChange}
                />
                <img
                  src={`${ICON_BASE}/lupa.svg`}
                  alt="Buscar"
                  className="ayuda-hero__search-icon"
                />
              </div>
              {mostrarDropdown && busqueda.trim().length > 0 && (
                <div className="ayuda-dropdown">
                  <div className="ayuda-dropdown__header">
                    PREGUNTAS FRECUENTES RÁPIDAS
                  </div>
                  {faqsFiltradas.length > 0 ? (
                    <ul className="ayuda-dropdown__list">
                      {faqsFiltradas.map((faq) => (
                        <li key={faq.id} className="ayuda-dropdown__item">
                          <button
                            type="button"
                            className="ayuda-dropdown__question-btn"
                            onClick={() =>
                              setFaqSeleccionada(
                                faqSeleccionada === faq.id ? null : faq.id,
                              )
                            }
                          >
                            <span>{faq.pregunta}</span>
                            <span className="ayuda-dropdown__arrow">
                              {faqSeleccionada === faq.id ? "▲" : "▼"}
                            </span>
                          </button>
                          {faqSeleccionada === faq.id && (
                            <p className="ayuda-dropdown__answer">
                              {faq.respuesta}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="ayuda-dropdown__empty">
                      No encontramos preguntas para esa búsqueda. Podés
                      consultar al Asistente Virtual.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="ayuda-hero__illustration">
            <img
              src={`${ICON_BASE}/customer-service.svg`}
              alt="Soporte"
              className="ayuda-hero__headset-img"
            />
          </div>
        </section>

        <section className="ayuda-section">
          <h2 className="ayuda-section__title">Explorá nuestras categorías</h2>
          <div className="ayuda-grid">
            {CATEGORIAS.map((cat) => (
              <div key={cat.id} className="PlayerCard ayuda-card">
                <img src={cat.icono} alt="" className="ayuda-card__icon" />
                <h3 className="ayuda-card__title">{cat.titulo}</h3>
                <p className="ayuda-card__desc">{cat.descripcion}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="PlayerCard ayuda-soporte">
          <div className="ayuda-soporte__header">
            <h2 className="ayuda-soporte__title">
              ¿No encontrás lo que buscás?
            </h2>
            <p className="ayuda-soporte__subtitle">
              Elegí la opción de soporte que prefieras para resolver tus dudas.
            </p>
          </div>

          <div className="ayuda-soporte__grid">
            <div className="ayuda-soporte__option">
              <img
                src={`${ICON_BASE}/help2.svg`}
                alt=""
                className="ayuda-soporte__option-icon"
              />
              <div className="ayuda-soporte__option-content">
                <h4 className="ayuda-soporte__option-title">
                  Preguntas frecuentes
                </h4>
                <p className="ayuda-soporte__option-desc">
                  Respondemos tus dudas sobre pagos, reservas y cuentas.
                </p>
              </div>
            </div>

            <div className="ayuda-soporte__option">
              <img
                src={`${ICON_BASE}/email.svg`}
                alt=""
                className="ayuda-soporte__option-icon"
              />
              <div className="ayuda-soporte__option-content">
                <h4 className="ayuda-soporte__option-title">
                  Enviar un mensaje
                </h4>
                <p className="ayuda-soporte__option-desc">
                  Te respondemos por email en menos de 24hs.
                </p>
              </div>
            </div>

            <div className="ayuda-soporte__option ayuda-soporte__option--chatbot">
              <img
                src={`${ICON_BASE}/chatbot.svg`}
                alt=""
                className="ayuda-soporte__option-icon"
              />
              <div className="ayuda-soporte__option-content">
                <h4 className="ayuda-soporte__option-title">
                  Asistente Virtual
                </h4>
                <p className="ayuda-soporte__option-desc">
                  Chateá con nuestro chatbot para ayuda inmediata.
                </p>
                <button
                  type="button"
                  className="ayuda-soporte__btn-chat"
                  onClick={irAlChatbot}
                >
                  Ir al Chatbot
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CentroDeAyuda;
