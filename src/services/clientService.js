import axios from "axios";

const API_URL = "http://localhost:8083/api/clients";


export const getClients = async () => {

    const response =
        await axios.get(API_URL);

    return response.data;
};


export const getClientById = async (id) => {

    const response =
        await axios.get(
            `${API_URL}/${id}`
        );

    return response.data;
};


export const createClient = async (client) => {

    const response =
        await axios.post(
            API_URL,
            client
        );

    return response.data;
};


export const updateClient = async (
    id,
    client
) => {

    const response =
        await axios.put(
            `${API_URL}/${id}`,
            client
        );

    return response.data;
};


export const deleteClient = async (id) => {

    const response =
        await axios.delete(
            `${API_URL}/${id}`
        );

    return response.data;
};