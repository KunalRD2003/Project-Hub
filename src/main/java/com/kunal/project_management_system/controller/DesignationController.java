package com.kunal.project_management_system.controller;

import com.kunal.project_management_system.entity.Designation;
import com.kunal.project_management_system.service.DesignationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/designations")
public class DesignationController {

	private final DesignationService designationService;

	public DesignationController(DesignationService designationService) {

		this.designationService = designationService;
	}

	@GetMapping
	public ResponseEntity<List<Designation>> getAllDesignations() {

		return ResponseEntity.ok(designationService.getAllDesignations());
	}

	@GetMapping("/active")
	public ResponseEntity<List<Designation>> getActiveDesignations() {

		return ResponseEntity.ok(designationService.getActiveDesignations());
	}

	@GetMapping("/{id}")
	public ResponseEntity<?> getDesignationById(@PathVariable Integer id) {

		return designationService.getDesignationById(id).map(ResponseEntity::ok)
				.orElseGet(() -> ResponseEntity.notFound().build());
	}

	@PostMapping
	public ResponseEntity<?> createDesignation(@RequestBody Designation designation) {

		try {

			return ResponseEntity.ok(designationService.createDesignation(designation));

		} catch (RuntimeException e) {

			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@PutMapping("/{id}")
	public ResponseEntity<?> updateDesignation(@PathVariable Integer id, @RequestBody Designation designation) {

		try {

			return ResponseEntity.ok(designationService.updateDesignation(id, designation));

		} catch (RuntimeException e) {

			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteDesignation(@PathVariable Integer id) {

		try {

			designationService.deleteDesignation(id);

			return ResponseEntity.ok("Designation deleted successfully");

		} catch (RuntimeException e) {

			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
}