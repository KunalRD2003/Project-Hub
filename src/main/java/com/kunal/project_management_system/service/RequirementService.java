package com.kunal.project_management_system.service;

import com.kunal.project_management_system.entity.Module;
import com.kunal.project_management_system.entity.Requirement;
import com.kunal.project_management_system.entity.RequirementPriority;
import com.kunal.project_management_system.entity.RequirementStatus;
import com.kunal.project_management_system.repository.ModuleRepository;
import com.kunal.project_management_system.repository.RequirementRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class RequirementService {

    private final RequirementRepository requirementRepository;

    private final ModuleRepository moduleRepository;


    public RequirementService(
            RequirementRepository requirementRepository,
            ModuleRepository moduleRepository) {

        this.requirementRepository = requirementRepository;
        this.moduleRepository = moduleRepository;
    }


    // =====================================================
    // GET ALL REQUIREMENTS
    // =====================================================

    public List<Requirement> getAllRequirements() {

        return requirementRepository.findAll();
    }


    // =====================================================
    // GET REQUIREMENT BY ID
    // =====================================================

    public Optional<Requirement> getRequirementById(
            Integer id) {

        return requirementRepository.findById(id);
    }


    // =====================================================
    // GET REQUIREMENTS BY PRIORITY
    // =====================================================

    public List<Requirement> getRequirementsByPriority(
            RequirementPriority priority) {

        return requirementRepository
                .findByRequirementPriority(priority);
    }


    // =====================================================
    // GET REQUIREMENTS BY STATUS
    // =====================================================

    public List<Requirement> getRequirementsByStatus(
            RequirementStatus status) {

        return requirementRepository
                .findByRequirementStatus(status);
    }


    // =====================================================
    // GET REQUIREMENTS BY MODULE
    // =====================================================

    public List<Requirement> getRequirementsByModule(
            Integer moduleId) {

        return requirementRepository
                .findByModule_ModuleId(moduleId);
    }


    // =====================================================
    // CREATE REQUIREMENT
    // =====================================================

    public Requirement createRequirement(
            Requirement requirement) {

        Integer moduleId =
                requirement.getModuleId();


        // -------------------------------------------------
        // Support module object also
        // -------------------------------------------------

        if (moduleId == null &&
                requirement.getModule() != null) {

            moduleId =
                    requirement
                            .getModule()
                            .getModuleId();
        }


        // -------------------------------------------------
        // Module is mandatory
        // -------------------------------------------------

        if (moduleId == null) {

            throw new RuntimeException(
                    "Module is required."
            );
        }


        // -------------------------------------------------
        // Find module from database
        // -------------------------------------------------

        final Integer finalModuleId =
                moduleId;

        Module module =
                moduleRepository
                        .findById(finalModuleId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Module not found with ID: "
                                                + finalModuleId
                                )
                        );


        // -------------------------------------------------
        // Set actual Module entity
        // -------------------------------------------------

        requirement.setModule(module);


        // -------------------------------------------------
        // Default priority
        // -------------------------------------------------

        if (requirement.getRequirementPriority()
                == null) {

            requirement.setRequirementPriority(
                    RequirementPriority.MEDIUM
            );
        }


        // -------------------------------------------------
        // Default status
        // -------------------------------------------------

        if (requirement.getRequirementStatus()
                == null) {

            requirement.setRequirementStatus(
                    RequirementStatus.NEW
            );
        }


        // -------------------------------------------------
        // Automatically set current timestamp
        // -------------------------------------------------

        requirement.setRequirementOnDate(
                LocalDateTime.now()
        );


        // -------------------------------------------------
        // Save requirement
        // -------------------------------------------------

        return requirementRepository.save(
                requirement
        );
    }


    // =====================================================
    // UPDATE REQUIREMENT
    // =====================================================

    public Requirement updateRequirement(
            Integer id,
            Requirement requirement) {

        Requirement existingRequirement =
                requirementRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Requirement not found with ID: "
                                                + id
                                )
                        );


        // -------------------------------------------------
        // Get module ID
        // -------------------------------------------------

        Integer moduleId =
                requirement.getModuleId();


        // -------------------------------------------------
        // Support module object also
        // -------------------------------------------------

        if (moduleId == null &&
                requirement.getModule() != null) {

            moduleId =
                    requirement
                            .getModule()
                            .getModuleId();
        }


        // -------------------------------------------------
        // Module is mandatory
        // -------------------------------------------------

        if (moduleId == null) {

            throw new RuntimeException(
                    "Module is required."
            );
        }


        // -------------------------------------------------
        // Find module
        // -------------------------------------------------

        final Integer finalModuleId =
                moduleId;

        Module module =
                moduleRepository
                        .findById(finalModuleId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Module not found with ID: "
                                                + finalModuleId
                                )
                        );


        // -------------------------------------------------
        // Update module
        // -------------------------------------------------

        existingRequirement.setModule(
                module
        );


        // -------------------------------------------------
        // Update title
        // -------------------------------------------------

        existingRequirement.setRequirementTitle(
                requirement.getRequirementTitle()
        );


        // -------------------------------------------------
        // Update description
        // -------------------------------------------------

        existingRequirement.setRequirementDescription(
                requirement.getRequirementDescription()
        );


        // -------------------------------------------------
        // Update priority
        // -------------------------------------------------

        if (requirement.getRequirementPriority()
                != null) {

            existingRequirement.setRequirementPriority(
                    requirement.getRequirementPriority()
            );
        }


        // -------------------------------------------------
        // Update status
        // -------------------------------------------------

        if (requirement.getRequirementStatus()
                != null) {

            existingRequirement.setRequirementStatus(
                    requirement.getRequirementStatus()
            );
        }


        // -------------------------------------------------
        // DO NOT UPDATE ON DATE
        //
        // requirementOnDate represents the
        // original creation timestamp.
        // -------------------------------------------------


        // -------------------------------------------------
        // Save updated requirement
        // -------------------------------------------------

        return requirementRepository.save(
                existingRequirement
        );
    }


    // =====================================================
    // DELETE REQUIREMENT
    // =====================================================

    public void deleteRequirement(
            Integer id) {

        if (!requirementRepository.existsById(id)) {

            throw new RuntimeException(
                    "Requirement not found with ID: "
                            + id
            );
        }


        requirementRepository.deleteById(id);
    }
}