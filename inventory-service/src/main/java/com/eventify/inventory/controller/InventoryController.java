package com.eventify.inventory.controller;

import com.eventify.inventory.dto.InventoryRequest;
import com.eventify.inventory.dto.InventoryResponse;
import com.eventify.inventory.service.InventoryService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    // Create inventory item
    @PostMapping
    public ResponseEntity<InventoryResponse> createInventory(
            @RequestBody InventoryRequest request) {

        return ResponseEntity.ok(inventoryService.createInventory(request));
    }

    // Get all inventory
    @GetMapping
    public ResponseEntity<List<InventoryResponse>> getAllInventory() {
        return ResponseEntity.ok(inventoryService.getAllInventory());
    }

    // Get inventory by id
    @GetMapping("/{id}")
    public ResponseEntity<InventoryResponse> getInventoryById(
            @PathVariable Long id) {

        return ResponseEntity.ok(inventoryService.getInventoryById(id));
    }

    // Update inventory
    @PutMapping("/{id}")
    public ResponseEntity<InventoryResponse> updateInventory(
            @PathVariable Long id,
            @RequestBody InventoryRequest request) {

        return ResponseEntity.ok(inventoryService.updateInventory(id, request));
    }

    // Delete inventory
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInventory(@PathVariable Long id) {
        inventoryService.deleteInventory(id);
        return ResponseEntity.noContent().build();
    }

    // Check availability (for Booking Service call)
    @GetMapping("/check")
    public ResponseEntity<Boolean> checkAvailability(
            @RequestParam Long itemId,
            @RequestParam int quantity) {

        return ResponseEntity.ok(inventoryService.isAvailable(itemId, quantity));
    }

    // Reduce stock after booking
    @PostMapping("/reduce")
    public ResponseEntity<String> reduceStock(
            @RequestParam Long itemId,
            @RequestParam int quantity) {

        inventoryService.reduceStock(itemId, quantity);
        return ResponseEntity.ok("Stock updated successfully");
    }
}