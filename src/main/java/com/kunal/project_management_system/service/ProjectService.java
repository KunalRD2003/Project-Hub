package com.kunal.project_management_system.service;

import com.kunal.project_management_system.entity.Client;
import com.kunal.project_management_system.entity.Project;
import com.kunal.project_management_system.entity.ProjectStatus;
import com.kunal.project_management_system.repository.ClientRepository;
import com.kunal.project_management_system.repository.ProjectRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ClientRepository clientRepository;

    public ProjectService(
            ProjectRepository projectRepository,
            ClientRepository clientRepository) {

        this.projectRepository = projectRepository;
        this.clientRepository = clientRepository;
    }

    // =====================================================
    // GET ALL PROJECTS
    // =====================================================

    public List<Project> getAllProjects() {

        return projectRepository.findAll();
    }

    // =====================================================
    // GET PROJECT BY ID
    // =====================================================

    public Optional<Project> getProjectById(Integer id) {

        return projectRepository.findById(id);
    }

    // =====================================================
    // GET PROJECTS BY STATUS
    // =====================================================

    public List<Project> getProjectsByStatus(
            ProjectStatus status) {

        return projectRepository.findByProjectStatus(status);
    }

    // =====================================================
    // GET PROJECTS BY CLIENT
    // =====================================================

    public List<Project> getProjectsByClient(
            Integer clientId) {

        return projectRepository.findByClient_ClientId(clientId);
    }

    // =====================================================
    // CREATE PROJECT
    // =====================================================

    public Project createProject(Project project) {

        /*
         * Get client ID from transient clientId.
         */
        Integer clientId = project.getClientId();

        /*
         * If clientId is not provided,
         * try to get it from client object.
         */
        if (clientId == null && project.getClient() != null) {

            clientId = project.getClient().getClientId();
        }

        /*
         * Client is mandatory.
         */
        if (clientId == null) {

            throw new RuntimeException(
                    "Client is required."
            );
        }

        /*
         * IMPORTANT:
         * Create a final variable because clientId
         * was modified above.
         *
         * This fixes:
         * "Local variable clientId must be final or
         * effectively final"
         */
        final Integer finalClientId = clientId;

        /*
         * Find client from database.
         */
        Client client = clientRepository
                .findById(finalClientId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Client not found with ID: "
                                        + finalClientId
                        )
                );

        /*
         * Set actual Client entity.
         */
        project.setClient(client);

        /*
         * Start date is automatically generated.
         *
         * React does NOT need to send it.
         */
        project.setProjectStartDate(
                LocalDateTime.now()
        );

        /*
         * Default project status.
         */
        if (project.getProjectStatus() == null) {

            project.setProjectStatus(
                    ProjectStatus.PENDING
            );
        }

        /*
         * End date is OPTIONAL.
         *
         * We do not set it here.
         */
        return projectRepository.save(project);
    }

    // =====================================================
    // UPDATE PROJECT
    // =====================================================

    public Project updateProject(
            Integer id,
            Project project) {

        /*
         * Find existing project.
         */
        Project existingProject =
                projectRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Project not found with ID: "
                                                + id
                                )
                        );

        /*
         * Get client ID.
         */
        Integer clientId = project.getClientId();

        /*
         * Support client object also.
         */
        if (clientId == null &&
                project.getClient() != null) {

            clientId =
                    project.getClient().getClientId();
        }

        /*
         * Client is mandatory.
         */
        if (clientId == null) {

            throw new RuntimeException(
                    "Client is required."
            );
        }

        /*
         * Make final variable.
         *
         * This fixes the compilation problem.
         */
        final Integer finalClientId = clientId;

        /*
         * Find client.
         */
        Client client =
                clientRepository
                        .findById(finalClientId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Client not found with ID: "
                                                + finalClientId
                                )
                        );

        /*
         * Update client.
         */
        existingProject.setClient(client);

        /*
         * Update project name.
         */
        existingProject.setProjectName(
                project.getProjectName()
        );

        /*
         * Update description.
         */
        existingProject.setProjectDescription(
                project.getProjectDescription()
        );

        /*
         * Update status.
         */
        if (project.getProjectStatus() != null) {

            existingProject.setProjectStatus(
                    project.getProjectStatus()
            );
        }

        /*
         * DO NOT update start date.
         *
         * Original start date must remain unchanged.
         */
        
        /*
         * End date is optional.
         *
         * If React sends null, we allow it to become null.
         */
        existingProject.setProjectEndDate(
                project.getProjectEndDate()
        );

        /*
         * Save updated project.
         */
        return projectRepository.save(
                existingProject
        );
    }

    // =====================================================
    // DELETE PROJECT
    // =====================================================

    public void deleteProject(Integer id) {

        if (!projectRepository.existsById(id)) {

            throw new RuntimeException(
                    "Project not found with ID: " + id
            );
        }

        projectRepository.deleteById(id);
    }
}