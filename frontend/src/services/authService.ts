// ==========================================================================
// BACKEND: este es el unico archivo que hay que tocar para conectar el login.
// 1. Completar VITE_API_URL en el archivo .env
// 2. Poner backendConectado en true (mas abajo)
// 3. Si la respuesta del server cambia de forma, ajustar Usuario / RespuestaAuth
// 4. Ya conectado, borrar cuentasMock / loginMock / registroMock: son temporales
// Endpoints usados: POST /api/auth/login y POST /api/auth/register
// Cuentas de prueba (solo con backendConectado en false):
//   host@syncro.com / host1234       -> entra al home del host
//   jugador@syncro.com / jugador1234 -> entra al home del jugador
// ==========================================================================

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export type Rol = "HOST" | "JUGADOR";

// Forma del usuario que devuelve el backend: si cambian campos, se cambian aca
export interface Usuario {
  _id: string;
  nombre: string;
  email: string;
  rol: string;
  telefono?: string;
}

export interface RespuestaAuth {
  mensaje: string;
  usuario: Usuario;
  token: string;
}

export interface CredencialesLogin {
  email: string;
  password: string;
}

export interface DatosRegistro {
  nombre: string;
  email: string;
  password: string;
  rol: Rol;
  telefono: string;
}

// BACKEND: en false no se llama al server y se usan las cuentas de prueba de abajo; poner en true para conectar
const backendConectado = true;

interface CuentaMock {
  usuario: Usuario;
  password: string;
}

// TEMPORAL: solo sirven con backendConectado en false; se borran cuando el backend quede conectado
const cuentasMock: CuentaMock[] = [
  {
    password: "host1234",
    usuario: { _id: "mock-host", nombre: "Host de prueba", email: "host@syncro.com", rol: "HOST", telefono: "0000000000" },
  },
  {
    password: "jugador1234",
    usuario: { _id: "mock-jugador", nombre: "Jugador de prueba", email: "jugador@syncro.com", rol: "JUGADOR", telefono: "0000000000" },
  },
];

const normalizarEmail = (email: string) => email.trim().toLowerCase();

// Solo entra si el email y la contraseña coinciden con una cuenta de prueba
const loginMock = (credenciales: CredencialesLogin): RespuestaAuth => {
  const cuenta = cuentasMock.find(
    (item) => item.usuario.email === normalizarEmail(credenciales.email) && item.password === credenciales.password,
  );

  if (!cuenta) throw new Error("Correo o contraseña incorrectos");
  return { mensaje: "login exitoso", usuario: cuenta.usuario, token: "token-de-prueba" };
};

// Rechaza un email ya usado y devuelve al usuario con el rol que se eligio en el formulario
const registroMock = (datos: DatosRegistro): RespuestaAuth => {
  const email = normalizarEmail(datos.email);
  if (cuentasMock.some((item) => item.usuario.email === email)) throw new Error("Ese correo ya está registrado");

  return {
    mensaje: "registro exitoso",
    usuario: { _id: `mock-${Date.now()}`, nombre: datos.nombre, email, rol: datos.rol, telefono: datos.telefono },
    token: "token-de-prueba",
  };
};

// Manda el POST al server; si responde error usa el campo "mensaje" que llega en el JSON
const pedir = async (ruta: string, cuerpo: unknown): Promise<RespuestaAuth> => {
  const respuesta = await fetch(`${API_URL}${ruta}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cuerpo),
  });

  // El catch cubre respuestas que no son JSON, por ejemplo el limite de intentos del server
  const datos = await respuesta.json().catch(() => null);

  if (!respuesta.ok) throw new Error(datos?.mensaje ?? "No se pudo completar la solicitud");
  if (!datos?.token || !datos?.usuario) throw new Error("Respuesta inesperada del servidor");
  return datos as RespuestaAuth;
};

// Deja token y usuario guardados en el navegador para que el resto de la app los lea
const guardarSesion = (datos: RespuestaAuth) => {
  localStorage.setItem("token", datos.token);
  localStorage.setItem("usuario", JSON.stringify(datos.usuario));
};

// Pasa el rol a mayusculas y sin espacios, asi "host" y "HOST" valen igual
export const normalizarRol = (rol?: string): string => (rol ?? "").trim().toUpperCase();

// ACA se decide a que home entra cada persona: HOST y JUGADOR tienen el suyo, otro rol va al home principal
export const rutaPorRol = (rol?: string): string => {
  const rolNormalizado = normalizarRol(rol);
  if (rolNormalizado === "HOST") return "/home-host";
  if (rolNormalizado === "JUGADOR") return "/home-player";
  return "/";
};

export const authService = {
  // Manda email y password, guarda la sesion y devuelve el usuario con su rol
  login: async (credenciales: CredencialesLogin): Promise<RespuestaAuth> => {
    const datos = backendConectado ? await pedir("/auth/login", credenciales) : loginMock(credenciales);
    guardarSesion(datos);
    return datos;
  },

  // Crea la cuenta con el rol elegido en el formulario y deja la sesion abierta
  registro: async (datosRegistro: DatosRegistro): Promise<RespuestaAuth> => {
    const datos = backendConectado
      ? await pedir("/auth/register", datosRegistro)
      : registroMock(datosRegistro);
    guardarSesion(datos);
    return datos;
  },

  obtenerUsuario: (): Usuario | null => {
    const guardado = localStorage.getItem("usuario");
    if (!guardado) return null;
    try {
      return JSON.parse(guardado) as Usuario;
    } catch {
      return null;
    }
  },

  // Token para mandar en el header Authorization cuando se conecten las demas pantallas
  obtenerToken: (): string | null => localStorage.getItem("token"),

  obtenerRol: (): string => normalizarRol(authService.obtenerUsuario()?.rol),

  haySesion: (): boolean => Boolean(localStorage.getItem("token")),

  // Lista para el boton de cerrar sesion cuando se agregue al header
  cerrarSesion: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
  },
};
