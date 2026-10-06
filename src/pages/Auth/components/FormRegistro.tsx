import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { VISTA_PREVIA } from "../../../config/vistaPrevia";
import { authService, rutaPorRol, type Rol } from "../../../services/authService";
import AvisoMantenimiento from "./AvisoMantenimiento";
import BotonGoogle from "./BotonGoogle";
import CampoContrasena from "./CampoContrasena";
import { ContactIcon, MailIcon, PersonIcon } from "./icons";

type TipoCuenta = "host" | "jugador";

// El boton Host/Jugador de la pantalla se traduce al rol que espera el backend
const rolPorTipoCuenta: Record<TipoCuenta, Rol> = { host: "HOST", jugador: "JUGADOR" };

// Formulario de registro: no hace fetch propio, todo pasa por authService.ts
const FormRegistro = () => {
  const navigate = useNavigate();
  const [tipoCuenta, setTipoCuenta] = useState<TipoCuenta>("jugador");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [repetirContrasena, setRepetirContrasena] = useState("");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [aviso, setAviso] = useState(false);

  const handleGoogleSuccess = async (credential: string) => {
    setError("");
    setEnviando(true);
    try {
      const { usuario } = await authService.loginConGoogle(credential);
      navigate(rutaPorRol(usuario.rol), { replace: true });
    } catch (fallo) {
      setError(fallo instanceof Error ? fallo.message : "No se pudo registrar con Google");
    } finally {
      setEnviando(false);
    }
  };

  // Todos los campos son obligatorios: el boton se habilita recien cuando estan completos y se aceptaron los terminos
  const camposCompletos = [nombre, telefono, correo, contrasena, repetirContrasena].every((c) => c.trim() !== "");
  const puedeRegistrarse = camposCompletos && aceptaTerminos;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!puedeRegistrarse) return;
    if (VISTA_PREVIA) {
      setAviso(true);
      return;
    }
    setError("");

    if (contrasena !== repetirContrasena) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setEnviando(true);

    try {
      // Estos son los campos que viajan en el body del POST /api/auth/register
      const { usuario } = await authService.registro({
        nombre,
        email: correo,
        password: contrasena,
        rol: rolPorTipoCuenta[tipoCuenta],
        telefono,
      });
      // Recien creada la cuenta, entra directo al home que le toca por rol
      navigate(rutaPorRol(usuario.rol), { replace: true });
    } catch (fallo) {
      setError(fallo instanceof Error ? fallo.message : "No se pudo crear la cuenta");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h1 className="auth-form__title">Creá tu cuenta</h1>

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

      <p className="auth-form__subtitle">Selecciona tu tipo de cuenta</p>

      <div className="auth-account-type">
        <button
          type="button"
          className={tipoCuenta === "host" ? "is-active" : ""}
          onClick={() => setTipoCuenta("host")}
        >
          <img src={`${import.meta.env.BASE_URL}assets/icons/canchas.svg`} alt="" />
          Host
        </button>
        <button
          type="button"
          className={tipoCuenta === "jugador" ? "is-active" : ""}
          onClick={() => setTipoCuenta("jugador")}
        >
          <PersonIcon />
          Jugador
        </button>
      </div>

      <p className="auth-form__subtitle">
        Introducí tu información personal{" "}
        <span className="auth-req" aria-label="todos los campos son obligatorios">
          *
        </span>
      </p>

      <label className="auth-input">
        <PersonIcon />
        <input type="text" placeholder="Nombre" value={nombre} onChange={(event) => setNombre(event.target.value)} required />
      </label>

      <label className="auth-input">
        <ContactIcon />
        <input type="tel" placeholder="Telefono" value={telefono} onChange={(event) => setTelefono(event.target.value)} required />
      </label>

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

      <CampoContrasena placeholder="Repetir contraseña" value={repetirContrasena} onChange={setRepetirContrasena} />

      <label className="auth-checkbox">
        <input
          type="checkbox"
          checked={aceptaTerminos}
          onChange={(event) => setAceptaTerminos(event.target.checked)}
          required
        />
        <span>
          Acepto los <a href="#">Términos y Condiciones</a> y la <a href="#">Política de Privacidad</a>{" "}
          <span className="auth-req" aria-label="obligatorio">
            *
          </span>
        </span>
      </label>

      {error && <p className="auth-error">{error}</p>}

      <button type="submit" className="auth-submit" disabled={enviando || !puedeRegistrarse}>
        {enviando ? "Creando cuenta..." : "Registrarme"}
      </button>

      {aviso && <AvisoMantenimiento onCerrar={() => setAviso(false)} />}
    </form>
  );
};

export default FormRegistro;
