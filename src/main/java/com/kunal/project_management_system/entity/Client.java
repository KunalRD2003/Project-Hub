package com.kunal.project_management_system.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "clients")
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "client_id")
    private Integer clientId;

    @Column(name = "client_name", nullable = false)
    private String clientName;

    @Column(name = "client_address")
    private String clientAddress;

    @Column(name = "client_city")
    private String clientCity;

    @Column(name = "client_state")
    private String clientState;

    @Column(name = "client_status")
    private String clientStatus;

    @Column(name = "client_ondate")
    private LocalDateTime clientOnDate;


    /*
     * These two fields are used by React.
     *
     * They are NOT stored directly in the clients table.
     * They are only used to receive/send State ID and City ID.
     */

    @Transient
    private Integer clientStateId;

    @Transient
    private Integer clientCityId;


    public Client() {
    }


    // =========================
    // CLIENT ID
    // =========================

    public Integer getClientId() {

        return clientId;

    }

    public void setClientId(Integer clientId) {

        this.clientId = clientId;

    }


    // =========================
    // CLIENT NAME
    // =========================

    public String getClientName() {

        return clientName;

    }

    public void setClientName(String clientName) {

        this.clientName = clientName;

    }


    // =========================
    // CLIENT ADDRESS
    // =========================

    public String getClientAddress() {

        return clientAddress;

    }

    public void setClientAddress(String clientAddress) {

        this.clientAddress = clientAddress;

    }


    // =========================
    // CLIENT CITY
    // =========================

    public String getClientCity() {

        return clientCity;

    }

    public void setClientCity(String clientCity) {

        this.clientCity = clientCity;

    }


    // =========================
    // CLIENT STATE
    // =========================

    public String getClientState() {

        return clientState;

    }

    public void setClientState(String clientState) {

        this.clientState = clientState;

    }


    // =========================
    // CLIENT STATUS
    // =========================

    public String getClientStatus() {

        return clientStatus;

    }

    public void setClientStatus(String clientStatus) {

        this.clientStatus = clientStatus;

    }


    // =========================
    // CLIENT ON DATE
    // =========================

    public LocalDateTime getClientOnDate() {

        return clientOnDate;

    }

    public void setClientOnDate(LocalDateTime clientOnDate) {

        this.clientOnDate = clientOnDate;

    }


    // =========================
    // CLIENT STATE ID
    // =========================

    public Integer getClientStateId() {

        return clientStateId;

    }

    public void setClientStateId(Integer clientStateId) {

        this.clientStateId = clientStateId;

    }


    // =========================
    // CLIENT CITY ID
    // =========================

    public Integer getClientCityId() {

        return clientCityId;

    }

    public void setClientCityId(Integer clientCityId) {

        this.clientCityId = clientCityId;

    }

}