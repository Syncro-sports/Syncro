// ConfiguracionData.ts

export interface PerfilConfig {
  nombreCompleto: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  posicion: string;
  nivel: string;
  zonaHoraria: string;
  moneda: string;
  idioma: string;
  formatoHora: "24h" | "12h";
}

export const CONFIG_MOCK: PerfilConfig = {
  nombreCompleto: "",  
  email: "",           
  telefono: "",        
  fechaNacimiento: "",
  posicion: "",
  nivel: "",
  zonaHoraria: "BA",
  moneda: "ARS",
  idioma: "ES",
  formatoHora: "24h",
};