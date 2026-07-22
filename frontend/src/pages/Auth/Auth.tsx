import { useState } from "react";
import { Link } from "react-router-dom";
import FormLogin from "./components/FormLogin";
import FormRegistro from "./components/FormRegistro";
import PanelAnimado from "./components/PanelAnimado";
import { ArrowLeftIcon } from "./components/icons";
import "./Auth.css";

type Modo = "login" | "registro";

const Auth = () => {
  const [modo, setModo] = useState<Modo>("login");

  return (
    <div className="auth-page">
      <Link to="/" className="auth-back">
        <ArrowLeftIcon />
        Volver al inicio
      </Link>

      <div className={`auth-shell ${modo === "registro" ? "is-registro" : ""}`}>
        <div className="auth-slot auth-slot--registro">
          <FormRegistro />
        </div>
        <div className="auth-slot auth-slot--login">
          <FormLogin />
        </div>

        <PanelAnimado modo={modo} onCambiar={setModo} />

        <button
          type="button"
          className="auth-mobile-toggle"
          onClick={() => setModo(modo === "login" ? "registro" : "login")}
        >
          {modo === "login" ? "¿No tenés cuenta? Registrarme" : "¿Ya tenés cuenta? Iniciar sesión"}
        </button>
      </div>
    </div>
  );
};

export default Auth;
