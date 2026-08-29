import api from "./api";

export const getCities = async () => {
    const response = await api.get("/cities");
    return response.data;
};

export const createCity = async (cityData) => {
    const response = await api.post("/cities", cityData);
    return response.data;
};

export const updateCity = async (cityId, cityData) => {
    const response = await api.put(
        `/cities/${cityId}`,
        cityData
    );
    return response.data;
};

export const deleteCity = async (cityId) => {
    const response = await api.delete(
        `/cities/${cityId}`
    );
    return response.data;
};

export const activateCity = async (cityId) => {
    const response = await api.put(
        `/cities/${cityId}/activate`
    );
    return response.data;
};