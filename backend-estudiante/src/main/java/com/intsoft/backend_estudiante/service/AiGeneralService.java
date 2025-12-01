package com.intsoft.backend_estudiante.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.intsoft.backend_estudiante.model.Group;
import com.intsoft.backend_estudiante.repository.GroupRepository;
import okhttp3.*;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AiGeneralService {

    private static final String OPENAI_URL = "https://api.openai.com/v1/chat/completions";
    private static final String MODEL = "gpt-4o-mini";  // modelo barato y bueno

    private final OkHttpClient client = new OkHttpClient();
    private final ObjectMapper mapper = new ObjectMapper();
    private final String apiKey;
    private final GroupRepository groupRepository;

    // Spring inyecta el GroupRepository aquí
    public AiGeneralService(GroupRepository groupRepository) {
        this.groupRepository = groupRepository;

        this.apiKey = System.getenv("OPENAI_API_KEY");
        if (this.apiKey == null || this.apiKey.isBlank()) {
            throw new IllegalStateException(
                    "OPENAI_API_KEY no está definida en las variables de entorno"
            );
        }
    }

    /**
     * Método principal que usará tu controlador.
     * Aplica reglas especiales (grupos, secciones, etc.)
     * y si no aplica ninguna, llama a OpenAI normalmente.
     */
    public String responder(String mensajeUsuario) {
        String lower = mensajeUsuario.toLowerCase();

        // 1) PREGUNTAS: ¿cuántos grupos hay?
        if (lower.contains("cuantos grupos") || lower.contains("cuántos grupos")) {
            long total = groupRepository.count();
            return "Hay " + total + " grupos registrados en el sistema.";
        }

        // 2) PREGUNTAS: ¿de qué secciones? / ¿qué secciones hay?
        if (lower.contains("secciones") || lower.contains("seccion") || lower.contains("sección")) {
            List<Group> grupos = groupRepository.findAll();

            if (grupos.isEmpty()) {
                return "No hay grupos registrados todavía en el sistema.";
            }

            // Agrupamos por sección (A, B, C, ...)
            Map<String, List<Group>> porSeccion = grupos.stream()
                    .collect(Collectors.groupingBy(
                            g -> g.getSeccion() == null
                                    ? "SIN_SECCION"
                                    : g.getSeccion().toUpperCase()
                    ));

            StringBuilder sb = new StringBuilder();
            sb.append("Hay ").append(porSeccion.size())
              .append(" secciones registradas:\n\n");

            List<String> seccionesOrdenadas = new ArrayList<>(porSeccion.keySet());
            Collections.sort(seccionesOrdenadas);

            int i = 1;
            for (String seccion : seccionesOrdenadas) {
                sb.append(i++).append(". Sección ")
                  .append(seccion.replace("SIN_SECCION", "(sin sección)"))
                  .append(":\n");

                for (Group g : porSeccion.get(seccion)) {
                    sb.append("   - Grupo ")
                      .append(g.getNumero())
                      .append(", tema '")
                      .append(g.getTema() == null ? "(sin tema)" : g.getTema())
                      .append("', integrantes: ")
                      .append(g.getIntegrantes() == null ? "(sin integrantes)" : g.getIntegrantes())
                      .append(".\n");
                }
                sb.append("\n");
            }

            return sb.toString();
        }

        // 3) Cualquier otra pregunta → OpenAI normal
        return preguntarIA(mensajeUsuario);
    }

    /**
     * Llamada “cruda” a OpenAI (solo la usa el método responder).
     */
    private String preguntarIA(String mensajeUsuario) {
        try {
            // Construir JSON del request
            String jsonBody = """
                {
                  "model": "%s",
                  "messages": [
                    {
                      "role": "system",
                      "content": "Eres un asistente para estudiantes de TECSUP. Responde en español, de forma clara y corta."
                    },
                    {
                      "role": "user",
                      "content": %s
                    }
                  ]
                }
                """.formatted(
                    MODEL,
                    mapper.writeValueAsString(mensajeUsuario) // escapa bien el texto
            );

            RequestBody body = RequestBody.create(
                    jsonBody,
                    MediaType.parse("application/json")
            );

            Request request = new Request.Builder()
                    .url(OPENAI_URL)
                    .header("Authorization", "Bearer " + apiKey)
                    .post(body)
                    .build();

            try (Response response = client.newCall(request).execute()) {
                if (!response.isSuccessful()) {
                    return "La IA no pudo responder en este momento (error " + response.code() + ").";
                }

                String responseBody = response.body().string();

                JsonNode root = mapper.readTree(responseBody);
                JsonNode choices = root.path("choices");
                if (choices.isArray() && choices.size() > 0) {
                    return choices.get(0)
                            .path("message")
                            .path("content")
                            .asText();
                }

                return "No pude entender la respuesta de la IA.";
            }

        } catch (IOException e) {
            e.printStackTrace();
            return "Ocurrió un error al contactar con la IA.";
        }
    }
}
