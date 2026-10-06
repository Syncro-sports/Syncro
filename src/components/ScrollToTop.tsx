import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Al navegar entre paginas con React Router no hay recarga real, asi que el
// navegador mantiene el scroll donde estaba en la pagina anterior. Sin esto,
// entrar a una pagina nueva desde un punto scrolleado del Home (por ejemplo)
// la muestra "a mitad de camino" en vez de arriba de todo.
//
// Si la URL trae un hash (ej. /guia-usuario#seccion-jugador), no forzamos el
// scroll a 0: dejamos que la pagina de destino decida a que seccion ir.
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
