import { useEffect, useState } from "react";
import { apiClient } from "../../services/apiClient";
import { PerfilConfig, CONFIG_MOCK } from "./ConfiguracionData";
import "./Configuracion.css";

const Configuracion = () => {
  const [config, setConfig] = useState<PerfilConfig | null>(null);
  const [cargando, setCargando] = useState(true);

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
      <div className="player-config">
        <p style={{ color: "var(--lime)" }}>Cargando configuración...</p>
      </div>
    );
  }

  if (!config) return <div className="player-config"><p>Error al cargar la configuración.</p></div>;

  return (
    <div className="player-config">
      <header className="player-config__header">
        <h1>Configuración</h1>
      </header>

      <div className="player-config__grid">

        <section className="player-config__card card-datos">
          <div className="card-header">
            <h3>Datos personales</h3>
            <p>Información de tu perfil de jugador.</p>
          </div>
          <div className="card-body form-grid">
            <div className="input-group">
              <label>Nombre completo</label>
              <input 
                type="text" 
                placeholder="Flor"
                value={config.nombreCompleto} 
                onChange={(e) => handleChange("nombreCompleto", e.target.value)} 
              />
            </div>
            <div className="input-group">
              <label>Email</label>
              <input 
                type="email" 
                placeholder="Flor@syncro.com"
                value={config.email} 
                disabled 
                title="El email no se puede cambiar"
              />
            </div>
            <div className="input-group">
              <label>Teléfono</label>
              <input 
                type="text" 
                placeholder="+54 11 1234-5678"
                value={config.telefono} 
                onChange={(e) => handleChange("telefono", e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Fecha de nacimiento</label>
              <input 
                type="date" 
                value={config.fechaNacimiento} 
                onChange={(e) => handleChange("fechaNacimiento", e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Posición preferida</label>
              <select 
                value={config.posicion} 
                onChange={(e) => handleChange("posicion", e.target.value)}
              >
                <option value="Delantero">Delantero</option>
                <option value="Medio">Medio</option>
                <option value="Defensa">Defensa</option>
                <option value="Arquero">Arquero</option>
              </select>
            </div>
            <div className="input-group">
              <label>Nivel de habilidad</label>
              <select 
                value={config.nivel} 
                onChange={(e) => handleChange("nivel", e.target.value)}
              >
                <option value="Principiante">Principiante</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzado">Avanzado</option>
              </select>
            </div>
          </div>
        </section>

        <section className="player-config__card card-foto">
          <div className="card-header">
            <h3>Foto de perfil</h3>
          </div>
          <div className="card-body foto-body">
            <div className="foto-avatar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
            </div>
            <div className="foto-actions">
              <button className="btn-upload">Subir foto</button>
              <p>Formato JPG, PNG. Max 2mb.</p>
            </div>
          </div>
        </section>

        <section className="player-config__card card-general full-width">
          <div className="card-header">
            <h3>Configuración general</h3>
            <p>Preferencias de cuenta y notificaciones.</p>
          </div>
          <div className="card-body form-grid grid-3">
            <div className="input-group">
              <label>Zona horaria</label>
              <select value={config.zonaHoraria} onChange={(e) => handleChange("zonaHoraria", e.target.value)}>
                <option value="BA">(GMT-03:00) Buenos Aires</option>
              </select>
            </div>
            <div className="input-group">
              <label>Moneda</label>
              <select value={config.moneda} onChange={(e) => handleChange("moneda", e.target.value)}>
                <option value="ARS">Peso Argentino (ARS)</option>
              </select>
            </div>
            <div className="input-group">
              <label>Idioma</label>
              <select value={config.idioma} onChange={(e) => handleChange("idioma", e.target.value)}>
                <option value="ES">Español</option>
                <option value="EN">Inglés</option>
              </select>
            </div>
            <div className="input-group formato-hora">
              <label>Formato de hora</label>
              <div className="radio-group">
                <label>
                  <input 
                    type="radio" 
                    name="hora" 
                    checked={config.formatoHora === "24h"}
                    onChange={() => handleChange("formatoHora", "24h")}
                  /> 24 Horas
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="hora" 
                    checked={config.formatoHora === "12h"}
                    onChange={() => handleChange("formatoHora", "12h")}
                  /> 12 Horas
                </label>
              </div>
            </div>
          </div>
        </section>

        <section className="player-config__card card-pagos">
          <div className="card-header">
            <h3>Métodos de pago</h3>
          </div>
          <div className="card-body">
            <div className="metodo-item">
              <span>MercadoPago</span>
              <span className="badge-activo">Activo</span>
            </div>
            <div className="metodo-item disabled">
              <button className="btn-add-card">+ Agregar tarjeta</button>
              <span className="text-muted">Próximamente</span>
            </div>
          </div>
        </section>

        <section className="player-config__card card-privacidad">
          <div className="card-header">
            <h3>Términos y Privacidad</h3>
          </div>
          <div className="card-body list-menu">
            <button>Reglas de la plataforma <span>{'>'}</span></button>
            <button>Política de reembolsos <span>{'>'}</span></button>
            <button>Términos de servicio <span>{'>'}</span></button>
          </div>
        </section>

        <section className="player-config__card card-seguridad">
          <div className="card-header">
            <h3>Cuenta y seguridad</h3>
          </div>
          <div className="card-body list-menu">
            <button>Cambiar contraseña <span>{'>'}</span></button>
            <button>Autenticación <span>{'>'}</span></button>
            <button className="text-danger">Eliminar cuenta <span>{'>'}</span></button>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Configuracion;