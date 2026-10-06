import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { VISTA_PREVIA } from "../../../config/vistaPrevia";
import { authService, rutaPorRol } from "../../../services/authService";
import AvisoMantenimiento from "./AvisoMantenimiento";
import BotonGoogle from "./BotonGoogle";
import CampoContrasena from "./CampoContrasena";
import { LockIcon, MailIcon } from "./icons";

// Formulario de inicio de sesion: no hace fetch propio, todo pasa por authService.ts
// Tiene dos modos: el normal (Google o correo y contraseña) y el de staff (solo un codigo).
const FormLogin = () => {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [recordar, setRecordar] = useState(false);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const [modoStaff, setModoStaff] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [errorStaff, setErrorStaff] = useState("");
  const [aviso, setAviso] = useState(false);

  const cambiarModo = (staff: boolean) => {
    setError("");
    setErrorStaff("");
    setModoStaff(staff);
  };

  const handleGoogleSuccess = async (credential: string) => {
    setError("");
    setEnviando(true);
    try {
      const { usuario } = await authService.loginConGoogle(credential);
      navigate(rutaPorRol(usuario.rol), { replace: true });
    } catch (fallo) {
      setError(fallo instanceof Error ? fallo.message : "No se pudo iniciar sesión con Google");
    } finally {
      setEnviando(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (VISTA_PREVIA) {
      setAviso(true);
      return;
    }
    setError("");
    setEnviando(true);

    try {
      const { usuario } = await authService.login({ email: correo, password: contrasena });
      // Con el rol que devolvio el backend se manda a la persona a su home
      navigate(rutaPorRol(usuario.rol), { replace: true });
    } catch (fallo) {
      // Si el backend responde error, el texto se muestra debajo del formulario
      setError(fallo instanceof Error ? fallo.message : "No se pudo iniciar sesión");
    } finally {
      setEnviando(false);
    }
  };

  const handleSubmitStaff = async (event: React.FormEvent) => {
    event.preventDefault();
    if (VISTA_PREVIA) {
      setAviso(true);
      return;
    }
    setErrorStaff("");
    setEnviando(true);

    try {
      const { usuario } = await authService.loginConCodigo(codigo);
      navigate(rutaPorRol(usuario.rol), { replace: true });
    } catch (fallo) {
      setErrorStaff(fallo instanceof Error ? fallo.message : "No se pudo ingresar con el código");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="auth-form">
      <h1 className="auth-form__title">{modoStaff ? "Acceso staff" : "Inicia sesión"}</h1>

      {/* Los dos formularios comparten lugar: al cambiar de modo se deslizan de derecha a izquierda */}
      <div className={`auth-staff ${modoStaff ? "is-staff" : ""}`}>
        <form
          className="auth-staff__panel auth-staff__panel--normal"
          onSubmit={handleSubmit}
          aria-hidden={modoStaff}
        >
          <div className="auth-social">
            <BotonGoogle
              onSuccess={handleGoogleSuccess}
              onError={(msg) => setError(msg)}
              disabled={enviando}
              onBloqueado={() => setAviso(true)}
            />
          </div>

          <div className="auth-divider">
            <span />
            <em>o</em>
            <span />
          </div>

          <p className="auth-form__subtitle">Ingresá tus datos</p>

          <label className="auth-input">
            <MailIcon />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={correo}
              onChange={(event) => setCorreo(event.target.value)}
              required
            />
          </label>

          <CampoContrasena placeholder="Contraseña" value={contrasena} onChange={setContrasena} />

          {/* Pendiente: este check todavia no cambia nada, la sesion siempre queda guardada */}
          <label className="auth-checkbox">
            <input type="checkbox" checked={recordar} onChange={(event) => setRecordar(event.target.checked)} />
            Mantener sesion iniciada
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-submit" disabled={enviando}>
            {enviando ? "Ingresando..." : "Iniciar sesion"}
          </button>

          <button type="button" className="auth-staff__link" onClick={() => cambiarModo(true)}>
            ¿Sos staff de un establecimiento?
          </button>
        </form>

        <form
          className="auth-staff__panel auth-staff__panel--staff"
          onSubmit={handleSubmitStaff}
          aria-hidden={!modoStaff}
        >
          <p className="auth-form__subtitle">Ingresá el código que te dio el establecimiento</p>

          <label className="auth-input">
            <LockIcon />
            <input
              className="auth-staff__codigo"
              type="text"
              placeholder="CÓDIGO"
              value={codigo}
              maxLength={20}
              autoComplete="off"
              spellCheck={false}
              onChange={(event) => setCodigo(event.target.value.toUpperCase())}
              aria-label="Código de acceso"
              required
            />
          </label>

          {errorStaff && <p className="auth-error">{errorStaff}</p>}

          <button type="submit" className="auth-submit" disabled={enviando || codigo.trim().length < 4}>
            {enviando ? "Ingresando..." : "Ingresar"}
          </button>

          <p className="auth-staff__ayuda">El staff no crea cuenta: entra solo con el código.</p>

          <button type="button" className="auth-staff__link auth-staff__link--volver" onClick={() => cambiarModo(false)}>
            ← Volver al inicio de sesión normal
          </button>
        </form>
      </div>

      {aviso && <AvisoMantenimiento onCerrar={() => setAviso(false)} />}
    </div>
  );
};

export default FormLogin;
