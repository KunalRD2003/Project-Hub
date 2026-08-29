package com.kunal.project_management_system.controller;

import com.kunal.project_management_system.entity.Requirement;
import com.kunal.project_management_system.entity.RequirementPriority;
import com.kunal.project_management_system.entity.RequirementStatus;
import com.kunal.project_management_system.service.RequirementService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requirements")
@CrossOrigin(origins = "http://localhost:5173")
public class RequirementController {

    private final RequirementService requirementService;


    public RequirementController(
            RequirementService requirementService) {

        this.requirementService = requirementService;
    }


    // =====================================================
    // GET ALL REQUIREMENTS
    // =====================================================

    @GetMapping
    public ResponseEntity<List<Requirement>> getAllRequirements() {

        return ResponseEntity.ok(
                requirementService.getAllRequirements()
        );
    }


    // =====================================================
    // GET REQUIREMENT BY ID
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getRequirementById(
            @PathVariable Integer id) {

        return requirementService
                .getRequirementById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity
                                .notFound()
                                .build()
                );
    }


    // =====================================================
    // GET REQUIREMENTS BY PRIORITY
    // =====================================================

    @GetMapping("/priority/{priority}")
    public ResponseEntity<List<Requirement>>
    getRequirementsByPriority(
            @PathVariable RequirementPriority priority) {

        return ResponseEntity.ok(
                requirementService
                        .getRequirementsByPriority(priority)
        );
    }


    // =====================================================
    // GET REQUIREMENTS BY STATUS
    // =====================================================

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Requirement>>
    getRequirementsByStatus(
            @PathVariable RequirementStatus status) {

        return ResponseEntity.ok(
                requirementService
                        .getRequirementsByStatus(status)
        );
    }


    // =====================================================
    // GET REQUIREMENTS BY MODULE
    // =====================================================

    @GetMapping("/module/{moduleId}")
    public ResponseEntity<List<Requirement>>
    getRequirementsByModule(
            @PathVariable Integer moduleId) {

        return ResponseEntity.ok(
                requirementService
                        .getRequirementsByModule(moduleId)
        );
    }


    // =====================================================
    // CREATE REQUIREMENT
    // =====================================================

    @PostMapping
    public ResponseEntity<?> createRequirement(
            @RequestBody Requirement requirement) {

        try {

            Requirement savedRequirement =
                    requirementService.createRequirement(
                            requirement
                    );

            return ResponseEntity.ok(
                    savedRequirement
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =====================================================
    // UPDATE REQUIREMENT
    // =====================================================

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRequirement(
            @PathVariable Integer id,
            @RequestBody Requirement requirement) {

        try {

            Requirement updatedRequirement =
                    requirementService.updateRequirement(
                            id,
                            requirement
                    );

            return ResponseEntity.ok(
                    updatedRequirement
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =====================================================
    // DELETE REQUIREMENT
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRequirement(
            @PathVariable Integer id) {

        try {

            requirementService.deleteRequirement(id);

            return ResponseEntity.ok(
                    "Requirement deleted successfully"
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}