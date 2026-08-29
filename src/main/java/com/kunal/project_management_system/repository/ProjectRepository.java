package com.kunal.project_management_system.repository;

import com.kunal.project_management_system.entity.Project;
import com.kunal.project_management_system.entity.ProjectStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository
        extends JpaRepository<Project, Integer> {


    // =====================================================
    // FIND PROJECTS BY STATUS
    // =====================================================

    List<Project> findByProjectStatus(
            ProjectStatus projectStatus
    );


    // =====================================================
    // FIND PROJECTS BY CLIENT
    // =====================================================

    List<Project> findByClient_ClientId(
            Integer clientId
    );
}