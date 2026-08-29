package com.kunal.project_management_system.service;

import com.kunal.project_management_system.entity.Department;
import com.kunal.project_management_system.entity.Designation;
import com.kunal.project_management_system.entity.Employee;
import com.kunal.project_management_system.entity.EmployeeStatus;
import com.kunal.project_management_system.repository.DepartmentRepository;
import com.kunal.project_management_system.repository.DesignationRepository;
import com.kunal.project_management_system.repository.EmployeeRepository;
import com.kunal.project_management_system.dto.EmployeeLoginResponse;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final DesignationRepository designationRepository;

    public EmployeeService(
            EmployeeRepository employeeRepository,
            DepartmentRepository departmentRepository,
            DesignationRepository designationRepository) {

        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.designationRepository = designationRepository;
    }

    // Create Employee
 // Create Employee
    public Employee createEmployee(Employee employee) {

        if (employeeRepository.existsByEmployeeUsername(
                employee.getEmployeeUsername())) {

            throw new RuntimeException("Username already exists");
        }

        if (employeeRepository.existsByEmployeeCode(
                employee.getEmployeeCode())) {

            throw new RuntimeException("Employee code already exists");
        }

        if (employee.getEmployeeEmail() != null
                && employeeRepository.existsByEmployeeEmail(
                        employee.getEmployeeEmail())) {

            throw new RuntimeException("Email already exists");
        }

        // Department
        if (employee.getDepartment() != null
                && employee.getDepartment().getDepartmentId() != null) {

            Department department =
                    departmentRepository.findById(
                            employee.getDepartment().getDepartmentId())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Department not found"));

            employee.setDepartment(department);

        } else {

            throw new RuntimeException(
                    "Department is required");
        }

        // Designation
        if (employee.getDesignation() != null
                && employee.getDesignation().getDesignationId() != null) {

            Designation designation =
                    designationRepository.findById(
                            employee.getDesignation().getDesignationId())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Designation not found"));

            employee.setDesignation(designation);

        } else {

            throw new RuntimeException(
                    "Designation is required");
        }

        employee.setEmployeeStatus(EmployeeStatus.Active);

        LocalDateTime now = LocalDateTime.now();

        employee.setEmployeeOndate(now);
        employee.setUpdatedAt(now);

        return employeeRepository.save(employee);
    }
    // Get all employees
    public List<Employee> getAllEmployees() {

        return employeeRepository.findAll();
    }

    // Get employee by ID
    public Optional<Employee> getEmployeeById(Integer id) {

        return employeeRepository.findById(id);
    }

    // Get employee by username
    public Optional<Employee> findByUsername(String username) {

        return employeeRepository.findByEmployeeUsername(username);
    }

    // Update employee
    public Employee updateEmployee(
            Integer id,
            Employee updatedEmployee) {

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Employee not found"));

        employee.setEmployeeCode(
                updatedEmployee.getEmployeeCode());

        employee.setEmployeeName(
                updatedEmployee.getEmployeeName());

        employee.setEmployeeUsername(
                updatedEmployee.getEmployeeUsername());

        employee.setEmployeeEmail(
                updatedEmployee.getEmployeeEmail());

        employee.setEmployeePhone(
                updatedEmployee.getEmployeePhone());

        // Department
        if (updatedEmployee.getDepartment() != null
                && updatedEmployee.getDepartment().getDepartmentId() != null) {

            Department department =
                    departmentRepository.findById(
                            updatedEmployee.getDepartment().getDepartmentId())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Department not found"));

            employee.setDepartment(department);
        }

        // Designation
        if (updatedEmployee.getDesignation() != null
                && updatedEmployee.getDesignation().getDesignationId() != null) {

            Designation designation =
                    designationRepository.findById(
                            updatedEmployee.getDesignation().getDesignationId())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Designation not found"));

            employee.setDesignation(designation);
        }

        // Update password only when provided
        if (updatedEmployee.getEmployeePassword() != null
                && !updatedEmployee.getEmployeePassword().isBlank()) {

            employee.setEmployeePassword(
                    updatedEmployee.getEmployeePassword());
        }

        employee.setEmployeeStatus(
                updatedEmployee.getEmployeeStatus());

        employee.setUpdatedAt(LocalDateTime.now());

        return employeeRepository.save(employee);
    }

    // Change employee status
    public Employee updateStatus(
            Integer id,
            EmployeeStatus status) {

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Employee not found"));

        employee.setEmployeeStatus(status);

        employee.setUpdatedAt(LocalDateTime.now());

        return employeeRepository.save(employee);
    }

    // Delete employee
    public void deleteEmployee(Integer id) {

        if (!employeeRepository.existsById(id)) {

            throw new RuntimeException("Employee not found");
        }

        employeeRepository.deleteById(id);
    }
    public EmployeeLoginResponse login(
            String username,
            String password) {

        Optional<Employee> employeeOptional =
                employeeRepository.findByEmployeeUsername(username);


        if (employeeOptional.isEmpty()) {

            return new EmployeeLoginResponse(
                    false,
                    "Invalid username or password",
                    null,
                    null,
                    null
            );
        }


        Employee employee =
                employeeOptional.get();


        if (!employee.getEmployeePassword().equals(password)) {

            return new EmployeeLoginResponse(
                    false,
                    "Invalid username or password",
                    null,
                    null,
                    null
            );
        }


        if (employee.getEmployeeStatus() != EmployeeStatus.Active) {

            return new EmployeeLoginResponse(
                    false,
                    "Employee account is inactive",
                    null,
                    null,
                    null
            );
        }


        return new EmployeeLoginResponse(
                true,
                "Login successful",
                employee.getEmployeeId(),
                employee.getEmployeeName(),
                employee.getEmployeeUsername()
        );
    }
}