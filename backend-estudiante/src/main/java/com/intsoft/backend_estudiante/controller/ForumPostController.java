package com.intsoft.backend_estudiante.controller;


import com.intsoft.backend_estudiante.model.ForumPost;
import com.intsoft.backend_estudiante.model.Comment;
import com.intsoft.backend_estudiante.repository.ForumPostRepository;
import com.intsoft.backend_estudiante.repository.CommentRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class ForumPostController {

    private final ForumPostRepository postRepo;
    private final CommentRepository commentRepo;

    public ForumPostController(ForumPostRepository postRepo, CommentRepository commentRepo) {
        this.postRepo = postRepo;
        this.commentRepo = commentRepo;
    }
    // ------ POSTS ------

    @GetMapping("/")
    public List<ForumPost> listar() {
        return postRepo.findAll();
    }

    @PostMapping("/")
    public ForumPost crear(@RequestBody ForumPost post) {
        return postRepo.save(post);
    }

    @DeleteMapping("/{id}/")
    public void eliminar(@PathVariable Long id) {
        postRepo.deleteById(id);
    }

    // ------ COMENTARIOS ------

    // ------ COMENTARIOS ------

    @GetMapping("/{postId}/comentarios/")
    public List<Comment> listarComentarios(@PathVariable Long postId) {
        ForumPost post = postRepo.findById(postId).orElseThrow();
        return commentRepo.findByPostOrderByCreadoEnAsc(post);
    }

    @PostMapping("/{postId}/comentarios/")
    public Comment crearComentario(
            @PathVariable Long postId,
            @RequestBody Comment comentario
    ) {
        System.out.println("💬 Nuevo comentario para post " + postId +
                " => " + comentario.getContenido());

        ForumPost post = postRepo.findById(postId).orElseThrow();
        comentario.setPost(post);
        return commentRepo.save(comentario);
    }

}

