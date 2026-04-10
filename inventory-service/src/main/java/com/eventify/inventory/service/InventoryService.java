package com.eventify.inventory.service;

import com.eventify.inventory.dto.InventoryRequest;
import com.eventify.inventory.dto.InventoryResponse;
import com.eventify.inventory.entity.InventoryItem;
import com.eventify.inventory.repository.InventoryRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InventoryService {

    @Autowired
    private InventoryRepository inventoryRepository;

    // Create inventory
    public InventoryResponse createInventory(InventoryRequest request) {

        InventoryItem item = new InventoryItem();

        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setTotalQuantity(request.getTotalQuantity());
        item.setAvailableQuantity(request.getAvailableQuantity());
        item.setType(request.getType());
        item.setStatus(request.getStatus());

        InventoryItem saved = inventoryRepository.save(item);

        return mapToResponse(saved);
    }

    // Get all inventory
    public List<InventoryResponse> getAllInventory() {
        return inventoryRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get inventory by ID
    public InventoryResponse getInventoryById(Long id) {

        InventoryItem item = inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory not found with id: " + id));

        return mapToResponse(item);
    }

    // Update inventory
    public InventoryResponse updateInventory(Long id, InventoryRequest request) {

        InventoryItem existing = inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory not found with id: " + id));

        existing.setName(request.getName());
        existing.setDescription(request.getDescription());
        existing.setTotalQuantity(request.getTotalQuantity());
        existing.setAvailableQuantity(request.getAvailableQuantity());
        existing.setType(request.getType());
        existing.setStatus(request.getStatus());

        InventoryItem updated = inventoryRepository.save(existing);

        return mapToResponse(updated);
    }

    // Delete inventory
    public void deleteInventory(Long id) {
        inventoryRepository.deleteById(id);
    }

    // Check stock availability
    public boolean isAvailable(Long itemId, int quantityNeeded) {

        InventoryItem item = inventoryRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Inventory not found"));

        return item.getAvailableQuantity() >= quantityNeeded;
    }

    // Reduce stock after booking
    public void reduceStock(Long itemId, int quantity) {

        InventoryItem item = inventoryRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Inventory not found"));

        if (item.getAvailableQuantity() < quantity) {
            throw new RuntimeException("Not enough stock available");
        }

        item.setAvailableQuantity(item.getAvailableQuantity() - quantity);
        inventoryRepository.save(item);
    }

    private InventoryResponse mapToResponse(InventoryItem item) {

        InventoryResponse response = new InventoryResponse();

        response.setId(item.getId());
        response.setName(item.getName());
        response.setDescription(item.getDescription());
        response.setTotalQuantity(item.getTotalQuantity());
        response.setAvailableQuantity(item.getAvailableQuantity());
        response.setType(item.getType());
        response.setStatus(item.getStatus());
        response.setCreatedAt(item.getCreatedAt());
        response.setUpdatedAt(item.getUpdatedAt());

        return response;
    }
}