package com.intsoft.backend_estudiante.model;


public class ChatResponse {

    // 👈 nombre EXACTO: "respuesta"
    private String respuesta;

    public ChatResponse(String respuesta) {
        this.respuesta = respuesta;
    }

    public String getRespuesta() {
        return respuesta;
    }

    public void setRespuesta(String respuesta) {
        this.respuesta = respuesta;
    }
}
