package com.intsoft.backend_estudiante.controller;


import com.intsoft.backend_estudiante.model.Group;
import com.intsoft.backend_estudiante.repository.GroupRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grupos")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class GroupController {

    private final GroupRepository groupRepository;

    public GroupController(GroupRepository groupRepository) {
        this.groupRepository = groupRepository;
    }

    @GetMapping("/")
    public List<Group> listar() {
        return groupRepository.findAll();
    }

    @PostMapping("/")
    public Group crear(@RequestBody Group group) {
        return groupRepository.save(group);
    }

    @PutMapping("/{id}/")
    public Group actualizar(@PathVariable Long id, @RequestBody Group group) {
        group.setId(id);
        return groupRepository.save(group);
    }

    @DeleteMapping("/{id}/")
    public void eliminar(@PathVariable Long id) {
        groupRepository.deleteById(id);
    }
}
