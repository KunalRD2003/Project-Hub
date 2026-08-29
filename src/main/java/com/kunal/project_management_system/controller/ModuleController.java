package com.kunal.project_management_system.controller;

import com.kunal.project_management_system.entity.Module;
import com.kunal.project_management_system.entity.ModuleStatus;
import com.kunal.project_management_system.service.ModuleService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/modules")
@CrossOrigin(origins = "http://localhost:5173")
public class ModuleController {

    private final ModuleService moduleService;


    public ModuleController(
            ModuleService moduleService) {

        this.moduleService = moduleService;
    }


    // =====================================================
    // GET ALL MODULES
    // =====================================================

    @GetMapping
    public ResponseEntity<List<Module>> getAllModules() {

        return ResponseEntity.ok(
                moduleService.getAllModules()
        );
    }


    // =====================================================
    // GET MODULE BY ID
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getModuleById(
            @PathVariable Integer id) {

        return moduleService
                .getModuleById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity
                                .notFound()
                                .build()
                );
    }


    // =====================================================
    // GET MODULES BY STATUS
    // =====================================================

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Module>> getModulesByStatus(
            @PathVariable ModuleStatus status) {

        return ResponseEntity.ok(
                moduleService.getModulesByStatus(
                        status
                )
        );
    }


    // =====================================================
    // GET MODULES BY PROJECT
    // =====================================================

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Module>> getModulesByProject(
            @PathVariable Integer projectId) {

        return ResponseEntity.ok(
                moduleService.getModulesByProject(
                        projectId
                )
        );
    }


    // =====================================================
    // CREATE MODULE
    // =====================================================

    @PostMapping
    public ResponseEntity<?> createModule(
            @RequestBody Module module) {

        try {

            Module savedModule =
                    moduleService.createModule(
                            module
                    );

            return ResponseEntity.ok(
                    savedModule
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =====================================================
    // UPDATE MODULE
    // =====================================================

    @PutMapping("/{id}")
    public ResponseEntity<?> updateModule(
            @PathVariable Integer id,
            @RequestBody Module module) {

        try {

            Module updatedModule =
                    moduleService.updateModule(
                            id,
                            module
                    );

            return ResponseEntity.ok(
                    updatedModule
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =====================================================
    // DELETE MODULE
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteModule(
            @PathVariable Integer id) {

        try {

            moduleService.deleteModule(id);

            return ResponseEntity.ok(
                    "Module deleted successfully"
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}