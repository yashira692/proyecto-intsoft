import { useState } from "react";

const VOICE_API_URL = "http://127.0.0.1:8000/api/voice-group/";

const VoiceAddGroupBubble = ({ onNewGroup }) => {
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUserText, setLastUserText] = useState("");
  const [error, setError] = useState("");
  const [statusText, setStatusText] = useState("Bot listo (clic para empezar)");

  console.log("✅ VoiceAddGroupBubble se está renderizando");

  const speak = (texto, onEnd) => {
    console.log("🔊 speak() llamado con:", texto);

    if (!texto) return;

    if (!window.speechSynthesis) {
      alert("Tu navegador no soporta síntesis de voz (speechSynthesis)");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = "es-ES";
    if (onEnd) {
      utterance.onend = onEnd;
    }
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    console.log("🎧 startListening() llamado");

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Tu navegador no soporta reconocimiento de voz");
      return;
    }

    setError("");
    setLastUserText("");
    setIsListening(true);
    setStatusText("Escuchando... habla ahora");

    const recognition = new SpeechRecognition();
    recognition.lang = "es-ES";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("🎙 Texto reconocido:", transcript);
      setLastUserText(transcript);
      setStatusText("Procesando lo que dijiste...");
      sendToBackend(transcript);
    };

    recognition.onerror = (e) => {
      console.error("❌ Error en reconocimiento:", e);
      setError("Error al escuchar tu voz.");
      setIsListening(false);
      setStatusText("Error al escuchar");
    };

    recognition.onend = () => {
      console.log("🎧 Reconocimiento terminó");
      setIsListening(false);
      if (!isLoading) setStatusText("Bot listo (clic para otro grupo)");
    };

    recognition.start();
  };

  const sendToBackend = async (message) => {
    try {
      console.log("📤 Enviando al backend:", message);
      setIsLoading(true);

      const res = await fetch(VOICE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) {
        console.error("❌ Respuesta no OK:", res.status);
        throw new Error("Error en la API de voz");
      }

      const newGroup = await res.json();
      console.log("✅ Grupo creado desde backend:", newGroup);

      speak(
        `Listo, registré el grupo ${newGroup.numero} de la sección ${newGroup.seccion}.`
      );

      if (onNewGroup) {
        onNewGroup(newGroup);
      }

      setStatusText("Grupo creado. Clic para otro.");
    } catch (err) {
      console.error("❌ Error al crear grupo por voz:", err);
      setError("Error al crear el grupo desde la voz.");
      setStatusText("Error al crear grupo");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    console.log("🖱 Click en la burbuja");
    setStatusText("Hablando el bot...");

    const saludo =
      "Hola, soy tu asistente para registrar grupos. " +
      "Cuando yo termine de hablar, dime en una sola frase: " +
      "el número de grupo, la sección, los integrantes, el tema y la descripción.";

    // 1. Habla
    speak(saludo, () => {
      // 2. Cuando termina de hablar → empieza a escucharte
      startListening();
    });
  };

  return (
    <>
      {/* Burbuja flotante */}
      <button
        onClick={handleClick}
        disabled={isListening || isLoading}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          border: "none",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          cursor: "pointer",
          fontSize: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: isListening ? "#ffcc00" : "#0ea5e9",
          color: "white",
          zIndex: 9999,
        }}
        title="Agregar grupo por voz"
      >
        {isLoading ? "…" : "🎤"}
      </button>

      {/* Panel de estado para que veas qué está haciendo */}
      <div
        style={{
          position: "fixed",
          bottom: "90px",
          right: "20px",
          maxWidth: "300px",
          padding: "10px",
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          fontSize: "12px",
          zIndex: 9998,
        }}
      >
        <p>
          <strong>Estado:</strong> {statusText}
        </p>
        {lastUserText && (
          <p>
            <strong>Tú dijiste:</strong> {lastUserText}
          </p>
        )}
        {error && (
          <p style={{ color: "red" }}>
            <strong>Error:</strong> {error}
          </p>
        )}
      </div>
    </>
  );
};

export default VoiceAddGroupBubble;
