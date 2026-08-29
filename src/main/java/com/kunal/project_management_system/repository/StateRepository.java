package com.kunal.project_management_system.repository;

import com.kunal.project_management_system.entity.State;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StateRepository
        extends JpaRepository<State, Integer> {

    // =========================
    // GET ALL STATES ORDERED
    // =========================

    List<State> findAllByOrderByStateNameAsc();


    // =========================
    // GET ACTIVE STATES
    // =========================

    List<State> findByStateStatusOrderByStateNameAsc(
            String stateStatus
    );


    // =========================
    // FIND STATE BY NAME
    // =========================

    Optional<State> findByStateName(
            String stateName
    );


    // =========================
    // CHECK DUPLICATE STATE
    // =========================

    boolean existsByStateNameIgnoreCase(
            String stateName
    );


    // =========================
    // CHECK DUPLICATE DURING UPDATE
    // =========================

    boolean existsByStateNameIgnoreCaseAndStateIdNot(
            String stateName,
            Integer stateId
    );

}