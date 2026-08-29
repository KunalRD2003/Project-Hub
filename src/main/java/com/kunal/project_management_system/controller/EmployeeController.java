package com.kunal.project_management_system.controller;

import com.kunal.project_management_system.dto.EmployeeLoginRequest;
import com.kunal.project_management_system.dto.EmployeeLoginResponse;

import com.kunal.project_management_system.entity.Employee;
import com.kunal.project_management_system.entity.EmployeeStatus;

import com.kunal.project_management_system.service.EmployeeService;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "http://localhost:5173")
public class EmployeeController {

    private final EmployeeService employeeService;


    public EmployeeController(
            EmployeeService employeeService) {

        this.employeeService = employeeService;
    }


    // =====================================================
    // EMPLOYEE LOGIN
    // =====================================================

    @PostMapping("/login")
    public ResponseEntity<EmployeeLoginResponse> login(
            @RequestBody EmployeeLoginRequest request) {

        EmployeeLoginResponse response =
                employeeService.login(
                        request.getUsername(),
                        request.getPassword()
                );


        if (!response.isSuccess()) {

            return ResponseEntity
                    .status(401)
                    .body(response);
        }


        return ResponseEntity.ok(response);
    }


    // =====================================================
    // CREATE EMPLOYEE
    // =====================================================

    @PostMapping
    public ResponseEntity<?> createEmployee(
            @RequestBody Employee employee) {

        try {

            Employee savedEmployee =
                    employeeService.createEmployee(employee);

            return ResponseEntity.ok(savedEmployee);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =====================================================
    // GET ALL EMPLOYEES
    // =====================================================

    @GetMapping
    public ResponseEntity<List<Employee>> getAllEmployees() {

        return ResponseEntity.ok(
                employeeService.getAllEmployees()
        );
    }


    // =====================================================
    // GET EMPLOYEE BY ID
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getEmployeeById(
            @PathVariable Integer id) {

        Optional<Employee> employee =
                employeeService.getEmployeeById(id);


        if (employee.isPresent()) {

            return ResponseEntity.ok(
                    employee.get()
            );
        }


        return ResponseEntity
                .notFound()
                .build();
    }


    // =====================================================
    // UPDATE EMPLOYEE
    // =====================================================

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEmployee(
            @PathVariable Integer id,
            @RequestBody Employee employee) {

        try {

            Employee updatedEmployee =
                    employeeService.updateEmployee(
                            id,
                            employee
                    );

            return ResponseEntity.ok(
                    updatedEmployee
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =====================================================
    // UPDATE STATUS
    // =====================================================

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Integer id,
            @RequestParam EmployeeStatus status) {

        try {

            Employee employee =
                    employeeService.updateStatus(
                            id,
                            status
                    );

            return ResponseEntity.ok(employee);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =====================================================
    // DELETE EMPLOYEE
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEmployee(
            @PathVariable Integer id) {

        try {

            employeeService.deleteEmployee(id);

            return ResponseEntity.ok(
                    "Employee deleted successfully"
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}