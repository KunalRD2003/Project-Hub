package com.kunal.project_management_system.repository;

import com.kunal.project_management_system.entity.Requirement;
import com.kunal.project_management_system.entity.RequirementPriority;
import com.kunal.project_management_system.entity.RequirementStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequirementRepository
        extends JpaRepository<Requirement, Integer> {

    // =====================================================
    // GET REQUIREMENTS BY PRIORITY
    // =====================================================

    List<Requirement> findByRequirementPriority(
            RequirementPriority requirementPriority
    );


    // =====================================================
    // GET REQUIREMENTS BY STATUS
    // =====================================================

    List<Requirement> findByRequirementStatus(
            RequirementStatus requirementStatus
    );


    // =====================================================
    // GET REQUIREMENTS BY MODULE
    // =====================================================

    List<Requirement> findByModule_ModuleId(
            Integer moduleId
    );
}