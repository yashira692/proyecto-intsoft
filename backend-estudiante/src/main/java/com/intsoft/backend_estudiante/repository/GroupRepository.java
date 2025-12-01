package com.intsoft.backend_estudiante.repository;


import com.intsoft.backend_estudiante.model.Group;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GroupRepository extends JpaRepository<Group, Long> {
    Optional<Group> findByNumero(String numero);

}

