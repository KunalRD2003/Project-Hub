package com.kunal.project_management_system.service;

import com.kunal.project_management_system.entity.Department;
import com.kunal.project_management_system.entity.DepartmentStatus;
import com.kunal.project_management_system.repository.DepartmentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    public Department createDepartment(Department department) {

        if (departmentRepository.existsByDepartmentName(
                department.getDepartmentName())) {

            throw new RuntimeException(
                    "Department name already exists"
            );
        }

        if (department.getDepartmentStatus() == null) {
            department.setDepartmentStatus(DepartmentStatus.Active);
        }

        if (department.getDepartmentOndate() == null) {
            department.setDepartmentOndate(LocalDateTime.now());
        }

        return departmentRepository.save(department);
    }

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    public List<Department> getActiveDepartments() {
        return departmentRepository.findByDepartmentStatus(
                DepartmentStatus.Active
        );
    }

    public Optional<Department> getDepartmentById(Integer id) {
        return departmentRepository.findById(id);
    }

    public Department updateDepartment(
            Integer id,
            Department updatedDepartment) {

        Department department =
                departmentRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Department not found"
                                ));

        department.setDepartmentName(
                updatedDepartment.getDepartmentName()
        );

        department.setDepartmentStatus(
                updatedDepartment.getDepartmentStatus()
        );

        return departmentRepository.save(department);
    }

    public void deleteDepartment(Integer id) {

        if (!departmentRepository.existsById(id)) {
            throw new RuntimeException(
                    "Department not found"
            );
        }

        departmentRepository.deleteById(id);
    }
}