package com.kunal.project_management_system.repository;

import com.kunal.project_management_system.entity.Task;
import com.kunal.project_management_system.entity.TaskPriority;
import com.kunal.project_management_system.entity.TaskStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository
        extends JpaRepository<Task, Integer> {

 
    // =====================================================
    // GET TASKS BY STATUS
    // =====================================================

    List<Task> findByTaskStatus(TaskStatus taskStatus);


    // =====================================================
    // GET TASKS BY PRIORITY
    // =====================================================

    List<Task> findByTaskPriority(TaskPriority taskPriority);


    // =====================================================
    // GET TASKS BY REQUIREMENT
    // =====================================================

    List<Task> findByRequirement_RequirementId(
            Integer requirementId
    );


    // =====================================================
    // GET TASKS BY EMPLOYEE USERNAME
    // =====================================================

    List<Task> findByTaskAssignedTo(
            String taskAssignedTo
    );
}