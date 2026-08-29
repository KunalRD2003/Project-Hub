package com.kunal.project_management_system.service;

import com.kunal.project_management_system.entity.Module;
import com.kunal.project_management_system.entity.ModuleStatus;
import com.kunal.project_management_system.entity.Project;
import com.kunal.project_management_system.repository.ModuleRepository;
import com.kunal.project_management_system.repository.ProjectRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ModuleService {

    private final ModuleRepository moduleRepository;
    private final ProjectRepository projectRepository;


    public ModuleService(
            ModuleRepository moduleRepository,
            ProjectRepository projectRepository) {

        this.moduleRepository = moduleRepository;
        this.projectRepository = projectRepository;
    }


    // =====================================================
    // GET ALL MODULES
    // =====================================================

    public List<Module> getAllModules() {

        return moduleRepository.findAll();
    }


    // =====================================================
    // GET MODULE BY ID
    // =====================================================

    public Optional<Module> getModuleById(Integer id) {

        return moduleRepository.findById(id);
    }


    // =====================================================
    // GET MODULES BY STATUS
    // =====================================================

    public List<Module> getModulesByStatus(
            ModuleStatus status) {

        return moduleRepository.findByModuleStatus(status);
    }


    // =====================================================
    // GET MODULES BY PROJECT
    // =====================================================

    public List<Module> getModulesByProject(
            Integer projectId) {

        return moduleRepository.findByProject_ProjectId(
                projectId
        );
    }


    // =====================================================
    // CREATE MODULE
    // =====================================================

    public Module createModule(Module module) {

        Integer projectId = module.getProjectId();


        // -------------------------------------------------
        // Support project object also
        // -------------------------------------------------

        if (projectId == null &&
                module.getProject() != null) {

            projectId =
                    module.getProject().getProjectId();
        }


        // -------------------------------------------------
        // Project is mandatory
        // -------------------------------------------------

        if (projectId == null) {

            throw new RuntimeException(
                    "Project is required."
            );
        }


        // -------------------------------------------------
        // Find project from database
        // -------------------------------------------------

        final Integer finalProjectId = projectId;

        Project project =
                projectRepository.findById(finalProjectId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Project not found with ID: "
                                                + finalProjectId
                                )
                        );


        // -------------------------------------------------
        // Set actual Project entity
        // -------------------------------------------------

        module.setProject(project);


        // -------------------------------------------------
        // Default status
        // -------------------------------------------------

        if (module.getModuleStatus() == null) {

            module.setModuleStatus(
                    ModuleStatus.PENDING
            );
        }


        // -------------------------------------------------
        // Automatically set current timestamp
        // -------------------------------------------------

        module.setModuleStartDate(
                LocalDateTime.now()
        );


        // -------------------------------------------------
        // Save module
        // -------------------------------------------------

        return moduleRepository.save(module);
    }


    // =====================================================
    // UPDATE MODULE
    // =====================================================

    public Module updateModule(
            Integer id,
            Module module) {

        Module existingModule =
                moduleRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Module not found with ID: "
                                                + id
                                )
                        );


        // -------------------------------------------------
        // Get project ID
        // -------------------------------------------------

        Integer projectId =
                module.getProjectId();


        // -------------------------------------------------
        // Support project object also
        // -------------------------------------------------

        if (projectId == null &&
                module.getProject() != null) {

            projectId =
                    module.getProject().getProjectId();
        }


        // -------------------------------------------------
        // Project is mandatory
        // -------------------------------------------------

        if (projectId == null) {

            throw new RuntimeException(
                    "Project is required."
            );
        }


        // -------------------------------------------------
        // Find project
        // -------------------------------------------------

        final Integer finalProjectId = projectId;

        Project project =
                projectRepository.findById(finalProjectId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Project not found with ID: "
                                                + finalProjectId
                                )
                        );


        // -------------------------------------------------
        // Update project
        // -------------------------------------------------

        existingModule.setProject(project);


        // -------------------------------------------------
        // Update module name
        // -------------------------------------------------

        existingModule.setModuleName(
                module.getModuleName()
        );


        // -------------------------------------------------
        // Update description
        // -------------------------------------------------

        existingModule.setModuleDescription(
                module.getModuleDescription()
        );


        // -------------------------------------------------
        // Update status
        // -------------------------------------------------

        if (module.getModuleStatus() != null) {

            existingModule.setModuleStatus(
                    module.getModuleStatus()
            );
        }


        // -------------------------------------------------
        // DO NOT update start date
        //
        // Start date represents the original creation time.
        // -------------------------------------------------


        // -------------------------------------------------
        // Update end date
        //
        // End date is optional.
        // -------------------------------------------------

        existingModule.setModuleEndDate(
                module.getModuleEndDate()
        );


        // -------------------------------------------------
        // Save updated module
        // -------------------------------------------------

        return moduleRepository.save(
                existingModule
        );
    }


    // =====================================================
    // DELETE MODULE
    // =====================================================

    public void deleteModule(Integer id) {

        if (!moduleRepository.existsById(id)) {

            throw new RuntimeException(
                    "Module not found with ID: " + id
            );
        }


        moduleRepository.deleteById(id);
    }
}