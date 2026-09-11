import { useState } from "react";
import { CalendarIcon } from "./components/icons";
import "./Reservas.css";

const Reservas = () => {
  const [filtro, setFiltro] = useState<"confirmada" | "pendiente">("confirmada");

  return (
    <div className="player-reservas">
      <div className="player-reservas__title-row">
        <h1>Mis reservas</h1>
      </div>

      <div className="player-reservas__toolbar">
        <div className="player-reservas__tabs">
          <button
            type="button"
            className={`player-reservas__tab ${filtro === "confirmada" ? "is-active" : ""}`}
            onClick={() => setFiltro("confirmada")}
          >
            Confirmadas
            <span className="player-reservas__tab-count">0</span>
          </button>
          <button
            type="button"
            className={`player-reservas__tab ${filtro === "pendiente" ? "is-active" : ""}`}
            onClick={() => setFiltro("pendiente")}
          >
            Pendientes
            <span className="player-reservas__tab-count">0</span>
          </button>
        </div>

        <button type="button" className="player-reservas__calendar-btn">
          <CalendarIcon />
          Añadir al calendario
        </button>
      </div>

      <div className="player-reservas__layout">
        <div>Lista de reservas (próximo paso)</div>
        <div>Sidebar (próximo paso)</div>
      </div>
    </div>
  );
};

export default Reservas;