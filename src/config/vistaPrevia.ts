// Modo "vista previa": la gente puede recorrer toda la pagina, pero no iniciar sesion ni registrarse.
// Esta activo por defecto. Para habilitar el acceso de nuevo: VITE_VISTA_PREVIA=false en el .env
// (o en las variables de entorno del hosting) y volver a desplegar.
export const VISTA_PREVIA = import.meta.env.VITE_VISTA_PREVIA !== "false";

export const MENSAJE_VISTA_PREVIA =
  "El inicio de sesión y el registro no están disponibles por ahora: estamos en mantenimiento.";
