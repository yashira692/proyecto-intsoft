package com.intsoft.backend_estudiante.repository;


import com.intsoft.backend_estudiante.model.ForumPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ForumPostRepository extends JpaRepository<ForumPost, Long> {
    Optional<ForumPost> findTopByOrderByCreadoEnDesc();

}
