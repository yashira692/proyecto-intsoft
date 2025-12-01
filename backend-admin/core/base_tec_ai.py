import os
from dotenv import load_dotenv
from openai import OpenAI

# Cargar variables de entorno (para OPENAI_API_KEY)
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def generar_respuesta_tecsup(pregunta: str, contexto_grupos: str | None = None) -> str:
    """
    Llamada al modelo de OpenAI.

    Ahora la IA puede responder de CUALQUIER tema.
    Si se pasa contexto_grupos, la IA puede usar esos datos
    para responder mejor sobre grupos y secciones, pero no está
    limitada solo a eso.
    """
    messages = [
        {
            "role": "system",
            "content": (
                "Eres un asistente de inteligencia artificial útil y amigable. "
                "Puedes responder preguntas de cualquier tema: tecnología, estudios, "
                "vida diaria, programación, ciencia, entretenimiento, etc. "
                "A veces se te puede enviar información estructurada sobre grupos, "
                "secciones o proyectos; si recibes esa información, ÚSALA como contexto "
                "para responder con más precisión sobre esos grupos, pero no estás "
                "limitado únicamente a ese tema."
            ),
        }
    ]

    if contexto_grupos:
        messages.append(
            {
                "role": "system",
                "content": (
                    "Información contextual sobre grupos y secciones que puedes usar "
                    "si es relevante para la pregunta del usuario:\n"
                    + contexto_grupos
                ),
            }
        )

    messages.append({"role": "user", "content": pregunta})

    respuesta = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        max_tokens=350,
        temperature=0.6,
    )

    return respuesta.choices[0].message.content

import json

def extraer_datos_grupo(texto: str) -> dict:
    """
    Usa la IA para extraer numero, seccion, integrantes, tema y descripcion
    desde una frase hablada.
    Devuelve un dict con esos campos.
    """
    messages = [
        {
            "role": "system",
            "content": (
                "Eres un asistente que EXTRAe datos para crear grupos de proyecto. "
                "El usuario hablará en lenguaje natural, por ejemplo: "
                "'grupo 3 de la seccion B, integrantes Juan y Ana, tema app movil, "
                "descripcion app para controlar gastos'. "
                "Tu ÚNICA salida debe ser un JSON válido (sin texto extra) con esta forma:\n"
                "{\n"
                '  \"numero\": 3,\n'
                '  \"seccion\": \"B\",\n'
                '  \"integrantes\": \"Juan, Ana\",\n'
                '  \"tema\": \"App móvil\",\n'
                '  \"descripcion\": \"App para controlar gastos\"\n'
                "}\n"
                "No expliques nada, no uses markdown, SOLO devuelve el JSON."
            ),
        },
        {"role": "user", "content": texto},
    ]

    respuesta = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        max_tokens=200,
        temperature=0.2,
    )

    contenido = respuesta.choices[0].message.content.strip()

    # Por si el modelo llegara a envolverlo en ```json … ```
    if contenido.startswith("```"):
        contenido = contenido.strip("`")
        if "json" in contenido[:10].lower():
            contenido = contenido[contenido.find("{") : contenido.rfind("}") + 1]

    data = json.loads(contenido)
    return data
