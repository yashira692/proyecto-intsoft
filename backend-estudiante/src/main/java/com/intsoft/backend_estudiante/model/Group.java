package com.intsoft.backend_estudiante.model;


import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "core_group")   // 'group' es palabra reservada, por eso 'groups'
public class Group {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String numero;
    private String seccion;

    @Column(columnDefinition = "TEXT")
    private String integrantes;

    private String tema;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    private LocalDateTime creadoEn = LocalDateTime.now();

    // GETTERS Y SETTERS
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }

    public String getSeccion() { return seccion; }
    public void setSeccion(String seccion) { this.seccion = seccion; }

    public String getIntegrantes() { return integrantes; }
    public void setIntegrantes(String integrantes) { this.integrantes = integrantes; }

    public String getTema() { return tema; }
    public void setTema(String tema) { this.tema = tema; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public LocalDateTime getCreadoEn() { return creadoEn; }
    public void setCreadoEn(LocalDateTime creadoEn) { this.creadoEn = creadoEn; }
}
