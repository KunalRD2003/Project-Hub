package com.kunal.project_management_system.controller;

import com.kunal.project_management_system.entity.Task;
import com.kunal.project_management_system.entity.TaskPriority;
import com.kunal.project_management_system.entity.TaskStatus;
import com.kunal.project_management_system.service.TaskService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:5173")
public class TaskController {

    private final TaskService taskService;


    public TaskController(
            TaskService taskService) {

        this.taskService = taskService;
    }


    // =====================================================
    // GET ALL TASKS
    // =====================================================

    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {

        return ResponseEntity.ok(
                taskService.getAllTasks()
        );
    }


    // =====================================================
    // GET TASK BY ID
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getTaskById(
            @PathVariable Integer id) {

        return taskService
                .getTaskById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity
                                .notFound()
                                .build()
                );
    }


    // =====================================================
    // GET TASKS BY STATUS
    // =====================================================

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Task>> getTasksByStatus(
            @PathVariable TaskStatus status) {

        return ResponseEntity.ok(
                taskService.getTasksByStatus(status)
        );
    }


    // =====================================================
    // GET TASKS BY PRIORITY
    // =====================================================

    @GetMapping("/priority/{priority}")
    public ResponseEntity<List<Task>> getTasksByPriority(
            @PathVariable TaskPriority priority) {

        return ResponseEntity.ok(
                taskService.getTasksByPriority(priority)
        );
    }


    // =====================================================
    // GET TASKS BY REQUIREMENT
    // =====================================================

    @GetMapping("/requirement/{requirementId}")
    public ResponseEntity<List<Task>> getTasksByRequirement(
            @PathVariable Integer requirementId) {

        return ResponseEntity.ok(
                taskService.getTasksByRequirement(
                        requirementId
                )
        );
    }


    // =====================================================
    // CREATE TASK
    // =====================================================

    @PostMapping
    public ResponseEntity<?> createTask(
            @RequestBody Task task) {

        try {

            Task savedTask =
                    taskService.createTask(task);

            return ResponseEntity.ok(
                    savedTask
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =====================================================
    // UPDATE TASK
    // =====================================================

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(
            @PathVariable Integer id,
            @RequestBody Task task) {

        try {

            Task updatedTask =
                    taskService.updateTask(
                            id,
                            task
                    );

            return ResponseEntity.ok(
                    updatedTask
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =====================================================
    // DELETE TASK
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(
            @PathVariable Integer id) {

        try {

            taskService.deleteTask(id);

            return ResponseEntity.ok(
                    "Task deleted successfully"
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
 // =====================================================
 // GET TASKS ASSIGNED TO EMPLOYEE
 // =====================================================

 @GetMapping("/assigned/{username}")
 public ResponseEntity<List<Task>> getTasksAssignedTo(
         @PathVariable String username) {

     return ResponseEntity.ok(
             taskService.getTasksAssignedTo(username)
     );
 }
}