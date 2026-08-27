import { CANCHAS, Cancha, EstadoCancha, calcularDescuentoLabel } from "../pages/PerfilHost/canchasData";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const LOCAL_STORAGE_KEY = "syncro_host_canchas_data";

export interface CanchaBackendDTO {
  _id?: string;
  id?: string | number;
  complejoId?: string;
  nombre: string;
  deporte: string;
  superficie: string;
  formato: string;
  senia: number;
  precioDia: number;
  precioNoche: number;
  estaActiva?: boolean;
  estaDisponible?: boolean;
  esTechada?: boolean;
  tieneTribuna?: boolean;
  esCompetitiva?: boolean;
  esIluminada?: boolean;
  imagenUrl?: string;
  imagen?: string;
  replay?: boolean;
  descuento?: boolean;
  descuentoLabel?: string;
  precioDescuento?: number;
  precioOriginal?: number;
  rating?: number;
  tags?: string[];
  descripcion?: string;
}

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("token") || localStorage.getItem("auth_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const mapBackendToCancha = (item: any): Cancha => {
  const precioOriginal = item.precioOriginal ?? item.precioDia ?? 25000;
  const precioDescuento = item.precioDescuento ?? item.precioDia ?? precioOriginal;
  const esCompetitiva = item.esCompetitiva ?? Boolean(item.tieneTribuna);
  const estado: EstadoCancha =
    item.estado ||
    (item.estaActiva === false ? "inactiva" : item.estaDisponible === false ? "mantenimiento" : "activa");

  const tags: string[] = item.tags && Array.isArray(item.tags) && item.tags.length > 0
    ? item.tags
    : [
        `${item.deporte || "Fútbol"} ${(item.formato || "5 vs 5").replace(" vs ", "v")}`,
        item.superficie || "Sintético",
        ...(item.esTechada ? ["Techada"] : []),
        ...(esCompetitiva ? ["Competitiva"] : []),
        ...(item.replay ? ["Replay"] : []),
        `${(item.rating || 4.8).toFixed(1)} ★`,
      ];

  return {
    id: item._id || item.id || Date.now(),
    nombre: item.nombre || "Cancha sin nombre",
    imagen: item.imagenUrl || item.imagen || `${import.meta.env.BASE_URL}assets/canchas/cancha-1.jpg`,
    deporte: item.deporte || "Fútbol",
    formato: item.formato || "5 vs 5",
    superficie: item.superficie || "Sintético",
    esTechada: Boolean(item.esTechada),
    esCompetitiva: Boolean(esCompetitiva),
    esIluminada: item.esIluminada ?? true,
    replay: Boolean(item.replay),
    estado,
    precioOriginal: Number(precioOriginal),
    precioDescuento: Number(precioDescuento),
    precioNoche: Number(item.precioNoche ?? precioOriginal + 3000),
    senia: Number(item.senia ?? 8000),
    descuentoLabel: calcularDescuentoLabel(precioOriginal, precioDescuento) || item.descuentoLabel || "",
    rating: Number(item.rating || 4.8),
    tags,
    descripcion: item.descripcion || "",
  };
};

export const mapCanchaToBackend = (cancha: Partial<Cancha>, complejoId?: string): CanchaBackendDTO => {
  return {
    complejoId: complejoId || "60d0fe4f5311236168a109ca",
    nombre: cancha.nombre || "",
    deporte: cancha.deporte || "Fútbol",
    superficie: cancha.superficie || "Sintético",
    formato: cancha.formato || "5 vs 5",
    senia: Number(cancha.senia ?? 8000),
    precioDia: Number(cancha.precioOriginal ?? 25000),
    precioNoche: Number(cancha.precioNoche ?? 28000),
    precioDescuento: Number(cancha.precioDescuento ?? cancha.precioOriginal ?? 20000),
    estaActiva: cancha.estado === "activa",
    estaDisponible: cancha.estado !== "mantenimiento",
    esTechada: Boolean(cancha.esTechada),
    tieneTribuna: Boolean(cancha.esCompetitiva),
    esCompetitiva: Boolean(cancha.esCompetitiva),
    esIluminada: cancha.esIluminada ?? true,
    imagenUrl: cancha.imagen || "",
    replay: Boolean(cancha.replay),
    descuento: Boolean(cancha.precioDescuento && cancha.precioOriginal && cancha.precioDescuento < cancha.precioOriginal),
    descripcion: cancha.descripcion || "",
    rating: cancha.rating || 4.8,
  };
};

const getLocalCanchas = (): Cancha[] => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((c: any) => mapBackendToCancha(c));
    }
  } catch {}
  return CANCHAS;
};

const saveLocalCanchas = (list: Cancha[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch {}
};

export const canchasService = {
  async getAll(complejoId?: string): Promise<Cancha[]> {
    try {
      const query = complejoId ? `?complejoId=${complejoId}` : "";
      const res = await fetch(`${API_BASE}/canchas${query}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        throw new Error(`HTTP Error ${res.status}`);
      }

      const data = await res.json();
      const items = Array.isArray(data) ? data : data.canchas || [];
      const mapped = items.map(mapBackendToCancha);
      saveLocalCanchas(mapped);
      return mapped;
    } catch {
      return getLocalCanchas();
    }
  },

  async getById(id: string | number): Promise<Cancha | null> {
    try {
      const res = await fetch(`${API_BASE}/canchas/${id}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        throw new Error(`HTTP Error ${res.status}`);
      }

      const data = await res.json();
      return mapBackendToCancha(data.cancha || data);
    } catch {
      const list = getLocalCanchas();
      return list.find((c) => String(c.id) === String(id)) || null;
    }
  },

  async create(canchaData: Omit<Cancha, "id">, complejoId?: string): Promise<Cancha> {
    const payload = mapCanchaToBackend(canchaData, complejoId);

    try {
      const res = await fetch(`${API_BASE}/canchas`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`HTTP Error ${res.status}`);
      }

      const data = await res.json();
      const nuevaCancha = mapBackendToCancha(data.cancha || data);

      const list = getLocalCanchas();
      saveLocalCanchas([...list, nuevaCancha]);
      return nuevaCancha;
    } catch {
      const list = getLocalCanchas();
      const nextId = list.length > 0 ? Math.max(...list.map((c) => Number(c.id) || 0)) + 1 : 1;
      const localCancha: Cancha = {
        ...canchaData,
        id: nextId,
      };
      saveLocalCanchas([...list, localCancha]);
      return localCancha;
    }
  },

  async update(id: string | number, canchaData: Partial<Cancha>, complejoId?: string): Promise<Cancha> {
    const payload = mapCanchaToBackend(canchaData, complejoId);

    try {
      const res = await fetch(`${API_BASE}/canchas/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`HTTP Error ${res.status}`);
      }

      const data = await res.json();
      const updated = mapBackendToCancha(data.cancha || data);

      const list = getLocalCanchas();
      saveLocalCanchas(list.map((c) => (String(c.id) === String(id) ? updated : c)));
      return updated;
    } catch {
      const list = getLocalCanchas();
      const existing = list.find((c) => String(c.id) === String(id));
      const updatedLocal: Cancha = {
        ...(existing || (canchaData as Cancha)),
        ...canchaData,
        id,
      };
      saveLocalCanchas(list.map((c) => (String(c.id) === String(id) ? updatedLocal : c)));
      return updatedLocal;
    }
  },

  async delete(id: string | number): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/canchas/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        throw new Error(`HTTP Error ${res.status}`);
      }

      const list = getLocalCanchas();
      saveLocalCanchas(list.filter((c) => String(c.id) !== String(id)));
      return true;
    } catch (error) {
      // Cambio para el merge
      console.warn("No se pudo eliminar en el servidor, se guardó local:", error);
      const list = getLocalCanchas();
      saveLocalCanchas(list.filter((c) => String(c.id) !== String(id)));
      return true;
    }
  },

  async updateStatus(id: string | number, estado: EstadoCancha): Promise<void> {
    try {
      const res = await fetch(`${API_BASE}/canchas/${id}/estado`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          estado,
          estaActiva: estado === "activa",
          estaDisponible: estado !== "mantenimiento",
        }),
      });

      if (!res.ok) {
        await this.update(id, { estado });
      }
    } catch {
      await this.update(id, { estado });
    }
  },
};
