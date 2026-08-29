package com.kunal.project_management_system.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "projects")
public class Project {

    // =====================================================
    // PROJECT ID
    // =====================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "project_id")
    private Integer projectId;


    // =====================================================
    // CLIENT
    // =====================================================

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(
            name = "client_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_project_client")
    )
    private Client client;


    // =====================================================
    // CLIENT ID
    // Used to receive clientId from React
    // =====================================================

    @Transient
    private Integer clientId;


    // =====================================================
    // PROJECT NAME
    // =====================================================

    @Column(
            name = "project_name",
            nullable = false,
            length = 150
    )
    private String projectName;


    // =====================================================
    // PROJECT DESCRIPTION
    // =====================================================

    @Column(
            name = "project_description",
            columnDefinition = "TEXT"
    )
    private String projectDescription;


    // =====================================================
    // PROJECT STATUS
    // =====================================================

    @Enumerated(EnumType.STRING)
    @Column(
            name = "project_status",
            nullable = false
    )
    private ProjectStatus projectStatus;


    // =====================================================
    // PROJECT START DATE
    // =====================================================

    @Column(name = "project_start_date")
    private LocalDateTime projectStartDate;


    // =====================================================
    // PROJECT END DATE
    // =====================================================

    @Column(name = "project_end_date")
    private LocalDate projectEndDate;


    // =====================================================
    // DEFAULT CONSTRUCTOR
    // =====================================================

    public Project() {
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
    // GET CLIENT
    // =====================================================

    public Client getClient() {
        return client;
    }


    // =====================================================
    // SET CLIENT
    // =====================================================

    public void setClient(Client client) {
        this.client = client;
    }


    // =====================================================
    // GET CLIENT ID
    // =====================================================

    public Integer getClientId() {
        return clientId;
    }


    // =====================================================
    // SET CLIENT ID
    // =====================================================

    public void setClientId(Integer clientId) {
        this.clientId = clientId;
    }


    // =====================================================
    // GET PROJECT NAME
    // =====================================================

    public String getProjectName() {
        return projectName;
    }


    // =====================================================
    // SET PROJECT NAME
    // =====================================================

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }


    // =====================================================
    // GET PROJECT DESCRIPTION
    // =====================================================

    public String getProjectDescription() {
        return projectDescription;
    }


    // =====================================================
    // SET PROJECT DESCRIPTION
    // =====================================================

    public void setProjectDescription(String projectDescription) {
        this.projectDescription = projectDescription;
    }


    // =====================================================
    // GET PROJECT STATUS
    // =====================================================

    public ProjectStatus getProjectStatus() {
        return projectStatus;
    }


    // =====================================================
    // SET PROJECT STATUS
    // =====================================================

    public void setProjectStatus(ProjectStatus projectStatus) {
        this.projectStatus = projectStatus;
    }


    // =====================================================
    // GET PROJECT START DATE
    // =====================================================

    public LocalDateTime getProjectStartDate() {
        return projectStartDate;
    }


    // =====================================================
    // SET PROJECT START DATE
    // =====================================================

    public void setProjectStartDate(LocalDateTime projectStartDate) {
        this.projectStartDate = projectStartDate;
    }


    // =====================================================
    // GET PROJECT END DATE
    // =====================================================

    public LocalDate getProjectEndDate() {
        return projectEndDate;
    }


    // =====================================================
    // SET PROJECT END DATE
    // =====================================================

    public void setProjectEndDate(LocalDate projectEndDate) {
        this.projectEndDate = projectEndDate;
    }
}