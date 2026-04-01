package com.tableorder.menu;

import com.tableorder.menu.dto.MenuItemRequest;
import com.tableorder.menu.dto.MenuOrderRequest;
import com.tableorder.menu.entity.MenuCategory;
import com.tableorder.menu.entity.MenuItem;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stores/{storeId}")
public class MenuController {

    private final MenuService menuService;

    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    @GetMapping("/categories")
    public ResponseEntity<List<MenuCategory>> getCategories(@PathVariable Long storeId) {
        return ResponseEntity.ok(menuService.getCategories(storeId));
    }

    @GetMapping("/menus")
    public ResponseEntity<List<MenuItem>> getMenuItems(@PathVariable Long storeId,
                                                       @RequestParam(required = false) Long categoryId) {
        return ResponseEntity.ok(menuService.getMenuItems(storeId, categoryId));
    }

    @GetMapping("/menus/{menuId}")
    public ResponseEntity<MenuItem> getMenuItem(@PathVariable Long storeId, @PathVariable Long menuId) {
        return ResponseEntity.ok(menuService.getMenuItem(storeId, menuId));
    }

    @PostMapping("/menus")
    public ResponseEntity<MenuItem> createMenuItem(@PathVariable Long storeId,
                                                   @Valid @RequestBody MenuItemRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(menuService.createMenuItem(storeId, request));
    }

    @PatchMapping("/menus/{menuId}")
    public ResponseEntity<MenuItem> updateMenuItem(@PathVariable Long storeId, @PathVariable Long menuId,
                                                   @RequestBody MenuItemRequest request) {
        return ResponseEntity.ok(menuService.updateMenuItem(storeId, menuId, request));
    }

    @DeleteMapping("/menus/{menuId}")
    public ResponseEntity<Void> deleteMenuItem(@PathVariable Long storeId, @PathVariable Long menuId) {
        menuService.deleteMenuItem(storeId, menuId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/menus/order")
    public ResponseEntity<Void> updateMenuOrder(@PathVariable Long storeId,
                                                @Valid @RequestBody List<MenuOrderRequest> requests) {
        menuService.updateMenuOrder(storeId, requests);
        return ResponseEntity.ok().build();
    }
}
