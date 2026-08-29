package com.kunal.project_management_system.controller;

import com.kunal.project_management_system.entity.Client;
import com.kunal.project_management_system.service.ClientService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
@CrossOrigin(origins = "http://localhost:5173")
public class ClientController {

    private final ClientService clientService;


    public ClientController(ClientService clientService) {

        this.clientService = clientService;

    }


    // =========================
    // GET ALL CLIENTS
    // =========================

    @GetMapping
    public ResponseEntity<List<Client>> getAllClients() {

        return ResponseEntity.ok(
                clientService.getAllClients()
        );

    }


    // =========================
    // GET CLIENT BY ID
    // =========================

    @GetMapping("/{id}")
    public ResponseEntity<Client> getClientById(
            @PathVariable Integer id) {

        return clientService
                .getClientById(id)
                .map(ResponseEntity::ok)
                .orElse(
                        ResponseEntity
                                .notFound()
                                .build()
                );

    }


    // =========================
    // ADD CLIENT
    // =========================

    @PostMapping
    public ResponseEntity<Client> addClient(
            @RequestBody Client client) {

        return ResponseEntity.ok(
                clientService.addClient(client)
        );

    }


    // =========================
    // UPDATE CLIENT
    // =========================

    @PutMapping("/{id}")
    public ResponseEntity<Client> updateClient(
            @PathVariable Integer id,
            @RequestBody Client client) {

        return ResponseEntity.ok(
                clientService.updateClient(
                        id,
                        client
                )
        );

    }


    // =========================
    // DELETE CLIENT
    // =========================

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteClient(
            @PathVariable Integer id) {

        clientService.deleteClient(id);

        return ResponseEntity.ok(
                "Client deleted successfully"
        );

    }

}