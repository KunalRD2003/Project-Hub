package com.kunal.project_management_system.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "admins")
public class Admin {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "admin_id")
	private Integer adminId;

	@Column(name = "admin_name", nullable = false, length = 150)
	private String adminName;

	@Column(name = "admin_username", nullable = false, unique = true, length = 100)
	private String adminUsername;

	@Column(name = "admin_password", nullable = false, length = 255)
	private String adminPassword;

	@Column(name = "admin_email", unique = true, length = 150)
	private String adminEmail;

	@Enumerated(EnumType.STRING)
	@Column(name = "admin_status")
	private AdminStatus adminStatus;

	@Column(name = "admin_ondate")
	private LocalDateTime adminOndate;

	@Column(name = "updated_at")
	private LocalDateTime updatedAt;

	// Default Constructor
	public Admin() {
	}

	// Getters and Setters

	public Integer getAdminId() {
		return adminId;
	}

	public void setAdminId(Integer adminId) {
		this.adminId = adminId;
	}

	public String getAdminName() {
		return adminName;
	}

	public void setAdminName(String adminName) {
		this.adminName = adminName;
	}

	public String getAdminUsername() {
		return adminUsername;
	}

	public void setAdminUsername(String adminUsername) {
		this.adminUsername = adminUsername;
	}

	public String getAdminPassword() {
		return adminPassword;
	}

	public void setAdminPassword(String adminPassword) {
		this.adminPassword = adminPassword;
	}

	public String getAdminEmail() {
		return adminEmail;
	}

	public void setAdminEmail(String adminEmail) {
		this.adminEmail = adminEmail;
	}

	public AdminStatus getAdminStatus() {
		return adminStatus;
	}

	public void setAdminStatus(AdminStatus adminStatus) {
		this.adminStatus = adminStatus;
	}

	public LocalDateTime getAdminOndate() {
		return adminOndate;
	}

	public void setAdminOndate(LocalDateTime adminOndate) {
		this.adminOndate = adminOndate;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}
}