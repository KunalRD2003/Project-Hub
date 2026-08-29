package com.kunal.project_management_system.service;

import com.kunal.project_management_system.entity.City;
import com.kunal.project_management_system.entity.Client;
import com.kunal.project_management_system.entity.State;
import com.kunal.project_management_system.repository.CityRepository;
import com.kunal.project_management_system.repository.ClientRepository;
import com.kunal.project_management_system.repository.StateRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClientService {

    private final ClientRepository clientRepository;

    private final StateRepository stateRepository;

    private final CityRepository cityRepository;


    public ClientService(
            ClientRepository clientRepository,
            StateRepository stateRepository,
            CityRepository cityRepository) {

        this.clientRepository = clientRepository;

        this.stateRepository = stateRepository;

        this.cityRepository = cityRepository;

    }


    // =========================
    // GET ALL CLIENTS
    // =========================

    public List<Client> getAllClients() {

        List<Client> clients =
                clientRepository.findAll();


        /*
         * Fill State ID and City ID
         * for React edit form.
         */

        for (Client client : clients) {

            populateLocationIds(client);

        }


        return clients;

    }


    // =========================
    // GET CLIENT BY ID
    // =========================

    public Optional<Client> getClientById(
            Integer id) {

        Optional<Client> client =
                clientRepository.findById(id);


        if (client.isPresent()) {

            populateLocationIds(
                    client.get()
            );

        }


        return client;

    }


    // =========================
    // ADD CLIENT
    // =========================

    public Client addClient(Client client) {

        /*
         * Convert State ID and City ID
         * into State/City names.
         */

        setLocationNames(client);


        /*
         * Default status.
         */

        if (client.getClientStatus() == null ||
                client.getClientStatus()
                        .trim()
                        .isEmpty()) {

            client.setClientStatus("Active");

        }


        return clientRepository.save(client);

    }


    // =========================
    // UPDATE CLIENT
    // =========================

    public Client updateClient(
            Integer id,
            Client clientDetails) {

        Client client =
                clientRepository.findById(id)

                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Client not found with id: "
                                                + id
                                )
                        );


        client.setClientName(
                clientDetails.getClientName()
        );


        client.setClientAddress(
                clientDetails.getClientAddress()
        );


        /*
         * Set State and City names
         * using their IDs.
         */

        setLocationNames(clientDetails);


        client.setClientCity(
                clientDetails.getClientCity()
        );


        client.setClientState(
                clientDetails.getClientState()
        );


        client.setClientStatus(
                clientDetails.getClientStatus()
        );


        client.setClientOnDate(
                clientDetails.getClientOnDate()
        );


        Client savedClient =
                clientRepository.save(client);


        /*
         * Return IDs to React.
         */

        savedClient.setClientStateId(
                clientDetails.getClientStateId()
        );


        savedClient.setClientCityId(
                clientDetails.getClientCityId()
        );


        return savedClient;

    }


    // =========================
    // DELETE CLIENT
    // =========================

    public void deleteClient(Integer id) {

        if (!clientRepository.existsById(id)) {

            throw new RuntimeException(
                    "Client not found with id: " + id
            );

        }


        clientRepository.deleteById(id);

    }


    // =========================
    // SET LOCATION NAMES
    // =========================

    private void setLocationNames(
            Client client) {


        // =========================
        // STATE
        // =========================

        if (client.getClientStateId() != null) {

            State state =
                    stateRepository
                            .findById(
                                    client.getClientStateId()
                            )
                            .orElseThrow(
                                    () -> new RuntimeException(
                                            "State not found with id: "
                                                    + client.getClientStateId()
                                    )
                            );


            client.setClientState(
                    state.getStateName()
            );

        }


        // =========================
        // CITY
        // =========================

        if (client.getClientCityId() != null) {

            City city =
                    cityRepository
                            .findById(
                                    client.getClientCityId()
                            )
                            .orElseThrow(
                                    () -> new RuntimeException(
                                            "City not found with id: "
                                                    + client.getClientCityId()
                                    )
                            );


            /*
             * Make sure the selected city
             * belongs to the selected state.
             */

            if (client.getClientStateId() != null &&
                    city.getState() != null &&
                    !city.getState()
                            .getStateId()
                            .equals(
                                    client.getClientStateId()
                            )) {

                throw new RuntimeException(
                        "Selected city does not belong to selected state."
                );

            }


            client.setClientCity(
                    city.getCityName()
            );

        }

    }


    // =========================
    // POPULATE LOCATION IDS
    // =========================

    private void populateLocationIds(
            Client client) {


        // =========================
        // FIND STATE ID
        // =========================

        if (client.getClientState() != null &&
                !client.getClientState()
                        .trim()
                        .isEmpty()) {

            stateRepository
                    .findByStateName(
                            client.getClientState()
                    )
                    .ifPresent(
                            state ->
                                    client.setClientStateId(
                                            state.getStateId()
                                    )
                    );

        }


        // =========================
        // FIND CITY ID
        // =========================

        if (client.getClientCity() != null &&
                !client.getClientCity()
                        .trim()
                        .isEmpty()) {

            cityRepository
                    .findByCityName(
                            client.getClientCity()
                    )
                    .ifPresent(
                            city ->
                                    client.setClientCityId(
                                            city.getCityId()
                                    )
                    );

        }

    }

}