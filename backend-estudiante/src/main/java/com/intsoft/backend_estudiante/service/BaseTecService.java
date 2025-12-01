package com.intsoft.backend_estudiante.service;

import com.intsoft.backend_estudiante.model.ForumPost;
import com.intsoft.backend_estudiante.model.Group;
import com.intsoft.backend_estudiante.repository.ForumPostRepository;
import com.intsoft.backend_estudiante.repository.GroupRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class BaseTecService {

    private final GroupRepository groupRepository;
    private final ForumPostRepository forumPostRepository;
    private final AiGeneralService aiGeneralService;

    public BaseTecService(
            GroupRepository groupRepository,
            ForumPostRepository forumPostRepository,
            AiGeneralService aiGeneralService
    ) {
        this.groupRepository = groupRepository;
        this.forumPostRepository = forumPostRepository;
        this.aiGeneralService = aiGeneralService;
    }

    public String responder(String mensaje) {

        if (mensaje == null || mensaje.isBlank()) {
            return "¿Podrías escribir tu pregunta otra vez?";
        }

        String p = mensaje.toLowerCase(Locale.ROOT).trim();

        // ---------------------- SALUDO ----------------------
        if (p.contains("hola") || p.contains("buenas") || p.contains("qué tal") || p.contains("que tal")) {
            return "¡Hola! Soy la IA de Base TEC para estudiantes. Puedo ayudarte con preguntas del Proyecto Integrador, grupos y también dudas generales.";
        }

        // ---------------------- CUÁNTOS GRUPOS ----------------------
        if (p.contains("cuantos grupos") || p.contains("cuántos grupos")) {
            long total = groupRepository.count();

            if (total == 0) return "Por ahora no hay grupos registrados en el sistema.";
            if (total == 1) return "Hay 1 grupo registrado.";

            return "Hay " + total + " grupos registrados en el sistema.";
        }

        // ---------------------- INTEGRANTES DE UN GRUPO ----------------------
        if (p.contains("integrantes") && p.contains("grupo")) {

            Matcher m = Pattern.compile("grupo\\s*(\\d+)").matcher(p);
            Optional<Group> grupoOpt;

            if (m.find()) {
                grupoOpt = groupRepository.findByNumero(m.group(1));
            } else {
                List<Group> grupos = groupRepository.findAll();
                grupoOpt = grupos.isEmpty() ? Optional.empty() : Optional.of(grupos.get(0));
            }

            if (grupoOpt.isEmpty()) {
                return "No encontré información sobre ese grupo en la base de datos.";
            }

            Group g = grupoOpt.get();

            return "Los integrantes del Grupo " + g.getNumero()
                    + " (Sección " + g.getSeccion() + ") son: "
                    + g.getIntegrantes() + ".";
        }

        // ---------------------- DESCRIPCIÓN DE UN GRUPO (NUEVO) ----------------------
        if ((p.contains("descripcion") || p.contains("descripción")) && p.contains("grupo")) {

            Matcher m = Pattern.compile("grupo\\s*(\\d+)").matcher(p);
            Optional<Group> grupoOpt;

            if (m.find()) {
                grupoOpt = groupRepository.findByNumero(m.group(1));
            } else {
                List<Group> grupos = groupRepository.findAll();
                grupoOpt = grupos.isEmpty() ? Optional.empty() : Optional.of(grupos.get(0));
            }

            if (grupoOpt.isEmpty()) {
                return "No encontré información de ese grupo en la base de datos.";
            }

            Group g = grupoOpt.get();

            if (g.getDescripcion() == null || g.getDescripcion().isBlank()) {
                return "El Grupo " + g.getNumero() + " (Sección " + g.getSeccion() + ") no tiene una descripción registrada.";
            }

            return "La descripción del Grupo " + g.getNumero()
                    + " (Sección " + g.getSeccion() + ") es: "
                    + g.getDescripcion() + ".";
        }

        // ---------------------- ÚLTIMA PUBLICACIÓN ----------------------
        if (p.contains("ultima publicacion") || p.contains("última publicación")
                || p.contains("ultimo aviso") || p.contains("último aviso")) {

            Optional<ForumPost> ultimo = forumPostRepository.findTopByOrderByCreadoEnDesc();

            if (ultimo.isEmpty()) {
                return "Todavía no hay publicaciones en ForoTEC.";
            }

            ForumPost post = ultimo.get();

            return "La última publicación en ForoTEC se titula \"" + post.getTitulo()
                    + "\" y fue escrita por " + post.getAutor()
                    + ". El contenido dice: " + post.getContenido();
        }

        // ---------------------- SI NO COINCIDE → OPENAI ----------------------
        return aiGeneralService.responder(mensaje);
    }
}

