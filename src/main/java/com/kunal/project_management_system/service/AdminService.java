package com.kunal.project_management_system.service;

import com.kunal.project_management_system.entity.Admin;
import com.kunal.project_management_system.repository.AdminRepository;
import org.springframework.stereotype.Service;
import com.kunal.project_management_system.dto.AdminLoginResponse;
import com.kunal.project_management_system.entity.AdminStatus;

import java.util.Optional;

@Service
public class AdminService {

	private final AdminRepository adminRepository;

	public AdminService(AdminRepository adminRepository) {
		this.adminRepository = adminRepository;
	}

	public Optional<Admin> findByUsername(String username) {
		return adminRepository.findByAdminUsername(username);
	}

	public AdminLoginResponse login(String username, String password) {

		Optional<Admin> adminOptional = adminRepository.findByAdminUsername(username);

		if (adminOptional.isEmpty()) {
			return new AdminLoginResponse(false, "Invalid username or password", null, null, null);
		}

		Admin admin = adminOptional.get();

		if (!admin.getAdminPassword().equals(password)) {
			return new AdminLoginResponse(false, "Invalid username or password", null, null, null);
		}

		if (admin.getAdminStatus() != AdminStatus.Active) {
			return new AdminLoginResponse(false, "Admin account is inactive", null, null, null);
		}

		return new AdminLoginResponse(true, "Login successful", admin.getAdminId(), admin.getAdminName(),
				admin.getAdminUsername());
	}
}