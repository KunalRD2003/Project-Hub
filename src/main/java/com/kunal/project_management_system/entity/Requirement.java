package com.kunal.project_management_system.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "requirements")
public class Requirement {

    // =====================================================
    // REQUIREMENT ID
    // =====================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "requirement_id")
    private Integer requirementId;


    // =====================================================
    // MODULE
    // =====================================================

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(
            name = "module_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_requirement_module")
    )
    private Module module;


    // =====================================================
    // MODULE ID
    // Used to receive moduleId from React
    // =====================================================

    @Transient
    private Integer moduleId;


    // =====================================================
    // REQUIREMENT TITLE
    // =====================================================

    @Column(
            name = "requirement_title",
            nullable = false,
            length = 200
    )
    private String requirementTitle;


    // =====================================================
    // REQUIREMENT DESCRIPTION
    // =====================================================

    @Column(
            name = "requirement_description",
            columnDefinition = "TEXT"
    )
    private String requirementDescription;


    // =====================================================
    // REQUIREMENT PRIORITY
    // =====================================================

    @Enumerated(EnumType.STRING)
    @Column(
            name = "requirement_priority",
            nullable = false
    )
    private RequirementPriority requirementPriority;


    // =====================================================
    // REQUIREMENT STATUS
    // =====================================================

    @Enumerated(EnumType.STRING)
    @Column(
            name = "requirement_status",
            nullable = false
    )
    private RequirementStatus requirementStatus;


    // =====================================================
    // REQUIREMENT ON DATE
    // Automatically set by backend
    // =====================================================

    @Column(name = "requirement_ondate")
    private LocalDateTime requirementOnDate;


    // =====================================================
    // DEFAULT CONSTRUCTOR
    // =====================================================

    public Requirement() {
    }


    // =====================================================
    // GET REQUIREMENT ID
    // =====================================================

    public Integer getRequirementId() {
        return requirementId;
    }


    // =====================================================
    // SET REQUIREMENT ID
    // =====================================================

    public void setRequirementId(Integer requirementId) {
        this.requirementId = requirementId;
    }


    // =====================================================
    // GET MODULE
    // =====================================================

    public Module getModule() {
        return module;
    }


    // =====================================================
    // SET MODULE
    // =====================================================

    public void setModule(Module module) {
        this.module = module;
    }


    // =====================================================
    // GET MODULE ID
    // =====================================================

    public Integer getModuleId() {
        return moduleId;
    }


    // =====================================================
    // SET MODULE ID
    // =====================================================

    public void setModuleId(Integer moduleId) {
        this.moduleId = moduleId;
    }


    // =====================================================
    // GET REQUIREMENT TITLE
    // =====================================================

    public String getRequirementTitle() {
        return requirementTitle;
    }


    // =====================================================
    // SET REQUIREMENT TITLE
    // =====================================================

    public void setRequirementTitle(String requirementTitle) {
        this.requirementTitle = requirementTitle;
    }


    // =====================================================
    // GET REQUIREMENT DESCRIPTION
    // =====================================================

    public String getRequirementDescription() {
        return requirementDescription;
    }


    // =====================================================
    // SET REQUIREMENT DESCRIPTION
    // =====================================================

    public void setRequirementDescription(
            String requirementDescription) {

        this.requirementDescription =
                requirementDescription;
    }


    // =====================================================
    // GET REQUIREMENT PRIORITY
    // =====================================================

    public RequirementPriority getRequirementPriority() {
        return requirementPriority;
    }


    // =====================================================
    // SET REQUIREMENT PRIORITY
    // =====================================================

    public void setRequirementPriority(
            RequirementPriority requirementPriority) {

        this.requirementPriority =
                requirementPriority;
    }


    // =====================================================
    // GET REQUIREMENT STATUS
    // =====================================================

    public RequirementStatus getRequirementStatus() {
        return requirementStatus;
    }


    // =====================================================
    // SET REQUIREMENT STATUS
    // =====================================================

    public void setRequirementStatus(
            RequirementStatus requirementStatus) {

        this.requirementStatus =
                requirementStatus;
    }


    // =====================================================
    // GET REQUIREMENT ON DATE
    // =====================================================

    public LocalDateTime getRequirementOnDate() {
        return requirementOnDate;
    }


    // =====================================================
    // SET REQUIREMENT ON DATE
    // =====================================================

    public void setRequirementOnDate(
            LocalDateTime requirementOnDate) {

        this.requirementOnDate =
                requirementOnDate;
    }
}