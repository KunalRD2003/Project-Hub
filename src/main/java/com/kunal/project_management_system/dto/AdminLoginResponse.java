package com.kunal.project_management_system.dto;

public class AdminLoginResponse {

	private boolean success;
	private String message;
	private Integer adminId;
	private String adminName;
	private String username;

	public AdminLoginResponse() {
	}

	public AdminLoginResponse(boolean success, String message, Integer adminId, String adminName, String username) {

		this.success = success;
		this.message = message;
		this.adminId = adminId;
		this.adminName = adminName;
		this.username = username;
	}

	public boolean isSuccess() {
		return success;
	}

	public String getMessage() {
		return message;
	}

	public Integer getAdminId() {
		return adminId;
	}

	public String getAdminName() {
		return adminName;
	}

	public String getUsername() {
		return username;
	}
}