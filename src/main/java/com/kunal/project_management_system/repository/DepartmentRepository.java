package com.kunal.project_management_system.repository;

import com.kunal.project_management_system.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DepartmentRepository extends JpaRepository<Department, Integer> {

	boolean existsByDepartmentName(String departmentName);

	List<Department> findByDepartmentStatus(com.kunal.project_management_system.entity.DepartmentStatus status);
}