const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const reservasService = {
  crearReserva: async (datos: {
    canchaId: string;
    fecha: string;
    hora: string;
    tipoReserva: string;
    metodoPago: string;
    senia: number;
    total: number;
  }) => {
    try {
      const token = localStorage.getItem("token");
      const headers: any = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const usuarioStr = localStorage.getItem("usuario");
      let usuarioId = null;
      if (usuarioStr) {
        try {
          usuarioId = JSON.parse(usuarioStr).id;
        } catch (e) {}
      }

      // Si no hay token/usuario, podríamos pedir login, pero para la demo
      // mandamos un ID temporal si el backend lo permite, o tiramos error.
      if (!usuarioId && !token) {
        // En una app real, acá redirigiríamos al login
        throw new Error("Debes iniciar sesión para reservar");
      }

      const body = {
        ...datos,
        usuarioId,
      };

      const response = await fetch(`${API_URL}/reservas`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.mensaje || "Error al crear la reserva");
      }

      return await response.json();
    } catch (error) {
      console.error("Error en reservasService.crearReserva:", error);
      throw error;
    }
  },

  obtenerMisReservas: async () => {
    try {
      const token = localStorage.getItem("token");
      const usuarioStr = localStorage.getItem("usuario");
      if (!token || !usuarioStr) return [];
      
      const usuarioId = JSON.parse(usuarioStr).id;

      const response = await fetch(`${API_URL}/reservas/mis-reservas?usuarioId=${usuarioId}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        return [];
      }
      return await response.json();
    } catch (error) {
      console.error("Error al obtener mis reservas:", error);
      return [];
    }
  }
};
