package com.kunal.project_management_system.controller;

import com.kunal.project_management_system.entity.Admin;
import com.kunal.project_management_system.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.kunal.project_management_system.dto.AdminLoginRequest;
import com.kunal.project_management_system.dto.AdminLoginResponse;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

	private final AdminService adminService;

	public AdminController(AdminService adminService) {
		this.adminService = adminService;
	}

	@GetMapping("/username/{username}")
	public ResponseEntity<?> getAdminByUsername(@PathVariable String username) {

		Optional<Admin> admin = adminService.findByUsername(username);

		if (admin.isPresent()) {
			return ResponseEntity.ok(admin.get());
		}

		return ResponseEntity.status(404).body("Admin not found");
	}

	@PostMapping("/login")
	public ResponseEntity<AdminLoginResponse> login(@RequestBody AdminLoginRequest request) {

		AdminLoginResponse response = adminService.login(request.getUsername(), request.getPassword());

		if (!response.isSuccess()) {
			return ResponseEntity.status(401).body(response);
		}

		return ResponseEntity.ok(response);
	}

	@GetMapping("/test")
	public ResponseEntity<String> test() {
		return ResponseEntity.ok("Admin API is working");
	}
}