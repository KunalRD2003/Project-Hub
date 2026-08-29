package com.kunal.project_management_system.repository;

import com.kunal.project_management_system.entity.Employee;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeRepository
        extends JpaRepository<Employee, Integer> {

    Optional<Employee> findByEmployeeUsername(
            String employeeUsername
    );

    boolean existsByEmployeeUsername(
            String employeeUsername
    );

    boolean existsByEmployeeCode(
            String employeeCode
    );

    boolean existsByEmployeeEmail(
            String employeeEmail
    );
}