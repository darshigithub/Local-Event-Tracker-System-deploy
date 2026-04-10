package com.eventify.inventory.repository;

import com.eventify.inventory.entity.InventoryItem;
import com.eventify.inventory.entity.ItemStatus;
import com.eventify.inventory.entity.ItemType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InventoryRepository extends JpaRepository<InventoryItem, Long> {

    // Find by name
    Optional<InventoryItem> findByName(String name);

    // Get items by type (MIC, PROJECTOR, LIGHT, WATER, etc.)
    List<InventoryItem> findByType(ItemType type);

    // Get items by status (AVAILABLE / OUT_OF_STOCK / MAINTENANCE)
    List<InventoryItem> findByStatus(ItemStatus status);

    // Get only items that still have quantity
    List<InventoryItem> findByAvailableQuantityGreaterThan(Integer quantity);

}