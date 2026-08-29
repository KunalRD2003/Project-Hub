package com.kunal.project_management_system.repository;

import com.kunal.project_management_system.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin, Integer> {

	Optional<Admin> findByAdminUsername(String adminUsername);

	boolean existsByAdminUsername(String adminUsername);

	boolean existsByAdminEmail(String adminEmail);
}