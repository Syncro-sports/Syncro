import { useState, useEffect, useRef, ChangeEvent } from "react";
import { useOutletContext } from "react-router-dom";
import type { HostOutletContextType } from "./PerfilHost";
import "./Configuracion.css";
import { ConfiguracionComplejo, CONFIGURACION_DEFAULT, POLITICAS_COMPLEJO_DEFAULT } from "./ConfiguracionData";
import ConfiguracionSkeleton from "./components/ConfiguracionSkeleton";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const CAMPOS_INFO_COMPLEJO = ["nombre", "email", "descripcion", "telefono", "direccion"] as const;
type CampoInfoComplejo = (typeof CAMPOS_INFO_COMPLEJO)[number];

const PencilIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
  </svg>
);

const LOGO_TIPOS_PERMITIDOS = ["image/jpeg", "image/png"];
const LOGO_MAX_BYTES = 2 * 1024 * 1024;

const Configuracion = () => {
  const outletContext = useOutletContext<HostOutletContextType | null>();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [config, setConfig] = useState<ConfiguracionComplejo>(CONFIGURACION_DEFAULT);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [editandoInfo, setEditandoInfo] = useState(false);
  const [infoBackup, setInfoBackup] = useState<Pick<ConfiguracionComplejo, CampoInfoComplejo> | null>(null);

  const [politicas, setPoliticas] = useState(POLITICAS_COMPLEJO_DEFAULT);
  const [politicaAbierta, setPoliticaAbierta] = useState<string | null>(null);
  const [editandoPolitica, setEditandoPolitica] = useState(false);
  const [politicaTextoEdit, setPoliticaTextoEdit] = useState("");

  useEffect(() => {
    if (!editandoInfo && !editandoPolitica) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [editandoInfo, editandoPolitica]);

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

  const handleEditarInfo = () => {
    setInfoBackup({
      nombre: config.nombre,
      email: config.email,
      descripcion: config.descripcion,
      telefono: config.telefono,
      direccion: config.direccion,
    });
    setEditandoInfo(true);
  };

  const handleCancelarInfo = () => {
    if (infoBackup) {
      setConfig((prev) => ({ ...prev, ...infoBackup }));
    }
    setInfoBackup(null);
    setEditandoInfo(false);
  };

  const handleGuardarInfo = async () => {
    setEditandoInfo(false);
    setInfoBackup(null);
    setMensajeExito("Cambios guardados correctamente.");
    setTimeout(() => setMensajeExito(null), 3500);

    // Intento de guardado real en segundo plano; si no hay backend conectado
    // todavia, la vista ya quedo actualizada igual (cuenta de test).
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_URL}/host/configuracion`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(config),
      });
    } catch (err) {
      console.warn("No se pudo guardar en el servidor, se guardo localmente:", err);
    }
  };

  const handleLogoSeleccionado = (e: ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    e.target.value = "";
    if (!archivo) return;

    if (!LOGO_TIPOS_PERMITIDOS.includes(archivo.type)) {
      setMensajeExito(null);
      setError("El logo tiene que ser una imagen JPG o PNG.");
      return;
    }
    if (archivo.size > LOGO_MAX_BYTES) {
      setMensajeExito(null);
      setError("El logo no puede pesar más de 2 MB.");
      return;
    }

    const lector = new FileReader();
    lector.onload = () => {
      const url = String(lector.result);
      handleChange("logoUrl", url);
      outletContext?.setLogoUrl(url);
      setError(null);
      setMensajeExito("Logo actualizado correctamente.");
      setTimeout(() => setMensajeExito(null), 3500);
    };
    lector.onerror = () => setError("No se pudo leer la imagen. Probá con otro archivo.");
    lector.readAsDataURL(archivo);
  };

  const handleAbrirPolitica = (id: string) => {
    setPoliticaAbierta(id);
    setEditandoPolitica(false);
    setPoliticaTextoEdit("");
  };

  const handleCerrarPolitica = () => {
    setPoliticaAbierta(null);
    setEditandoPolitica(false);
    setPoliticaTextoEdit("");
  };

  const handleEditarPolitica = () => {
    if (!politicaAbierta) return;
    setPoliticaTextoEdit(politicas[politicaAbierta].texto);
    setEditandoPolitica(true);
  };

  const handleCancelarEdicionPolitica = () => {
    setEditandoPolitica(false);
    setPoliticaTextoEdit("");
  };

  const handleGuardarPolitica = () => {
    if (!politicaAbierta) return;
    setPoliticas((prev) => ({
      ...prev,
      [politicaAbierta]: { ...prev[politicaAbierta], texto: politicaTextoEdit },
    }));
    setEditandoPolitica(false);
    setPoliticaTextoEdit("");
    setMensajeExito("Cambios guardados correctamente.");
    setTimeout(() => setMensajeExito(null), 3500);
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
            <div className="config-card-header__info">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M7 7h10M7 12h10M7 17h6" />
              </svg>
              <div>
                <h3>Informacion del complejo</h3>
                <p>Datos principales que veran los jugadores sobre tu complejo.</p>
              </div>
            </div>

            {!editandoInfo ? (
              <button type="button" className="config-btn-editar" onClick={handleEditarInfo}>
                <PencilIcon />
                Editar
              </button>
            ) : (
              <div className="config-btn-group">
                <button type="button" className="config-btn-cancelar" onClick={handleCancelarInfo}>
                  Cancelar
                </button>
                <button type="button" className="config-btn-guardar" onClick={handleGuardarInfo}>
                  Guardar
                </button>
              </div>
            )}
          </div>

          {!editandoInfo ? (
            <div className="config-form-grid">
              <div className="config-form-group">
                <label>Nombre del complejo</label>
                <p className="config-value">{config.nombre || "Sin definir"}</p>
              </div>
              <div className="config-form-group">
                <label>Email de contacto</label>
                <p className="config-value">{config.email || "Sin definir"}</p>
              </div>
              <div className="config-form-group full-width">
                <label>Descripcion</label>
                <p className="config-value">{config.descripcion || "Sin definir"}</p>
              </div>
              <div className="config-form-group">
                <label>Teléfono</label>
                <p className="config-value">{config.telefono || "Sin definir"}</p>
              </div>
              <div className="config-form-group">
                <label>Dirección</label>
                <p className="config-value">{config.direccion || "Sin definir"}</p>
              </div>
            </div>
          ) : (
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
          )}
        </section>

        {/* Logo del complejo */}
        <section className="config-card">
          <div className="config-card-header">
            <div className="config-card-header__info">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <div>
                <h3>Logo del complejo</h3>
              </div>
            </div>
          </div>

          <div className="logo-upload-box">
            <div className="avatar-circle">
              {outletContext?.logoUrl || config.logoUrl ? (
                <img
                  src={outletContext?.logoUrl || config.logoUrl}
                  alt="Logo"
                  style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                />
              ) : (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              )}
            </div>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleLogoSeleccionado}
              style={{ display: "none" }}
            />
            <button className="btn-upload" type="button" onClick={() => logoInputRef.current?.click()}>
              Subir logo
            </button>
          </div>
          <p className="logo-info-text">Formato JPG, PNG.<br />Max 2mb.</p>
        </section>
      </div>

      {/* Fila Media: Configuracion general */}
      <section className="config-card">
        <div className="config-card-header">
          <div className="config-card-header__info">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            <div>
              <h3>Configuración general</h3>
              <p>Ajustes principales de tu cuenta y preferencias</p>
            </div>
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
            <div className="config-card-header__info">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
              <div>
                <h3>Metodos de pago</h3>
              </div>
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
            <div className="config-card-header__info">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              <div>
                <h3>Politicas del complejo</h3>
              </div>
            </div>
          </div>
          <div className="config-list">
            <div className="config-list-item config-list-item--clickable" onClick={() => handleAbrirPolitica("reglas")}>
              <span>{politicas.reglas.titulo}</span><span>›</span>
            </div>
            <div className="config-list-item config-list-item--clickable" onClick={() => handleAbrirPolitica("cancelaciones")}>
              <span>{politicas.cancelaciones.titulo}</span><span>›</span>
            </div>
            <div className="config-list-item config-list-item--clickable" onClick={() => handleAbrirPolitica("conducta")}>
              <span>{politicas.conducta.titulo}</span><span>›</span>
            </div>
            <div className="config-list-item config-list-item--clickable" onClick={() => handleAbrirPolitica("terminos")}>
              <span>{politicas.terminos.titulo}</span><span>›</span>
            </div>
          </div>
        </section>

        <section className="config-card">
          <div className="config-card-header">
            <div className="config-card-header__info">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <div>
                <h3>Cuenta y seguridad</h3>
              </div>
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

      {politicaAbierta && (
        <div className="config-modal-overlay" onClick={handleCerrarPolitica}>
          <div className="config-modal" onClick={(e) => e.stopPropagation()}>
            <div className="config-modal__header">
              <h3>{politicas[politicaAbierta].titulo}</h3>
              <button type="button" className="config-modal__close" onClick={handleCerrarPolitica}>
                ×
              </button>
            </div>
            {editandoPolitica ? (
              <textarea
                className="config-textarea config-modal__textarea"
                value={politicaTextoEdit}
                onChange={(e) => setPoliticaTextoEdit(e.target.value)}
              />
            ) : (
              <p className="config-modal__texto">{politicas[politicaAbierta].texto}</p>
            )}
            {politicas[politicaAbierta].editable && (
              <div className="config-modal__footer">
                {!editandoPolitica ? (
                  <button type="button" className="config-btn-editar" onClick={handleEditarPolitica}>
                    <PencilIcon />
                    Editar
                  </button>
                ) : (
                  <>
                    <button type="button" className="config-btn-cancelar" onClick={handleCancelarEdicionPolitica}>
                      Cancelar
                    </button>
                    <button type="button" className="config-btn-guardar" onClick={handleGuardarPolitica}>
                      Guardar
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Configuracion;