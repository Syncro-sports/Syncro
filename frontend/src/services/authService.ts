const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const authService = {
  login: async (credenciales: { email: string; passwordPlana: string }) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: credenciales.email, password: credenciales.passwordPlana }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.mensaje || "Error en el login");
      }
      const data = await response.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
      }
      return data;
    } catch (error) {
      console.error("Error en authService.login:", error);
      throw error;
    }
  },

  register: async (datos: any) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.mensaje || "Error en el registro");
      }
      return await response.json();
    } catch (error) {
      console.error("Error en authService.register:", error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
  },

  getUsuarioActual: () => {
    const usuarioStr = localStorage.getItem("usuario");
    if (usuarioStr) {
      try {
        return JSON.parse(usuarioStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  },

  getToken: () => {
    return localStorage.getItem("token");
  },
};
