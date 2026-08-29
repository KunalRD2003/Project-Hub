package com.kunal.project_management_system.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "designations")
public class Designation {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "designation_id")
	private Integer designationId;

	@Column(name = "designation_name", nullable = false, unique = true, length = 100)
	private String designationName;

	@Column(name = "designation_status")
	private String designationStatus = "Active";

	@Column(name = "designation_ondate")
	private LocalDateTime designationOndate;

	public Integer getDesignationId() {
		return designationId;
	}

	public void setDesignationId(Integer designationId) {
		this.designationId = designationId;
	}

	public String getDesignationName() {
		return designationName;
	}

	public void setDesignationName(String designationName) {
		this.designationName = designationName;
	}

	public String getDesignationStatus() {
		return designationStatus;
	}

	public void setDesignationStatus(String designationStatus) {
		this.designationStatus = designationStatus;
	}

	public LocalDateTime getDesignationOndate() {
		return designationOndate;
	}

	public void setDesignationOndate(LocalDateTime designationOndate) {
		this.designationOndate = designationOndate;
	}

	@PrePersist
	protected void onCreate() {

		if (designationOndate == null) {
			designationOndate = LocalDateTime.now();
		}

		if (designationStatus == null) {
			designationStatus = "Active";
		}
	}
}