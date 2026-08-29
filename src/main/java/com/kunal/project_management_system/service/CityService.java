package com.kunal.project_management_system.service;

import com.kunal.project_management_system.dto.CityDropdownResponse;
import com.kunal.project_management_system.entity.City;
import com.kunal.project_management_system.repository.CityRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CityService {

    private final CityRepository cityRepository;


    public CityService(CityRepository cityRepository) {

        this.cityRepository = cityRepository;

    }


    // =====================================================
    // GET ALL CITIES
    // =====================================================

    public List<City> getAllCities() {

        return cityRepository.findAll();

    }


    // =====================================================
    // GET CITY BY ID
    // =====================================================

    public Optional<City> getCityById(Integer id) {

        return cityRepository.findById(id);

    }


    // =====================================================
    // GET CITIES BY STATE
    // =====================================================

    public List<CityDropdownResponse> getCitiesByState(
            Integer stateId) {

        List<City> cities =
                cityRepository.findByStateStateId(stateId);


        return cities.stream()

                .map(city ->
                        new CityDropdownResponse(
                                city.getCityId(),
                                city.getCityName()
                        )
                )

                .collect(Collectors.toList());

    }


    // =====================================================
    // CREATE CITY
    // =====================================================

    public City createCity(City city) {

        if (city.getCityStatus() == null ||
                city.getCityStatus().trim().isEmpty()) {

            city.setCityStatus("Active");

        }


        if (city.getCityOndate() == null) {

            city.setCityOndate(
                    LocalDateTime.now()
            );

        }


        return cityRepository.save(city);

    }


    // =====================================================
    // UPDATE CITY
    // =====================================================

    public City updateCity(
            Integer id,
            City cityDetails) {

        City city =
                cityRepository.findById(id)

                        .orElseThrow(
                                () -> new RuntimeException(
                                        "City not found with id: "
                                                + id
                                )
                        );


        city.setCityName(
                cityDetails.getCityName()
        );


        city.setState(
                cityDetails.getState()
        );


        city.setCityStatus(
                cityDetails.getCityStatus()
        );


        return cityRepository.save(city);

    }


    // =====================================================
    // DELETE CITY
    // =====================================================

    public void deleteCity(Integer id) {

        if (!cityRepository.existsById(id)) {

            throw new RuntimeException(
                    "City not found with id: " + id
            );

        }


        cityRepository.deleteById(id);

    }

}