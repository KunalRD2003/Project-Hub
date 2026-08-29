package com.kunal.project_management_system.repository;

import com.kunal.project_management_system.entity.City;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CityRepository
        extends JpaRepository<City, Integer> {

    List<City> findByStateStateId(
            Integer stateId
    );

    Optional<City> findByCityName(
            String cityName
    );

}