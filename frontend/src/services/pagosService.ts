const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const pagosService = {
  crearPreferencia: async (titulo: string, precio: number, cantidad: number = 1): Promise<string> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No hay sesión iniciada");

    const response = await fetch(`${API_URL}/pagos/preferencia`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ titulo, precio, cantidad })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.mensaje || "Error al conectar con MercadoPago");
    }

    const data = await response.json();
    return data.init_point;
  }
};
