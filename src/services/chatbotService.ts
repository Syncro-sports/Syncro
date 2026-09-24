const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export interface RespuestaChatbot {
  respuesta: string;
  fuentes: string[];
}

export const chatbotService = {
  preguntar: async (pregunta: string): Promise<RespuestaChatbot> => {
    const respuesta = await fetch(`${API_URL}/chatbot/preguntar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pregunta }),
    });

    const datos = await respuesta.json().catch(() => null);

    if (!respuesta.ok) {
      throw new Error(datos?.error ?? "No se pudo completar la consulta");
    }

    return datos as RespuestaChatbot;
  },
};