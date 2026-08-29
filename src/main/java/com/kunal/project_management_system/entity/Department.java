package com.kunal.project_management_system.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "departments")
public class Department {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "department_id")
	private Integer departmentId;

	@Column(name = "department_name", nullable = false, unique = true, length = 100)
	private String departmentName;

	@Enumerated(EnumType.STRING)
	@Column(name = "department_status")
	private DepartmentStatus departmentStatus;

	@Column(name = "department_ondate")
	private LocalDateTime departmentOndate;

	public Integer getDepartmentId() {
		return departmentId;
	}

	public void setDepartmentId(Integer departmentId) {
		this.departmentId = departmentId;
	}

	public String getDepartmentName() {
		return departmentName;
	}

	public void setDepartmentName(String departmentName) {
		this.departmentName = departmentName;
	}

	public DepartmentStatus getDepartmentStatus() {
		return departmentStatus;
	}

	public void setDepartmentStatus(DepartmentStatus departmentStatus) {
		this.departmentStatus = departmentStatus;
	}

	public LocalDateTime getDepartmentOndate() {
		return departmentOndate;
	}

	public void setDepartmentOndate(LocalDateTime departmentOndate) {
		this.departmentOndate = departmentOndate;
	}
}