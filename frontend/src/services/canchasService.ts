import { COMPLEJOS_CANCHAS } from "../pages/Canchas/canchasData";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const canchasService = {
  obtenerCanchas: async (filtros?: any) => {
    try {
      const queryParams = new URLSearchParams();
      if (filtros) {
        if (filtros.tipo) queryParams.append("tipo", filtros.tipo);
        if (filtros.superficie) queryParams.append("superficie", filtros.superficie);
        if (filtros.maxPrecio) queryParams.append("precioMax", filtros.maxPrecio.toString());
      }
      
      const response = await fetch(`${API_URL}/canchas?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error("Error al obtener canchas del backend");
      }
      const data = await response.json();
      if (!data || data.length === 0) {
        console.warn("No hay canchas en la DB, usando mock data");
        return COMPLEJOS_CANCHAS;
      }
      return data;
    } catch (error) {
      console.warn("Backend offline o error, usando fallback a COMPLEJOS_CANCHAS", error);
      return COMPLEJOS_CANCHAS;
    }
  },
  
  obtenerCanchaPorId: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/canchas/${id}`);
      if (!response.ok) {
        throw new Error("Error al obtener la cancha");
      }
      return await response.json();
    } catch (error) {
      console.warn("Backend offline o error, buscando en COMPLEJOS_CANCHAS");
      return COMPLEJOS_CANCHAS.find((c: any) => c.id.toString() === id.toString());
    }
  },

  getAll: async () => {
    return canchasService.obtenerCanchas();
  },
  create: async (data: any) => {
    return fetch(`${API_URL}/canchas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(res => res.json());
  },
  update: async (id: number | string, data: any) => {
    return fetch(`${API_URL}/canchas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(res => res.json());
  },
  delete: async (id: number | string) => {
    return fetch(`${API_URL}/canchas/${id}`, {
      method: "DELETE"
    }).then(res => res.json());
  },
  updateStatus: async (id: number | string, data: any) => {
    return fetch(`${API_URL}/canchas/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(res => res.json());
  }
};
