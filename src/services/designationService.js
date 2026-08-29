import axios from "axios";

const API_URL = "http://localhost:8083/api/designations";

export const getDesignations = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const createDesignation = async (designation) => {
    const response = await axios.post(API_URL, designation);
    return response.data;
};

export const updateDesignation = async (id, designation) => {
    const response = await axios.put(
        `${API_URL}/${id}`,
        designation
    );

    return response.data;
};

export const deleteDesignation = async (id) => {
    const response = await axios.delete(
        `${API_URL}/${id}`
    );

    return response.data;
};