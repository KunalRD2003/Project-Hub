package com.kunal.project_management_system.service;

import com.kunal.project_management_system.entity.Requirement;
import com.kunal.project_management_system.entity.Task;
import com.kunal.project_management_system.entity.TaskPriority;
import com.kunal.project_management_system.entity.TaskStatus;
import com.kunal.project_management_system.repository.RequirementRepository;
import com.kunal.project_management_system.repository.TaskRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    private final RequirementRepository requirementRepository;


    public TaskService(
            TaskRepository taskRepository,
            RequirementRepository requirementRepository) {

        this.taskRepository = taskRepository;
        this.requirementRepository = requirementRepository;
    }


    // =====================================================
    // GET ALL TASKS
    // =====================================================

    public List<Task> getAllTasks() {

        return taskRepository.findAll();
    }


    // =====================================================
    // GET TASK BY ID
    // =====================================================

    public Optional<Task> getTaskById(Integer id) {

        return taskRepository.findById(id);
    }


    // =====================================================
    // GET TASKS BY STATUS
    // =====================================================

    public List<Task> getTasksByStatus(
            TaskStatus status) {

        return taskRepository.findByTaskStatus(status);
    }


    // =====================================================
    // GET TASKS BY PRIORITY
    // =====================================================

    public List<Task> getTasksByPriority(
            TaskPriority priority) {

        return taskRepository.findByTaskPriority(priority);
    }


    // =====================================================
    // GET TASKS BY REQUIREMENT
    // =====================================================

    public List<Task> getTasksByRequirement(
            Integer requirementId) {

        return taskRepository
                .findByRequirement_RequirementId(
                        requirementId
                );
    }


    // =====================================================
    // CREATE TASK
    // =====================================================

    public Task createTask(Task task) {

        Integer requirementId =
                task.getRequirementId();


        // -------------------------------------------------
        // Support requirement object also
        // -------------------------------------------------

        if (requirementId == null &&
                task.getRequirement() != null) {

            requirementId =
                    task.getRequirement()
                            .getRequirementId();
        }


        // -------------------------------------------------
        // Requirement is mandatory
        // -------------------------------------------------

        if (requirementId == null) {

            throw new RuntimeException(
                    "Requirement is required."
            );
        }


        // -------------------------------------------------
        // Find requirement
        // -------------------------------------------------

        final Integer finalRequirementId =
                requirementId;

        Requirement requirement =
                requirementRepository
                        .findById(finalRequirementId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Requirement not found with ID: "
                                                + finalRequirementId
                                )
                        );


        // -------------------------------------------------
        // Set actual Requirement entity
        // -------------------------------------------------

        task.setRequirement(requirement);


        // -------------------------------------------------
        // Default priority
        // -------------------------------------------------

        if (task.getTaskPriority() == null) {

            task.setTaskPriority(
                    TaskPriority.MEDIUM
            );
        }


        // -------------------------------------------------
        // Default status
        // -------------------------------------------------

        if (task.getTaskStatus() == null) {

            task.setTaskStatus(
                    TaskStatus.PENDING
            );
        }


        // -------------------------------------------------
        // Automatically set current timestamp
        // -------------------------------------------------

        task.setTaskStartDate(
                LocalDateTime.now()
        );


        // -------------------------------------------------
        // Save task
        // -------------------------------------------------

        return taskRepository.save(task);
    }


    // =====================================================
    // UPDATE TASK
    // =====================================================

    public Task updateTask(
            Integer id,
            Task task) {

        Task existingTask =
                taskRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Task not found with ID: "
                                                + id
                                )
                        );


        // -------------------------------------------------
        // Get requirement ID
        // -------------------------------------------------

        Integer requirementId =
                task.getRequirementId();


        // -------------------------------------------------
        // Support requirement object also
        // -------------------------------------------------

        if (requirementId == null &&
                task.getRequirement() != null) {

            requirementId =
                    task.getRequirement()
                            .getRequirementId();
        }


        // -------------------------------------------------
        // Requirement is mandatory
        // -------------------------------------------------

        if (requirementId == null) {

            throw new RuntimeException(
                    "Requirement is required."
            );
        }


        // -------------------------------------------------
        // Find requirement
        // -------------------------------------------------

        final Integer finalRequirementId =
                requirementId;

        Requirement requirement =
                requirementRepository
                        .findById(finalRequirementId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Requirement not found with ID: "
                                                + finalRequirementId
                                )
                        );


        // -------------------------------------------------
        // Update requirement
        // -------------------------------------------------

        existingTask.setRequirement(
                requirement
        );


        // -------------------------------------------------
        // Update title
        // -------------------------------------------------

        existingTask.setTaskTitle(
                task.getTaskTitle()
        );


        // -------------------------------------------------
        // Update description
        // -------------------------------------------------

        existingTask.setTaskDescription(
                task.getTaskDescription()
        );


        // -------------------------------------------------
        // Update priority
        // -------------------------------------------------

        if (task.getTaskPriority() != null) {

            existingTask.setTaskPriority(
                    task.getTaskPriority()
            );
        }


        // -------------------------------------------------
        // Update status
        // -------------------------------------------------

        if (task.getTaskStatus() != null) {

            existingTask.setTaskStatus(
                    task.getTaskStatus()
            );
        }


        // -------------------------------------------------
        // Update assigned person
        // -------------------------------------------------

        existingTask.setTaskAssignedTo(
                task.getTaskAssignedTo()
        );


        // -------------------------------------------------
        // DO NOT update start date
        // -------------------------------------------------


        // -------------------------------------------------
        // Update due date
        // Optional
        // -------------------------------------------------

        existingTask.setTaskDueDate(
                task.getTaskDueDate()
        );


        // -------------------------------------------------
        // Update completed date
        // Optional
        // -------------------------------------------------

        existingTask.setTaskCompletedDate(
                task.getTaskCompletedDate()
        );


        // -------------------------------------------------
        // Save
        // -------------------------------------------------

        return taskRepository.save(
                existingTask
        );
    }


    // =====================================================
    // DELETE TASK
    // =====================================================

    public void deleteTask(Integer id) {

        if (!taskRepository.existsById(id)) {

            throw new RuntimeException(
                    "Task not found with ID: " + id
            );
        }

        taskRepository.deleteById(id);
    }
    public List<Task> getTasksAssignedTo(
            String username) {

        return taskRepository.findByTaskAssignedTo(
                username
        );
    }
}