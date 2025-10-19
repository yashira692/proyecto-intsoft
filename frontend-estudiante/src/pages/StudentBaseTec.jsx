import { useState, useEffect, useRef } from "react";
import "./StudentBaseTec.css";

// 🔹 1) URL del backend Spring Boot (sin guion y sin slash final)
const CHAT_API_URL = "http://127.0.0.1:8080/api/basetec/chat";

function StudentBaseTec() {
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text:
        "¡Hola! Soy Base TEC " +
        "Pregúntame sobre el proyecto integrador, docentes o procesos académicos.",
    },
  ]);
  const [input, setInput] = useState("");
  const [enviando, setEnviando] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    const pregunta = input.trim();
    if (!pregunta || enviando) return;

    const userMsg = { from: "user", text: pregunta };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setEnviando(true);

    try {
      const res = await fetch(CHAT_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // 🔹 2) El backend espera un campo llamado "mensaje"
        body: JSON.stringify({ mensaje: pregunta }),
      });

      let replyText =
        "Lo siento, hubo un problema al responder tu pregunta.";

      if (res.ok) {
        const data = await res.json();
        // 🔹 3) El backend responde con { respuesta: "texto..." }
        replyText = data.respuesta || replyText;
      }

      const botMsg = { from: "bot", text: replyText };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text:
            "No pude contactar al servidor de Base TEC. " +
            "Verifica que el backend de estudiantes (Spring Boot) esté ejecutándose en http://127.0.0.1:8080.",
        },
      ]);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="basetec-page">
      <div className="basetec-card">
        <h1>Base TEC</h1>
        <p className="basetec-desc">
          Haz tus consultas sobre TECSUP y el Proyecto Integrador.
        </p>

        <div className="basetec-chat-window">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={
                m.from === "user"
                  ? "chat-message chat-user"
                  : "chat-message chat-bot"
              }
            >
              <p>{m.text}</p>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <form className="basetec-input-area" onSubmit={handleSend}>
          <input
            type="text"
            placeholder="Escribe tu pregunta..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" disabled={enviando}>
            {enviando ? "Enviando..." : "Enviar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default StudentBaseTec;
