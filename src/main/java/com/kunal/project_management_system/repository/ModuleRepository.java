package com.kunal.project_management_system.repository;

import com.kunal.project_management_system.entity.Module;
import com.kunal.project_management_system.entity.ModuleStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ModuleRepository
        extends JpaRepository<Module, Integer> {

    // =====================================================
    // GET MODULES BY STATUS
    // =====================================================

    List<Module> findByModuleStatus(ModuleStatus moduleStatus);


    // =====================================================
    // GET MODULES BY PROJECT
    // =====================================================

    List<Module> findByProject_ProjectId(Integer projectId);
}