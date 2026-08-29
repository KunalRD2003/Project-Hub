package com.kunal.project_management_system.dto;

public class CityDropdownResponse {

    private Integer cityId;

    private String cityName;


    public CityDropdownResponse() {
    }


    public CityDropdownResponse(
            Integer cityId,
            String cityName) {

        this.cityId = cityId;

        this.cityName = cityName;

    }


    public Integer getCityId() {

        return cityId;

    }


    public void setCityId(Integer cityId) {

        this.cityId = cityId;

    }


    public String getCityName() {

        return cityName;

    }


    public void setCityName(String cityName) {

        this.cityName = cityName;

    }

}