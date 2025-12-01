package com.intsoft.backend_estudiante.controller;

import com.intsoft.backend_estudiante.model.ChatRequest;
import com.intsoft.backend_estudiante.model.ChatResponse;
import com.intsoft.backend_estudiante.service.BaseTecService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/basetec")
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174" })
public class BaseTecController {

    private final BaseTecService baseTecService;

    public BaseTecController(BaseTecService baseTecService) {
        this.baseTecService = baseTecService;
    }

    @PostMapping("/chat")
    public ChatResponse chat(@RequestBody ChatRequest request) {
        System.out.println("💬 [BaseTecController] llegó mensaje: " + request.getMensaje());
        String respuesta = baseTecService.responder(request.getMensaje());
        System.out.println("🤖 [BaseTecController] respondiendo: " + respuesta);
        return new ChatResponse(respuesta);
    }
}
