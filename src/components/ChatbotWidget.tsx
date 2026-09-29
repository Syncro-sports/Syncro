import { useEffect, useRef, useState } from "react";
import { chatbotService } from "../services/chatbotService";
import "./ChatbotWidget.css";

interface Mensaje {
  id: number;
  texto: string;
  tipo: "user" | "bot";
  hora: string;
}

const horaActual = () =>
  new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });

const ChatbotWidget = () => {
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    {
      id: 0,
      texto: "¡Hola! Soy el asistente virtual de Syncro. ¿En qué puedo ayudarte hoy?",
      tipo: "bot",
      hora: horaActual(),
    },
  ]);
  const [pregunta, setPregunta] = useState("");
  const [escribiendo, setEscribiendo] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight });
  }, [mensajes, escribiendo]);

  const agregarMensaje = (texto: string, tipo: "user" | "bot") => {
    setMensajes((prev) => [...prev, { id: prev.length, texto, tipo, hora: horaActual() }]);
  };

  const enviarPregunta = async (e: React.FormEvent) => {
    e.preventDefault();
    const textoPregunta = pregunta.trim();
    if (!textoPregunta || escribiendo) return;

    agregarMensaje(textoPregunta, "user");
    setPregunta("");
    setEscribiendo(true);

    try {
      const { respuesta } = await chatbotService.preguntar(textoPregunta);
      agregarMensaje(respuesta, "bot");
    } catch {
      agregarMensaje("No se pudo conectar con el servidor. Intentá de nuevo.", "bot");
    } finally {
      setEscribiendo(false);
    }
  };

  return (
    <div className="chatbot-widget">
      <button
        className={`chatbot-widget-boton ${abierto ? "chatbot-widget-boton--abierto" : ""}`}
        onClick={() => setAbierto((v) => !v)}
        aria-label={abierto ? "Cerrar chat" : "Abrir chat"}
      >
        {abierto ? (
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth={2}>
            <line x1="4" y1="4" x2="20" y2="20" />
            <line x1="20" y1="4" x2="4" y2="20" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        )}
      </button>

      {abierto && (
        <div className="chatbot-widget-ventana">
          <header className="chatbot-widget-topbar">
            <div className="chatbot-widget-brand-text">
              <h1>SYN<span className="chatbot-widget-accent">CRO</span></h1>
              <span className = "chatbot-widget-brand-name">Asistente virtual</span>
            </div>
          </header>

          <main className="chatbot-widget-chat-container" ref={chatRef}>
            <div className="chatbot-widget-chat">
              {mensajes.map((m) => (
                <div key={m.id} className={`chatbot-widget-msg chatbot-widget-msg--${m.tipo}`}>
                  <div className="chatbot-widget-bubble">{m.texto}</div>
                  <div className="chatbot-widget-timestamp">{m.hora}</div>
                </div>
              ))}
              {escribiendo && (
                <div className="chatbot-widget-msg chatbot-widget-msg--bot">
                  <div className="chatbot-widget-bubble">
                    <div className="chatbot-widget-typing"><span></span><span></span><span></span></div>
                  </div>
                </div>
              )}
            </div>
          </main>

          <footer className="chatbot-widget-input-bar">
            <form onSubmit={enviarPregunta} autoComplete="off">
              <input
                type="text"
                value={pregunta}
                onChange={(e) => setPregunta(e.target.value)}
                placeholder="Escribí tu consulta..."
                required
              />
              <button type="submit" disabled={escribiendo} aria-label="Enviar">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2}>
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
          </footer>
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;