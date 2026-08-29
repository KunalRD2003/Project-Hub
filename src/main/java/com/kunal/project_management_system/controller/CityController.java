package com.kunal.project_management_system.controller;

import com.kunal.project_management_system.dto.CityDropdownResponse;
import com.kunal.project_management_system.entity.City;
import com.kunal.project_management_system.service.CityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cities")
@CrossOrigin(origins = "http://localhost:5173")
public class CityController {

    private final CityService cityService;


    public CityController(CityService cityService) {

        this.cityService = cityService;

    }


    // =====================================================
    // GET ALL CITIES
    // =====================================================

    @GetMapping
    public ResponseEntity<List<City>> getAllCities() {

        return ResponseEntity.ok(
                cityService.getAllCities()
        );

    }


    // =====================================================
    // GET CITIES BY STATE
    // =====================================================

    @GetMapping("/state/{stateId}")
    public ResponseEntity<List<CityDropdownResponse>>
    getCitiesByState(
            @PathVariable Integer stateId) {

        return ResponseEntity.ok(
                cityService.getCitiesByState(stateId)
        );

    }


    // =====================================================
    // GET CITY BY ID
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<City> getCityById(
            @PathVariable Integer id) {

        return cityService
                .getCityById(id)
                .map(ResponseEntity::ok)
                .orElse(
                        ResponseEntity.notFound().build()
                );

    }


    // =====================================================
    // CREATE CITY
    // =====================================================

    @PostMapping
    public ResponseEntity<City> createCity(
            @RequestBody City city) {

        return ResponseEntity.ok(
                cityService.createCity(city)
        );

    }


    // =====================================================
    // UPDATE CITY
    // =====================================================

    @PutMapping("/{id}")
    public ResponseEntity<City> updateCity(
            @PathVariable Integer id,
            @RequestBody City city) {

        return ResponseEntity.ok(
                cityService.updateCity(
                        id,
                        city
                )
        );

    }


    // =====================================================
    // DELETE CITY
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCity(
            @PathVariable Integer id) {

        cityService.deleteCity(id);

        return ResponseEntity.noContent().build();

    }

}