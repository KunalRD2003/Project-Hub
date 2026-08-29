package com.kunal.project_management_system.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "modules")
public class Module {

    // =====================================================
    // MODULE ID
    // =====================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "module_id")
    private Integer moduleId;


    // =====================================================
    // PROJECT
    // =====================================================

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(
            name = "project_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_module_project")
    )
    private Project project;


    // =====================================================
    // PROJECT ID
    // Used to receive projectId from React
    // =====================================================

    @Transient
    private Integer projectId;


    // =====================================================
    // MODULE NAME
    // =====================================================

    @Column(
            name = "module_name",
            nullable = false,
            length = 150
    )
    private String moduleName;


    // =====================================================
    // MODULE DESCRIPTION
    // =====================================================

    @Column(
            name = "module_description",
            columnDefinition = "TEXT"
    )
    private String moduleDescription;


    // =====================================================
    // MODULE STATUS
    // =====================================================

    @Enumerated(EnumType.STRING)
    @Column(
            name = "module_status",
            nullable = false
    )
    private ModuleStatus moduleStatus;


    // =====================================================
    // MODULE START DATE
    // Automatically set by backend
    // =====================================================

    @Column(name = "module_start_date")
    private LocalDateTime moduleStartDate;


    // =====================================================
    // MODULE END DATE
    // Optional
    // =====================================================

    @Column(name = "module_end_date")
    private LocalDate moduleEndDate;


    // =====================================================
    // DEFAULT CONSTRUCTOR
    // =====================================================

    public Module() {
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
    // GET PROJECT
    // =====================================================

    public Project getProject() {
        return project;
    }


    // =====================================================
    // SET PROJECT
    // =====================================================

    public void setProject(Project project) {
        this.project = project;
    }


    // =====================================================
    // GET PROJECT ID
    // =====================================================

    public Integer getProjectId() {
        return projectId;
    }


    // =====================================================
    // SET PROJECT ID
    // =====================================================

    public void setProjectId(Integer projectId) {
        this.projectId = projectId;
    }


    // =====================================================
    // GET MODULE NAME
    // =====================================================

    public String getModuleName() {
        return moduleName;
    }


    // =====================================================
    // SET MODULE NAME
    // =====================================================

    public void setModuleName(String moduleName) {
        this.moduleName = moduleName;
    }


    // =====================================================
    // GET MODULE DESCRIPTION
    // =====================================================

    public String getModuleDescription() {
        return moduleDescription;
    }


    // =====================================================
    // SET MODULE DESCRIPTION
    // =====================================================

    public void setModuleDescription(String moduleDescription) {
        this.moduleDescription = moduleDescription;
    }


    // =====================================================
    // GET MODULE STATUS
    // =====================================================

    public ModuleStatus getModuleStatus() {
        return moduleStatus;
    }


    // =====================================================
    // SET MODULE STATUS
    // =====================================================

    public void setModuleStatus(ModuleStatus moduleStatus) {
        this.moduleStatus = moduleStatus;
    }


    // =====================================================
    // GET MODULE START DATE
    // =====================================================

    public LocalDateTime getModuleStartDate() {
        return moduleStartDate;
    }


    // =====================================================
    // SET MODULE START DATE
    // =====================================================

    public void setModuleStartDate(
            LocalDateTime moduleStartDate) {

        this.moduleStartDate = moduleStartDate;
    }


    // =====================================================
    // GET MODULE END DATE
    // =====================================================

    public LocalDate getModuleEndDate() {
        return moduleEndDate;
    }


    // =====================================================
    // SET MODULE END DATE
    // =====================================================

    public void setModuleEndDate(
            LocalDate moduleEndDate) {

        this.moduleEndDate = moduleEndDate;
    }
}