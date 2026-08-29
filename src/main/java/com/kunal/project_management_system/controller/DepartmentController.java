package com.kunal.project_management_system.controller;

import com.kunal.project_management_system.entity.Department;
import com.kunal.project_management_system.service.DepartmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

	private final DepartmentService departmentService;

	public DepartmentController(DepartmentService departmentService) {

		this.departmentService = departmentService;
	}

	@GetMapping
	public ResponseEntity<List<Department>> getAllDepartments() {

		return ResponseEntity.ok(departmentService.getAllDepartments());
	}

	@GetMapping("/active")
	public ResponseEntity<List<Department>> getActiveDepartments() {

		return ResponseEntity.ok(departmentService.getActiveDepartments());
	}

	@GetMapping("/{id}")
	public ResponseEntity<?> getDepartmentById(@PathVariable Integer id) {

		return departmentService.getDepartmentById(id).map(ResponseEntity::ok)
				.orElseGet(() -> ResponseEntity.notFound().build());
	}

	@PostMapping
	public ResponseEntity<?> createDepartment(@RequestBody Department department) {

		try {

			return ResponseEntity.ok(departmentService.createDepartment(department));

		} catch (RuntimeException e) {

			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@PutMapping("/{id}")
	public ResponseEntity<?> updateDepartment(@PathVariable Integer id, @RequestBody Department department) {

		try {

			return ResponseEntity.ok(departmentService.updateDepartment(id, department));

		} catch (RuntimeException e) {

			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteDepartment(@PathVariable Integer id) {

		try {

			departmentService.deleteDepartment(id);

			return ResponseEntity.ok("Department deleted successfully");

		} catch (RuntimeException e) {

			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
}