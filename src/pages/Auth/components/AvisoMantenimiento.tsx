import { useEffect } from "react";
import { createPortal } from "react-dom";

interface AvisoMantenimientoProps {
  onCerrar: () => void;
}

// Aviso que aparece en vez de iniciar sesion o registrarse mientras la pagina esta en modo vista previa
const AvisoMantenimiento = ({ onCerrar }: AvisoMantenimientoProps) => {
  useEffect(() => {
    const alTeclear = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") onCerrar();
    };
    window.addEventListener("keydown", alTeclear);
    return () => window.removeEventListener("keydown", alTeclear);
  }, [onCerrar]);

  // Va directo en el body: los contenedores del login tienen transform y recortarian el modal
  return createPortal(
    <div className="mantenimiento-overlay" onClick={onCerrar}>
      <div
        className="mantenimiento"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="mantenimiento-titulo"
        aria-describedby="mantenimiento-texto"
        onClick={(evento) => evento.stopPropagation()}
      >
        <span className="mantenimiento__icono" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4Z" />
          </svg>
        </span>
        <h3 id="mantenimiento-titulo">Estamos en mantenimiento</h3>
        <p id="mantenimiento-texto">
          El inicio de sesión y el registro no están disponibles por ahora. Seguimos trabajando en Syncro para que
          muy pronto puedas crear tu cuenta y reservar tu cancha.
        </p>
        <p>Mientras tanto, podés recorrer toda la plataforma y conocer lo que viene.</p>
        <button type="button" className="mantenimiento__boton" onClick={onCerrar} autoFocus>
          Entendido
        </button>
      </div>
    </div>,
    document.body,
  );
};

export default AvisoMantenimiento;
