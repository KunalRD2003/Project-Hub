package com.kunal.project_management_system.repository;

import com.kunal.project_management_system.entity.Designation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DesignationRepository extends JpaRepository<Designation, Integer> {

	List<Designation> findByDesignationStatus(String status);

	boolean existsByDesignationNameIgnoreCase(String designationName);
}