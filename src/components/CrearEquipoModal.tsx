import { FormEvent, useState } from "react";
import { equiposService, Equipo, Nivel, Posicion, Sexo } from "../services/equiposService";
import "./CrearEquipoModal.css";

interface CrearEquipoModalProps {
  onClose: () => void;
  onCreado: (equipo: Equipo) => void;
}

const NIVELES: { value: Nivel; label: string }[] = [
  { value: "A", label: "A" },
  { value: "B", label: "B" },
  { value: "C", label: "C" },
];

const SEXOS: { value: Sexo; label: string }[] = [
  { value: "MASCULINO", label: "Masculino" },
  { value: "FEMENINO", label: "Femenino" },
  { value: "MIXTO", label: "Mixto" },
];

const POSICIONES: { value: Posicion; label: string }[] = [
  { value: "ARQ", label: "Arquero" },
  { value: "DEF", label: "Defensor" },
  { value: "MED", label: "Mediocampista" },
  { value: "DEL", label: "Delantero" },
];

const CrearEquipoModal = ({ onClose, onCreado }: CrearEquipoModalProps) => {
  const [nombre, setNombre] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [sexo, setSexo] = useState<Sexo>("MIXTO");
  const [nivel, setNivel] = useState<Nivel>("A");
  const [cupoMaximo, setCupoMaximo] = useState(15);
  const [posicion, setPosicion] = useState<Posicion | "">("");
  const [descripcion, setDescripcion] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (enviando) return;

    setError(null);
    setEnviando(true);
    try {
      const { equipo } = await equiposService.crear({
        nombre: nombre.trim(),
        ubicacion: ubicacion.trim(),
        sexo,
        nivel,
        cupoMaximo,
        descripcion: descripcion.trim() || undefined,
        posicion: posicion || undefined,
      });
      onCreado(equipo);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear el equipo");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="crear-equipo-overlay" onClick={onClose}>
      <div className="crear-equipo-modal" onClick={(e) => e.stopPropagation()}>
        <div className="crear-equipo-modal__header">
          <h2>Crear equipo</h2>
          <button type="button" className="crear-equipo-modal__close" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>

        <form className="crear-equipo-modal__form" onSubmit={handleSubmit}>
          <label className="crear-equipo-modal__field">
            <span>Nombre del equipo</span>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Scaloneta"
              required
              minLength={2}
              maxLength={40}
            />
          </label>

          <label className="crear-equipo-modal__field">
            <span>Ubicación</span>
            <input
              type="text"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              placeholder="Ej: Banfield"
              required
              maxLength={80}
            />
          </label>

          <div className="crear-equipo-modal__row">
            <label className="crear-equipo-modal__field">
              <span>Género</span>
              <select value={sexo} onChange={(e) => setSexo(e.target.value as Sexo)}>
                {SEXOS.map((opcion) => (
                  <option key={opcion.value} value={opcion.value}>
                    {opcion.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="crear-equipo-modal__field">
              <span>Nivel</span>
              <select value={nivel} onChange={(e) => setNivel(e.target.value as Nivel)}>
                {NIVELES.map((opcion) => (
                  <option key={opcion.value} value={opcion.value}>
                    {opcion.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="crear-equipo-modal__row">
            <label className="crear-equipo-modal__field">
              <span>Cupo máximo</span>
              <input
                type="number"
                value={cupoMaximo}
                onChange={(e) => setCupoMaximo(Number(e.target.value))}
                min={2}
                max={30}
                required
              />
            </label>

            <label className="crear-equipo-modal__field">
              <span>Tu posición (opcional)</span>
              <select value={posicion} onChange={(e) => setPosicion(e.target.value as Posicion | "")}>
                <option value="">Sin definir</option>
                {POSICIONES.map((opcion) => (
                  <option key={opcion.value} value={opcion.value}>
                    {opcion.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="crear-equipo-modal__field">
            <span>Descripción (opcional)</span>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Contanos un poco sobre el equipo"
              maxLength={300}
              rows={3}
            />
          </label>

          {error && <p className="crear-equipo-modal__error">{error}</p>}

          <div className="crear-equipo-modal__actions">
            <button type="button" className="crear-equipo-modal__cancelar" onClick={onClose} disabled={enviando}>
              Cancelar
            </button>
            <button type="submit" className="crear-equipo-modal__submit" disabled={enviando}>
              {enviando ? "Creando..." : "Crear equipo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearEquipoModal;
