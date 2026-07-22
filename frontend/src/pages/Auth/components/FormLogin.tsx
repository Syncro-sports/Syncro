import { useState } from "react";
import { AppleIcon, FacebookIcon, GoogleIcon, LockIcon, MailIcon } from "./icons";

const FormLogin = () => {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [recordar, setRecordar] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
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

      <label className="auth-checkbox">
        <input type="checkbox" checked={recordar} onChange={(event) => setRecordar(event.target.checked)} />
        Mantener sesion iniciada
      </label>

      <button type="submit" className="auth-submit">
        Iniciar sesion
      </button>
    </form>
  );
};

export default FormLogin;
