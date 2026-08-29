package com.kunal.project_management_system.controller;

import com.kunal.project_management_system.entity.State;
import com.kunal.project_management_system.service.StateService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/states")
@CrossOrigin(origins = "http://localhost:5173")
public class StateController {

    private final StateService stateService;


    public StateController(StateService stateService) {

        this.stateService = stateService;

    }


    // =====================================================
    // GET ALL STATES
    // =====================================================

    @GetMapping
    public ResponseEntity<List<State>> getAllStates() {

        return ResponseEntity.ok(
                stateService.getAllStates()
        );

    }


    // =====================================================
    // GET ACTIVE STATES
    // =====================================================

    @GetMapping("/active")
    public ResponseEntity<List<State>> getActiveStates() {

        return ResponseEntity.ok(
                stateService.getActiveStates()
        );

    }


    // =====================================================
    // GET STATE BY ID
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getStateById(
            @PathVariable Integer id
    ) {

        try {

            return ResponseEntity.ok(
                    stateService.getStateById(id)
            );

        } catch (RuntimeException error) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(error.getMessage());

        }

    }


    // =====================================================
    // CREATE STATE
    // =====================================================

    @PostMapping
    public ResponseEntity<?> createState(
            @RequestBody State state
    ) {

        try {

            State savedState =
                    stateService.createState(state);


            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(savedState);

        } catch (RuntimeException error) {

            return ResponseEntity
                    .badRequest()
                    .body(error.getMessage());

        }

    }


    // =====================================================
    // UPDATE STATE
    // =====================================================

    @PutMapping("/{id}")
    public ResponseEntity<?> updateState(
            @PathVariable Integer id,
            @RequestBody State state
    ) {

        try {

            State updatedState =
                    stateService.updateState(
                            id,
                            state
                    );


            return ResponseEntity.ok(
                    updatedState
            );

        } catch (RuntimeException error) {

            return ResponseEntity
                    .badRequest()
                    .body(error.getMessage());

        }

    }


    // =====================================================
    // DELETE STATE
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteState(
            @PathVariable Integer id
    ) {

        try {

            stateService.deleteState(id);


            return ResponseEntity.ok(
                    "State deleted successfully."
            );

        } catch (RuntimeException error) {

            return ResponseEntity
                    .badRequest()
                    .body(error.getMessage());

        }

    }


    // =====================================================
    // ACTIVATE STATE
    // =====================================================

    @PutMapping("/{id}/activate")
    public ResponseEntity<?> activateState(
            @PathVariable Integer id
    ) {

        try {

            State state =
                    stateService.activateState(id);


            return ResponseEntity.ok(state);

        } catch (RuntimeException error) {

            return ResponseEntity
                    .badRequest()
                    .body(error.getMessage());

        }

    }

}