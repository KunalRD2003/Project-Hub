package com.kunal.project_management_system.service;

import com.kunal.project_management_system.entity.State;
import com.kunal.project_management_system.repository.StateRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StateService {

    private final StateRepository stateRepository;

    public StateService(StateRepository stateRepository) {

        this.stateRepository = stateRepository;

    }


    // =====================================================
    // GET ALL STATES
    // =====================================================

    public List<State> getAllStates() {

        return stateRepository.findAllByOrderByStateNameAsc();

    }


    // =====================================================
    // GET ACTIVE STATES
    // =====================================================

    public List<State> getActiveStates() {

        return stateRepository
                .findByStateStatusOrderByStateNameAsc("Active");

    }


    // =====================================================
    // GET STATE BY ID
    // =====================================================

    public State getStateById(Integer stateId) {

        return stateRepository
                .findById(stateId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "State not found with ID: " + stateId
                        )
                );

    }


    // =====================================================
    // CREATE STATE
    // =====================================================

    public State createState(State state) {

        if (
                state.getStateName() == null ||
                state.getStateName().trim().isEmpty()
        ) {

            throw new RuntimeException(
                    "State name is required."
            );

        }

        String stateName =
                state.getStateName().trim();


        // Check duplicate

        if (
                stateRepository
                        .existsByStateNameIgnoreCase(stateName)
        ) {

            throw new RuntimeException(
                    "State already exists."
            );

        }


        state.setStateName(stateName);


        // Default status

        if (
                state.getStateStatus() == null ||
                state.getStateStatus().trim().isEmpty()
        ) {

            state.setStateStatus("Active");

        }


        return stateRepository.save(state);

    }


    // =====================================================
    // UPDATE STATE
    // =====================================================

    public State updateState(
            Integer stateId,
            State state
    ) {

        State existingState =
                getStateById(stateId);


        if (
                state.getStateName() == null ||
                state.getStateName().trim().isEmpty()
        ) {

            throw new RuntimeException(
                    "State name is required."
            );

        }


        String stateName =
                state.getStateName().trim();


        // Duplicate check

        if (
                stateRepository
                        .existsByStateNameIgnoreCaseAndStateIdNot(
                                stateName,
                                stateId
                        )
        ) {

            throw new RuntimeException(
                    "Another state with this name already exists."
            );

        }


        existingState.setStateName(stateName);


        if (
                state.getStateStatus() != null &&
                !state.getStateStatus().trim().isEmpty()
        ) {

            existingState.setStateStatus(
                    state.getStateStatus()
            );

        }


        return stateRepository.save(existingState);

    }


    // =====================================================
    // DELETE STATE
    // =====================================================

    public void deleteState(Integer stateId) {

        State existingState =
                getStateById(stateId);


        stateRepository.delete(existingState);

    }


    // =====================================================
    // ACTIVATE STATE
    // =====================================================

    public State activateState(Integer stateId) {

        State existingState =
                getStateById(stateId);


        existingState.setStateStatus("Active");


        return stateRepository.save(existingState);

    }

}