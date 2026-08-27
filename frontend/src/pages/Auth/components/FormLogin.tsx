import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService, rutaPorRol } from "../../../services/authService";
import { AppleIcon, FacebookIcon, GoogleIcon, LockIcon, MailIcon } from "./icons";

// Formulario de inicio de sesion: no hace fetch propio, todo pasa por authService.ts
const FormLogin = () => {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [recordar, setRecordar] = useState(false);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
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

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h1 className="auth-form__title">Inicia sesión</h1>

      <div className="auth-social">
        <button type="button" aria-label="Continuar con Google">
          <GoogleIcon />
        </button>
        <button type="button" aria-label="Continuar con Apple">
          <AppleIcon />
        </button>
        <button type="button" aria-label="Continuar con Facebook">
          <FacebookIcon />
        </button>
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

      <label className="auth-input">
        <LockIcon />
        <input
          type="password"
          placeholder="Contraseña"
          value={contrasena}
          onChange={(event) => setContrasena(event.target.value)}
          required
        />
      </label>

      {/* Pendiente: este check todavia no cambia nada, la sesion siempre queda guardada */}
      <label className="auth-checkbox">
        <input type="checkbox" checked={recordar} onChange={(event) => setRecordar(event.target.checked)} />
        Mantener sesion iniciada
      </label>

      {error && <p className="auth-error">{error}</p>}

      <button type="submit" className="auth-submit" disabled={enviando}>
        {enviando ? "Ingresando..." : "Iniciar sesion"}
      </button>
    </form>
  );
};

export default FormLogin;
