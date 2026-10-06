import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../../../services/authService";
import { equiposService, MiEquipo } from "../../../services/equiposService";
import { JugadorElegido, ParticipantesReserva } from "../../../services/participantesReserva";
import { UserIcon } from "./icons";
import "./JugadoresReserva.css";

// Lo que el jugador va eligiendo. La cantidad de jugadores es fija (la define el formato);
// null equivale a todo el cupo del partido.
export interface SeleccionJugadores {
  equipoId?: string;
  equipoNombre?: string;
  // Siempre incluye a quien reserva, en primer lugar
  miembros: JugadorElegido[];
  cantidad: number | null;
}

export const seleccionInicial = (): SeleccionJugadores => {
  const yo = authService.obtenerUsuario();
  return { miembros: [{ id: yo?._id, nombre: yo?.nombre ?? "Vos", esYo: true }], cantidad: null };
};

export const aParticipantes = (sel: SeleccionJugadores, cupo: number): ParticipantesReserva => ({
  ...(sel.equipoId ? { equipoId: sel.equipoId } : {}),
  ...(sel.equipoNombre ? { equipoNombre: sel.equipoNombre } : {}),
  jugadores: sel.miembros,
  cantidad: Math.min(cupo, Math.max(sel.cantidad ?? cupo, sel.miembros.length)),
});

export const iniciales = (nombre: string) =>
  nombre
    .replace(/\(.*\)/, "")
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

interface JugadoresReservaProps {
  cupo: number;
  esMatchmaking: boolean;
  valor: SeleccionJugadores;
  onChange: (valor: SeleccionJugadores) => void;
}

// Campo obligatorio: primero se elige el equipo; despues, un boton abre un mini modal
// para marcar quienes juegan. En el modal de reserva solo queda un resumen en una fila.
const JugadoresReserva = ({ cupo, esMatchmaking, valor, onChange }: JugadoresReservaProps) => {
  const [equipos, setEquipos] = useState<MiEquipo[]>([]);
  const [cargandoEquipos, setCargandoEquipos] = useState(true);
  const [selectorAbierto, setSelectorAbierto] = useState(false);
  const yo = valor.miembros[0];

  useEffect(() => {
    let activo = true;
    equiposService
      .obtenerMisEquipos()
      .then((r) => activo && setEquipos(r.equipos))
      .catch(() => undefined)
      .finally(() => activo && setCargandoEquipos(false));
    return () => {
      activo = false;
    };
  }, []);

  const total = Math.min(cupo, Math.max(valor.cantidad ?? cupo, valor.miembros.length));
  const lugaresLibres = total - valor.miembros.length;

  const elegirEquipo = (id: string) => {
    const equipo = equipos.find((e) => e.id === id);
    // Al cambiar de equipo se parte de cero, para no arrastrar integrantes del anterior
    onChange({
      miembros: [yo],
      cantidad: valor.cantidad,
      ...(equipo ? { equipoId: equipo.id, equipoNombre: equipo.nombre } : {}),
    });
    if (equipo) setSelectorAbierto(true);
  };

  return (
    <div className="crm-section jr">
      <div className="crm-section-header">
        <UserIcon />
        <h3>
          {esMatchmaking ? "Tu equipo y sus jugadores" : "Equipo y jugadores"}{" "}
          <span className="crm-req" aria-label="obligatorio">
            *
          </span>
        </h3>
        {valor.equipoId && (
          <span className="jr-contador">
            {valor.miembros.length} de {total}
          </span>
        )}
      </div>

      <select
        id="jr-equipo"
        aria-label="Equipo"
        className="jr-select"
        value={valor.equipoId ?? ""}
        onChange={(e) => elegirEquipo(e.target.value)}
        disabled={cargandoEquipos || equipos.length === 0}
        required
      >
        <option value="">
          {cargandoEquipos ? "Cargando tus equipos..." : equipos.length ? "Elegí tu equipo" : "No tenés equipos todavía"}
        </option>
        {equipos.map((e) => (
          <option key={e.id} value={e.id}>
            {e.nombre} · {e.jugadoresCant} {e.jugadoresCant === 1 ? "integrante" : "integrantes"}
          </option>
        ))}
      </select>

      {!cargandoEquipos && equipos.length === 0 && (
        <p className="jr-error">
          Para reservar necesitás un equipo. <Link to="/perfil-jugador/equipos">Creá uno desde tu perfil</Link>.
        </p>
      )}

      {valor.equipoId && (
        <div className="jr-resumen-fila">
          <div className="jr-chips">
            {valor.miembros.map((m) => (
              <span className="jr-chip" key={m.id ?? m.nombre} title={m.nombre}>
                <span className="jr-av">{iniciales(m.nombre)}</span>
                {m.esYo ? "Vos" : m.nombre.split(" ")[0]}
              </span>
            ))}
            {lugaresLibres > 0 && (
              <span className="jr-chip jr-chip--libre">
                +{lugaresLibres} {lugaresLibres === 1 ? "lugar libre" : "lugares libres"}
              </span>
            )}
          </div>
          <button type="button" className="jr-btn" onClick={() => setSelectorAbierto(true)}>
            Elegir jugadores
          </button>
        </div>
      )}

      {selectorAbierto && valor.equipoId && (
        <SelectorJugadores
          cupo={cupo}
          valor={valor}
          onCancelar={() => setSelectorAbierto(false)}
          onListo={(v) => {
            onChange(v);
            setSelectorAbierto(false);
          }}
        />
      )}
    </div>
  );
};

interface SelectorProps {
  cupo: number;
  valor: SeleccionJugadores;
  onCancelar: () => void;
  onListo: (valor: SeleccionJugadores) => void;
}

// Mini modal: integrantes del equipo elegido + cantidad total de jugadores
export const SelectorJugadores = ({ cupo, valor, onCancelar, onListo }: SelectorProps) => {
  const yo = valor.miembros[0];
  const [integrantes, setIntegrantes] = useState<JugadorElegido[]>([]);
  const [cargando, setCargando] = useState(true);
  const [marcados, setMarcados] = useState<Set<string>>(
    new Set(valor.miembros.filter((m) => !m.esYo && m.id).map((m) => m.id!)),
  );

  useEffect(() => {
    if (!valor.equipoId) return;
    let activo = true;
    equiposService
      .obtenerPorId(valor.equipoId)
      .then(
        (e) => activo && setIntegrantes(e.jugadores.filter((j) => j.id !== yo.id).map((j) => ({ id: j.id, nombre: j.nombre }))),
      )
      .catch(() => activo && setIntegrantes([]))
      .finally(() => activo && setCargando(false));
    return () => {
      activo = false;
    };
  }, [valor.equipoId, yo.id]);

  const elegidos = integrantes.filter((i) => i.id && marcados.has(i.id));
  const minimo = 1 + elegidos.length;
  // La cantidad de jugadores es fija: la define el formato (Futbol 7 = 7 por equipo)
  const cantidadFinal = cupo;
  const libres = cantidadFinal - minimo;

  const alternar = (id: string) =>
    setMarcados((prev) => {
      const siguiente = new Set(prev);
      if (siguiente.has(id)) siguiente.delete(id);
      else if (1 + siguiente.size < cupo) siguiente.add(id);
      return siguiente;
    });

  return (
    <div className="jr-overlay" onClick={onCancelar}>
      <div className="jr-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <h3>¿Quiénes juegan?</h3>
        <p className="jr-nota">Marcá quiénes de {valor.equipoNombre ?? "tu equipo"} van a jugar.</p>

        <div className="jr-lista">
          <div className="jr-item jr-item--on jr-item--yo">
            <span className="jr-av">{iniciales(yo.nombre)}</span>
            <span className="jr-item__n">
              {yo.nombre} <small>(quien reserva)</small>
            </span>
            <span className="jr-check">✓</span>
          </div>
          {cargando && <p className="jr-nota">Cargando integrantes...</p>}
          {integrantes.map((i) => {
            const on = Boolean(i.id && marcados.has(i.id));
            return (
              <button
                type="button"
                key={i.id}
                className={`jr-item ${on ? "jr-item--on" : ""}`}
                onClick={() => i.id && alternar(i.id)}
              >
                <span className="jr-av">{iniciales(i.nombre)}</span>
                <span className="jr-item__n">{i.nombre}</span>
                <span className="jr-check">{on ? "✓" : ""}</span>
              </button>
            );
          })}
        </div>

        <p className="jr-resumen">
          <b>{minimo}</b> con cuenta de Syncro + <b>{libres}</b> {libres === 1 ? "lugar" : "lugares"} por completar ={" "}
          <b>{cantidadFinal}</b> jugadores
        </p>

        <div className="jr-acciones">
          <button type="button" className="jr-btn" onClick={onCancelar}>
            Cancelar
          </button>
          <button
            type="button"
            className="jr-btn jr-btn--verde"
            onClick={() => onListo({ ...valor, miembros: [yo, ...elegidos], cantidad: cantidadFinal })}
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};

export default JugadoresReserva;
