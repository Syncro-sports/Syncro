import { useState, useEffect } from "react";
import "./Configuracion.css";
import { ConfiguracionComplejo, CONFIGURACION_DEFAULT } from "./configuracionData";
import ConfiguracionSkeleton from "./components/ConfiguracionSkeleton";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const Configuracion = () => {
  const [config, setConfig] = useState<ConfiguracionComplejo>(CONFIGURACION_DEFAULT);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/host/configuracion`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });

        if (!res.ok) {
          throw new Error("No se pudo obtener la configuración");
        }

        const data = await res.json();
        setConfig(data);
      } catch (err) {
        console.warn("Usando configuración por defecto:", err);
        // Inicializado vacío para que se vean los placeholders sutiles
        setConfig(CONFIGURACION_DEFAULT);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const handleChange = (field: keyof ConfiguracionComplejo, value: any) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleGuardar = async () => {
    try {
      setSaving(true);
      setError(null);
      setMensajeExito(null);
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/host/configuracion`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(config)
      });

      if (!res.ok) throw new Error("Error al guardar cambios");

      setMensajeExito("Cambios guardados correctamente.");
      setTimeout(() => setMensajeExito(null), 3500);
    } catch (err: any) {
      setError(err.message || "Error al conectar con el servidor.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <ConfiguracionSkeleton />;
  }

  return (
    <div className="configuracion-container">
      {error && <div className="config-alert error">{error}</div>}
      {mensajeExito && <div className="config-alert success">{mensajeExito}</div>}

      {/* Fila Superior */}
      <div className="configuracion-grid-top">
        {/* Informacion del complejo */}
        <section className="config-card">
          <div className="config-card-header">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M7 7h10M7 12h10M7 17h6" />
            </svg>
            <div>
              <h3>Informacion del complejo</h3>
              <p>Datos principales que veran los jugadores sobre tu complejo.</p>
            </div>
          </div>

          <div className="config-form-grid">
            <div className="config-form-group">
              <label>Nombre del complejo</label>
              <input
                className="config-input"
                type="text"
                placeholder="Ej. Complejo los pibes"
                value={config.nombre}
                onChange={(e) => handleChange("nombre", e.target.value)}
              />
            </div>
            <div className="config-form-group">
              <label>Email de contacto</label>
              <input
                className="config-input"
                type="email"
                placeholder="contacto@lospibes.com"
                value={config.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>
            <div className="config-form-group full-width">
              <label>Descripcion</label>
              <textarea
                className="config-textarea"
                placeholder="Complejo deportivo con 4 canchas de futbol 5, vestuarios, estacionamiento y cantina. El mejor lugar para jugar con amigos"
                value={config.descripcion}
                onChange={(e) => handleChange("descripcion", e.target.value)}
              />
            </div>
            <div className="config-form-group">
              <label>Teléfono</label>
              <input
                className="config-input"
                type="text"
                placeholder="+54 11 1234-5678"
                value={config.telefono}
                onChange={(e) => handleChange("telefono", e.target.value)}
              />
            </div>
            <div className="config-form-group">
              <label>Dirección</label>
              <input
                className="config-input"
                type="text"
                placeholder="Av. Siempre Viva 1234, CABA"
                value={config.direccion}
                onChange={(e) => handleChange("direccion", e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Logo del complejo */}
        <section className="config-card">
          <div className="config-card-header">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <div>
              <h3>Logo del complejo</h3>
            </div>
          </div>

          <div className="logo-upload-box">
            <div className="avatar-circle">
              {config.logoUrl ? (
                <img src={config.logoUrl} alt="Logo" style={{ width: "100%", height: "100%", borderRadius: "50%" }} />
              ) : (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              )}
            </div>
            <button className="btn-upload" type="button">Subir logo</button>
          </div>
          <p className="logo-info-text">Formato JPG, PNG.<br />Max 2mb.</p>
        </section>
      </div>

      {/* Fila Media: Configuracion general */}
      <section className="config-card">
        <div className="config-card-header">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          <div>
            <h3>Configuración general</h3>
            <p>Ajustes principales de tu cuenta y preferencias</p>
          </div>
        </div>

        <div className="config-form-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
          <div className="config-form-group">
            <label>Zona horaria</label>
            <select
              className="config-select"
              value={config.zonaHoraria}
              onChange={(e) => handleChange("zonaHoraria", e.target.value)}
            >
              <option>(GTM-03:00) Buenos Aires</option>
            </select>
          </div>
          <div className="config-form-group">
            <label>Moneda</label>
            <select
              className="config-select"
              value={config.moneda}
              onChange={(e) => handleChange("moneda", e.target.value)}
            >
              <option>Peso Argentino (ARS)</option>
              <option>Dólar (USD)</option>
            </select>
          </div>
          <div className="config-form-group">
            <label>Idioma</label>
            <select
              className="config-select"
              value={config.idioma}
              onChange={(e) => handleChange("idioma", e.target.value)}
            >
              <option>Español</option>
              <option>Inglés</option>
            </select>
          </div>
          <div className="config-form-group">
            <label>Formato de hora</label>
            <div className="config-radio-group">
              <label className="config-radio-option">
                <input
                  type="radio"
                  name="formatoHora"
                  value="24"
                  checked={config.formatoHora === "24"}
                  onChange={() => handleChange("formatoHora", "24")}
                />
                24 Horas
              </label>
              <label className="config-radio-option">
                <input
                  type="radio"
                  name="formatoHora"
                  value="12"
                  checked={config.formatoHora === "12"}
                  onChange={() => handleChange("formatoHora", "12")}
                />
                12 Horas
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* Fila Inferior: 3 Columnas */}
      <div className="configuracion-grid-bottom">
        <section className="config-card">
          <div className="config-card-header">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
            <div>
              <h3>Metodos de pago</h3>
            </div>
          </div>
          <div className="config-list">
            {config.metodosPago.map((metodo) => (
              <div key={metodo.id} className="config-list-item">
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span>{metodo.nombre}</span>
                </div>
                {metodo.activo && <span className="badge-active">Activo</span>}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "auto" }}>
            <button className="btn-add-method" type="button">+ Agregar método de pago</button>
            <span className="badge-soon">Próximamente</span>
          </div>
        </section>

        <section className="config-card">
          <div className="config-card-header">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            <div>
              <h3>Politicas del complejo</h3>
            </div>
          </div>
          <div className="config-list">
            <div className="config-list-item"><span>Reglas de las canchas</span><span>›</span></div>
            <div className="config-list-item"><span>Política de cancelaciones</span><span>›</span></div>
            <div className="config-list-item"><span>Código de conducta</span><span>›</span></div>
            <div className="config-list-item"><span>Términos y condiciones</span><span>›</span></div>
          </div>
        </section>

        <section className="config-card">
          <div className="config-card-header">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <div>
              <h3>Cuenta y seguridad</h3>
            </div>
          </div>
          <div className="config-list">
            <div className="config-list-item"><span>Cambiar contraseña</span><span>›</span></div>
            <div className="config-list-item"><span>Autenticacion en dos pasos</span><span>›</span></div>
            <div className="config-list-item"><span>Dispositivos conectados</span><span>›</span></div>
            <div className="config-list-item"><span>Cerrar sesión en todos los dispositivos</span><span>›</span></div>
          </div>
        </section>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          className="btn-upload"
          style={{ background: "#a3e635", color: "#000", fontWeight: "bold" }}
          onClick={handleGuardar}
          disabled={saving}
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
};

export default Configuracion;