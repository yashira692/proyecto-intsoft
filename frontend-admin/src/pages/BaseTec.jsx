import { useState, useEffect, useRef } from "react";
import "./BaseTec.css";
import AdminLayout from "../layouts/AdminLayout";

const CHAT_API_URL = "http://127.0.0.1:8000/api/base-tec/chat/";

function BaseTec() {
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text:
        "¡Hola! Soy Base TEC, tu asistente sobre TECSUP. Pregúntame sobre carreras, proyecto integrador, docentes o procesos académicos.",
    },
  ]);
  const [input, setInput] = useState("");
  const [enviando, setEnviando] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: pregunta }),
      });

      let replyText = "Lo siento, hubo un problema al responder tu pregunta.";

      if (res.ok) {
        const data = await res.json();
        replyText = data.reply || replyText;
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
            "No pude contactar al servidor de Base TEC. Verifica que el backend esté ejecutándose.",
        },
      ]);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <AdminLayout>
      <div className="basetec-page grupos-page">
        {/* 👇 MISMA CARD QUE EN GRUPOS */}
        <div className="grupos-card basetec-card">
          {/* Header igual estilo que grupos */}
          <div className="grupos-header">
            <div>
              <h2>Base TEC</h2>
              <p>Asistente de IA especializado en TECSUP</p>
            </div>
          </div>

          {/* CHAT */}
          <div className="basetec-chat">
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

          {/* INPUT */}
          <form className="basetec-input-area" onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Escribe tu pregunta sobre TECSUP..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" disabled={enviando}>
              {enviando ? "Enviando..." : "Enviar"}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}

export default BaseTec;
