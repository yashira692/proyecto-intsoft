package com.intsoft.backend_estudiante.controller;

import com.intsoft.backend_estudiante.service.AiGeneralService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*") // Permite llamadas del frontend
public class AiGeneralController {

    private final AiGeneralService aiGeneralService;

    public AiGeneralController(AiGeneralService aiGeneralService) {
        this.aiGeneralService = aiGeneralService;
    }

    @PostMapping("/chat")
    public Map<String, String> chat(@RequestBody Map<String, String> body) {

        String mensajeUsuario = body.get("mensaje");
        if (mensajeUsuario == null || mensajeUsuario.isBlank()) {
            return Map.of("respuesta", "No recibí ninguna pregunta.");
        }

        // 🔥 ESTA ES LA LLAMADA IMPORTANTE
        String respuesta = aiGeneralService.responder(mensajeUsuario);

        return Map.of("respuesta", respuesta);
    }
}
