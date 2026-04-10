package com.eventify.client;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

/* Inventory Client for interacting with the inventory service */

// Rest Template - synchronous HTTP client provided by the Spring Framework.
// It is used to call REST APIs from a Spring Boot application.
// RestTemplate allows one Spring Boot application to communicate with another application using HTTP (GET, POST, PUT, DELETE). 

/*  RestTemplate is mainly used when: 
        * Calling external APIs
        * Communication between microservices
        * Sending HTTP requests from backend
*/

@Service
public class InventoryClient {

    private final RestTemplate restTemplate;

    private final String INVENTORY_BASE_URL = "http://localhost:8082/api/inventory";

    public InventoryClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public boolean checkAvailability(Long itemId, int quantity) {
        String url = INVENTORY_BASE_URL +
                "/check?itemId=" + itemId + "&quantity=" + quantity;

        return restTemplate.getForObject(url, Boolean.class);
    }

    public void reduceStock(Long itemId, int quantity) {
        String url = INVENTORY_BASE_URL +
                "/reduce?itemId=" + itemId + "&quantity=" + quantity;

        restTemplate.postForObject(url, null, String.class);
    }

    public void increaseStock(Long itemId, int quantity) {
        String url = INVENTORY_BASE_URL +
                "/increase?itemId=" + itemId + "&quantity=" + quantity;

        restTemplate.postForObject(url, null, String.class);
    }
}