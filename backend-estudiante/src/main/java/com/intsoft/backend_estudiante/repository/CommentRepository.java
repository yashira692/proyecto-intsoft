package com.intsoft.backend_estudiante.repository;


import com.intsoft.backend_estudiante.model.Comment;
import com.intsoft.backend_estudiante.model.ForumPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPostOrderByCreadoEnAsc(ForumPost post);
}

