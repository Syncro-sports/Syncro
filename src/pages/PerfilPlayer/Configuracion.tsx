import { useEffect, useState } from "react";
import { apiClient } from "../../services/apiClient";
import { authService } from "../../services/authService";
import { PerfilConfig, CONFIG_MOCK } from "./ConfiguracionData";
import { calcularNivel, datosUsuario } from "./playerData";
import "./Configuracion.css";

type Pestana = "perfil" | "preferencias" | "cuenta";

const PESTANAS: Array<{ id: Pestana; label: string }> = [
  { id: "perfil", label: "Perfil" },
  { id: "preferencias", label: "Preferencias" },
  { id: "cuenta", label: "Cuenta y seguridad" },
];

const Configuracion = () => {
  const [config, setConfig] = useState<PerfilConfig | null>(null);
  const [cargando, setCargando] = useState(true);
  const [pestana, setPestana] = useState<Pestana>("perfil");

  useEffect(() => {
    const cargarConfiguracion = async () => {
      try {
        setCargando(true);
        const data = await apiClient.get<PerfilConfig>("/ruta-configuracion-jugador");
        setConfig(data);
      } catch (error) {
        console.warn("Backend no conectado aún. Usando datos locales de prueba.", error);

        setConfig(CONFIG_MOCK);
      } finally {
        setCargando(false);
      }
    };

    cargarConfiguracion();
  }, []);

  const handleChange = (campo: keyof PerfilConfig, valor: string) => {
    if (config) {
      setConfig({ ...config, [campo]: valor });
    }
  };

  if (cargando) {
    return (
      <div className="player-config__estado">
        <p style={{ color: "var(--player-green)" }}>Cargando configuración...</p>
      </div>
    );
  }

  if (!config) return <div className="player-config__estado"><p>Error al cargar la configuración.</p></div>;

  const usuario = authService.obtenerUsuario();
  const nombreMostrado = config.nombreCompleto || usuario?.nombre || `/${datosUsuario.usuario}`;
  const emailMostrado = config.email || usuario?.email || "";
  const { nivel } = calcularNivel(datosUsuario.expTotal);

  return (
    <div className="player-config">
      <aside className="player-card player-config__side">
        <div className="player-config__avatar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
        </div>
        <div className="player-config__nombre">{nombreMostrado}</div>
        {emailMostrado && <div className="player-config__mail">{emailMostrado}</div>}
        <span className="pj-pill pj-pill--ok">Nivel {nivel}</span>

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

        <button type="button" className="pj-btn pj-btn--outline pj-btn--sm" style={{ marginTop: "0.6rem" }}>
          Cambiar foto
        </button>
        <small>JPG, PNG. Máx. 2 MB.</small>
      </aside>

      <div className="player-config__main">
        <div className="pj-tabs">
          {PESTANAS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className={`player-config__tab ${pestana === id ? "is-active" : ""}`}
              onClick={() => setPestana(id)}
            >
              {label}
            </button>
          ))}
        </div>

        {pestana === "perfil" && (
          <section className="player-card player-config__form">
            <h3>Datos personales</h3>
            <div className="player-config__grid">
              <div className="input-group">
                <label htmlFor="cfg-nombre">Nombre completo</label>
                <input
                  id="cfg-nombre"
                  type="text"
                  placeholder="Tu nombre"
                  value={config.nombreCompleto}
                  onChange={(e) => handleChange("nombreCompleto", e.target.value)}
                />
              </div>
              <div className="input-group">
                <label htmlFor="cfg-email">Email</label>
                <input
                  id="cfg-email"
                  type="email"
                  placeholder="tu@email.com"
                  value={config.email}
                  disabled
                  title="El email no se puede cambiar"
                />
              </div>
              <div className="input-group">
                <label htmlFor="cfg-telefono">Teléfono</label>
                <input
                  id="cfg-telefono"
                  type="text"
                  placeholder="+54 11 1234-5678"
                  value={config.telefono}
                  onChange={(e) => handleChange("telefono", e.target.value)}
                />
              </div>
              <div className="input-group">
                <label htmlFor="cfg-nacimiento">Fecha de nacimiento</label>
                <input
                  id="cfg-nacimiento"
                  type="date"
                  value={config.fechaNacimiento}
                  onChange={(e) => handleChange("fechaNacimiento", e.target.value)}
                />
              </div>
              <div className="input-group">
                <label htmlFor="cfg-posicion">Posición preferida</label>
                <select id="cfg-posicion" value={config.posicion} onChange={(e) => handleChange("posicion", e.target.value)}>
                  <option value="Delantero">Delantero</option>
                  <option value="Medio">Medio</option>
                  <option value="Defensa">Defensa</option>
                  <option value="Arquero">Arquero</option>
                </select>
              </div>
              <div className="input-group">
                <label htmlFor="cfg-nivel">Nivel de habilidad</label>
                <select id="cfg-nivel" value={config.nivel} onChange={(e) => handleChange("nivel", e.target.value)}>
                  <option value="Principiante">Principiante</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado</option>
                </select>
              </div>
            </div>
            <div className="player-config__foot">
              <button type="button" className="pj-btn pj-btn--ghost pj-btn--md">
                Cancelar
              </button>
              <button type="button" className="pj-btn pj-btn--primary pj-btn--md">
                Guardar cambios
              </button>
            </div>
          </section>
        )}

        {pestana === "preferencias" && (
          <div className="player-config__duo">
            <section className="player-card player-config__form">
              <h3>Regional y formato</h3>
              <div className="player-config__grid player-config__grid--una">
                <div className="input-group">
                  <label htmlFor="cfg-zona">Zona horaria</label>
                  <select id="cfg-zona" value={config.zonaHoraria} onChange={(e) => handleChange("zonaHoraria", e.target.value)}>
                    <option value="BA">(GMT-03:00) Buenos Aires</option>
                  </select>
                </div>
                <div className="input-group">
                  <label htmlFor="cfg-moneda">Moneda</label>
                  <select id="cfg-moneda" value={config.moneda} onChange={(e) => handleChange("moneda", e.target.value)}>
                    <option value="ARS">Peso Argentino (ARS)</option>
                  </select>
                </div>
                <div className="input-group">
                  <label htmlFor="cfg-idioma">Idioma</label>
                  <select id="cfg-idioma" value={config.idioma} onChange={(e) => handleChange("idioma", e.target.value)}>
                    <option value="ES">Español</option>
                    <option value="EN">Inglés</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Formato de hora</label>
                  <div className="radio-group">
                    <label>
                      <input
                        type="radio"
                        name="hora"
                        checked={config.formatoHora === "24h"}
                        onChange={() => handleChange("formatoHora", "24h")}
                      />{" "}
                      24 horas
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="hora"
                        checked={config.formatoHora === "12h"}
                        onChange={() => handleChange("formatoHora", "12h")}
                      />{" "}
                      12 horas
                    </label>
                  </div>
                </div>
              </div>
              <div className="player-config__foot player-config__foot--abajo">
                <button type="button" className="pj-btn pj-btn--primary pj-btn--md">
                  Guardar cambios
                </button>
              </div>
            </section>

            <section className="player-card player-config__form">
              <h3>Métodos de pago</h3>
              <div className="player-config__lista">
                <div className="player-config__item">
                  <div>
                    <span className="player-config__item-titulo">Mercado Pago</span>
                    <small>Para pagar tus cuotas y reservas</small>
                  </div>
                  <span className="pj-pill pj-pill--ok">Activo</span>
                </div>
                <div className="player-config__item">
                  <div>
                    <span className="player-config__item-titulo">Agregar tarjeta</span>
                    <small>Pagá más rápido en tus próximos partidos</small>
                  </div>
                  <span className="pj-pill">Próximamente</span>
                </div>
              </div>
            </section>
          </div>
        )}

        {pestana === "cuenta" && (
          <div className="player-config__duo">
            <section className="player-card player-config__form">
              <h3>Seguridad</h3>
              <div className="player-config__lista">
                <button type="button" className="player-config__item">
                  <span className="player-config__item-titulo">Cambiar contraseña</span>
                  <span className="player-config__chev">›</span>
                </button>
                <button type="button" className="player-config__item">
                  <div>
                    <span className="player-config__item-titulo">Autenticación en 2 pasos</span>
                    <small>Sumá una capa extra de seguridad</small>
                  </div>
                  <span className="pj-pill">Desactivada</span>
                </button>
                <button type="button" className="player-config__item player-config__item--peligro">
                  <div>
                    <span className="player-config__item-titulo">Eliminar cuenta</span>
                    <small>Esta acción no se puede deshacer</small>
                  </div>
                  <span className="player-config__chev">›</span>
                </button>
              </div>
            </section>

            <section className="player-card player-config__form">
              <h3>Legal</h3>
              <div className="player-config__lista">
                <button type="button" className="player-config__item">
                  <span className="player-config__item-titulo">Reglas de la plataforma</span>
                  <span className="player-config__chev">›</span>
                </button>
                <button type="button" className="player-config__item">
                  <span className="player-config__item-titulo">Política de reembolsos</span>
                  <span className="player-config__chev">›</span>
                </button>
                <button type="button" className="player-config__item">
                  <span className="player-config__item-titulo">Términos de servicio</span>
                  <span className="player-config__chev">›</span>
                </button>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default Configuracion;
