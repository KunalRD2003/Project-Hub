package com.kunal.project_management_system.service;

import com.kunal.project_management_system.entity.Designation;
import com.kunal.project_management_system.repository.DesignationRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DesignationService {

	private final DesignationRepository designationRepository;

	public DesignationService(DesignationRepository designationRepository) {

		this.designationRepository = designationRepository;
	}

	// Get all designations
	public List<Designation> getAllDesignations() {

		return designationRepository.findAll();
	}

	// Get active designations
	public List<Designation> getActiveDesignations() {

		return designationRepository.findByDesignationStatus("Active");
	}

	// Get designation by ID
	public Optional<Designation> getDesignationById(Integer id) {

		return designationRepository.findById(id);
	}

	// Create designation
	public Designation createDesignation(Designation designation) {

		if (designation.getDesignationName() == null || designation.getDesignationName().trim().isEmpty()) {

			throw new RuntimeException("Designation name is required");
		}

		String name = designation.getDesignationName().trim();

		if (designationRepository.existsByDesignationNameIgnoreCase(name)) {

			throw new RuntimeException("Designation already exists");
		}

		designation.setDesignationName(name);

		if (designation.getDesignationStatus() == null || designation.getDesignationStatus().trim().isEmpty()) {

			designation.setDesignationStatus("Active");
		}

		return designationRepository.save(designation);
	}

	// Update designation
	public Designation updateDesignation(Integer id, Designation designation) {

		Designation existing = designationRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Designation not found"));

		if (designation.getDesignationName() == null || designation.getDesignationName().trim().isEmpty()) {

			throw new RuntimeException("Designation name is required");
		}

		String name = designation.getDesignationName().trim();

		existing.setDesignationName(name);

		if (designation.getDesignationStatus() != null) {

			existing.setDesignationStatus(designation.getDesignationStatus());
		}

		return designationRepository.save(existing);
	}

	// Delete designation
	public void deleteDesignation(Integer id) {

		Designation existing = designationRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Designation not found"));

		designationRepository.delete(existing);
	}
}