import { ArrowLeftIcon, ArrowRightIcon, PersonKeyIcon, PersonPlusIcon } from "./icons";

type Modo = "login" | "registro";

interface PanelAnimadoProps {
  modo: Modo;
  onCambiar: (modo: Modo) => void;
}

const PanelAnimado = ({ onCambiar }: PanelAnimadoProps) => {
  return (
    <div className="auth-overlay">
      <div className="auth-overlay__message auth-overlay__message--login">
        <span className="auth-overlay__icon">
          <PersonPlusIcon />
        </span>
        <h2>¿Aún no tenés cuenta?</h2>
        <p>
          Si aún no estas registrado,
          <br />
          podes crear tu cuenta
        </p>
        <button type="button" onClick={() => onCambiar("registro")}>
          <ArrowLeftIcon />
          Registrarme
        </button>
      </div>

      <div className="auth-overlay__message auth-overlay__message--registro">
        <span className="auth-overlay__icon">
          <PersonKeyIcon />
        </span>
        <h2>¿Ya tenes cuenta?</h2>
        <p>
          Si ya estas registrado,
          <br />
          podés iniciar sesión
        </p>
        <button type="button" onClick={() => onCambiar("login")}>
          Iniciar sesión
          <ArrowRightIcon />
        </button>
      </div>
    </div>
  );
};

export default PanelAnimado;
