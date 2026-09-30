import { useEffect, useRef } from "react";
import { GoogleIcon } from "./icons";

interface BotonGoogleProps {
  onSuccess: (credential: string) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

const BotonGoogle = ({ onSuccess, onError, disabled }: BotonGoogleProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId) {
      return;
    }

    const inicializar = () => {
      if (!window.google?.accounts?.id || !containerRef.current) return;

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          if (response?.credential) {
            onSuccess(response.credential);
          } else {
            onError("No se recibió credencial de Google");
          }
        },
      });

      window.google.accounts.id.renderButton(containerRef.current, {
        type: "icon",
        shape: "circle",
        size: "large",
      });
    };

    if (window.google?.accounts?.id) {
      inicializar();
    } else {
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(interval);
          inicializar();
        }
      }, 200);
      return () => clearInterval(interval);
    }
  }, [clientId, onSuccess, onError]);

  const handleClick = () => {
    if (disabled) return;
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    }
  };

  return (
    <div className="auth-social__google" style={{ position: "relative", display: "inline-flex", width: "2.75rem", height: "2.75rem" }}>
      <button
        type="button"
        aria-label="Continuar con Google"
        onClick={handleClick}
        disabled={disabled}
        style={{ width: "100%", height: "100%" }}
      >
        <GoogleIcon />
      </button>
      <div
        ref={containerRef}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "40px",
          height: "40px",
          opacity: 0.001,
          overflow: "hidden",
          pointerEvents: disabled ? "none" : "auto",
          cursor: "pointer",
          borderRadius: "50%",
        }}
      />
    </div>
  );
};

export default BotonGoogle;
