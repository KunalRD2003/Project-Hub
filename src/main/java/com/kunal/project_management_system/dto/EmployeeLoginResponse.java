package com.kunal.project_management_system.dto;

public class EmployeeLoginResponse {

    private boolean success;
    private String message;
    private Integer employeeId;
    private String employeeName;
    private String employeeUsername;

    public EmployeeLoginResponse() {
    }

    public EmployeeLoginResponse(
            boolean success,
            String message,
            Integer employeeId,
            String employeeName,
            String employeeUsername) {

        this.success = success;
        this.message = message;
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.employeeUsername = employeeUsername;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Integer getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Integer employeeId) {
        this.employeeId = employeeId;
    }

    public String getEmployeeName() {
        return employeeName;
    }

    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }

    public String getEmployeeUsername() {
        return employeeUsername;
    }

    public void setEmployeeUsername(String employeeUsername) {
        this.employeeUsername = employeeUsername;
    }
}