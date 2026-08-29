package com.kunal.project_management_system.controller;

import com.kunal.project_management_system.entity.Project;
import com.kunal.project_management_system.entity.ProjectStatus;
import com.kunal.project_management_system.service.ProjectService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "http://localhost:5173")
public class ProjectController {

    private final ProjectService projectService;


    public ProjectController(
            ProjectService projectService) {

        this.projectService = projectService;
    }


    // =====================================================
    // GET ALL PROJECTS
    // =====================================================

    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects() {

        return ResponseEntity.ok(
                projectService.getAllProjects()
        );
    }


    // =====================================================
    // GET PROJECT BY ID
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getProjectById(
            @PathVariable Integer id) {

        return projectService
                .getProjectById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity
                                .notFound()
                                .build()
                );
    }


    // =====================================================
    // GET PROJECTS BY STATUS
    // =====================================================

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Project>> getProjectsByStatus(
            @PathVariable ProjectStatus status) {

        return ResponseEntity.ok(
                projectService.getProjectsByStatus(
                        status
                )
        );
    }


    // =====================================================
    // GET PROJECTS BY CLIENT
    // =====================================================

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<Project>> getProjectsByClient(
            @PathVariable Integer clientId) {

        return ResponseEntity.ok(
                projectService.getProjectsByClient(
                        clientId
                )
        );
    }


    // =====================================================
    // CREATE PROJECT
    // =====================================================

    @PostMapping
    public ResponseEntity<?> createProject(
            @RequestBody Project project) {

        try {

            Project savedProject =
                    projectService.createProject(
                            project
                    );

            return ResponseEntity.ok(
                    savedProject
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =====================================================
    // UPDATE PROJECT
    // =====================================================

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProject(
            @PathVariable Integer id,
            @RequestBody Project project) {

        try {

            Project updatedProject =
                    projectService.updateProject(
                            id,
                            project
                    );

            return ResponseEntity.ok(
                    updatedProject
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =====================================================
    // DELETE PROJECT
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(
            @PathVariable Integer id) {

        try {

            projectService.deleteProject(id);

            return ResponseEntity.ok(
                    "Project deleted successfully"
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}