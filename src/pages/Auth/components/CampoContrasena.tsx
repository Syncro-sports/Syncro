import { useState } from "react";
import { EyeIcon, EyeOffIcon, LockIcon } from "./icons";

interface CampoContrasenaProps {
  placeholder: string;
  value: string;
  onChange: (valor: string) => void;
}

// Campo de contraseña con el ojito a la derecha: un clic la muestra y otro clic la vuelve a ocultar
const CampoContrasena = ({ placeholder, value, onChange }: CampoContrasenaProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <label className="auth-input">
      <LockIcon />
      <input
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
      />
      <button
        type="button"
        className="auth-input__ojo"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
        aria-pressed={visible}
      >
        {visible ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </label>
  );
};

export default CampoContrasena;
