package com.tableorder.menu;

import com.tableorder.menu.dto.MenuItemRequest;
import com.tableorder.menu.dto.MenuOrderRequest;
import com.tableorder.menu.entity.MenuCategory;
import com.tableorder.menu.entity.MenuItem;
import com.tableorder.menu.repository.MenuCategoryRepository;
import com.tableorder.menu.repository.MenuItemRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MenuService {

    private final MenuCategoryRepository categoryRepository;
    private final MenuItemRepository menuItemRepository;

    public MenuService(MenuCategoryRepository categoryRepository, MenuItemRepository menuItemRepository) {
        this.categoryRepository = categoryRepository;
        this.menuItemRepository = menuItemRepository;
    }

    public List<MenuCategory> getCategories(Long storeId) {
        return categoryRepository.findByStoreIdOrderByDisplayOrder(storeId);
    }

    public List<MenuItem> getMenuItems(Long storeId, Long categoryId) {
        if (categoryId != null) {
            return menuItemRepository.findByStoreIdAndCategoryIdAndDeletedFalseOrderByDisplayOrder(storeId, categoryId);
        }
        return menuItemRepository.findByStoreIdAndDeletedFalseOrderByDisplayOrder(storeId);
    }

    public MenuItem getMenuItem(Long storeId, Long menuId) {
        return menuItemRepository.findByIdAndStoreIdAndDeletedFalse(menuId, storeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "메뉴를 찾을 수 없습니다"));
    }

    @Transactional
    public MenuItem createMenuItem(Long storeId, MenuItemRequest request) {
        categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "카테고리를 찾을 수 없습니다"));
        MenuItem item = new MenuItem();
        item.setStoreId(storeId);
        item.setCategoryId(request.categoryId());
        item.setName(request.name());
        item.setPrice(request.price());
        item.setDescription(request.description());
        item.setImageUrl(request.imageUrl());
        item.setDisplayOrder(request.displayOrder() != null ? request.displayOrder() : 0);
        return menuItemRepository.save(item);
    }

    @Transactional
    public MenuItem updateMenuItem(Long storeId, Long menuId, MenuItemRequest request) {
        MenuItem item = getMenuItem(storeId, menuId);
        if (request.name() != null) item.setName(request.name());
        if (request.price() != null) item.setPrice(request.price());
        if (request.description() != null) item.setDescription(request.description());
        if (request.categoryId() != null) {
            categoryRepository.findById(request.categoryId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "카테고리를 찾을 수 없습니다"));
            item.setCategoryId(request.categoryId());
        }
        if (request.imageUrl() != null) item.setImageUrl(request.imageUrl());
        if (request.displayOrder() != null) item.setDisplayOrder(request.displayOrder());
        item.setUpdatedAt(LocalDateTime.now());
        return menuItemRepository.save(item);
    }

    @Transactional
    public void deleteMenuItem(Long storeId, Long menuId) {
        MenuItem item = getMenuItem(storeId, menuId);
        item.setDeleted(true);
        item.setUpdatedAt(LocalDateTime.now());
        menuItemRepository.save(item);
    }

    @Transactional
    public void updateMenuOrder(Long storeId, List<MenuOrderRequest> requests) {
        for (MenuOrderRequest req : requests) {
            MenuItem item = menuItemRepository.findByIdAndStoreIdAndDeletedFalse(req.menuId(), storeId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "메뉴를 찾을 수 없습니다: " + req.menuId()));
            item.setDisplayOrder(req.displayOrder());
            menuItemRepository.save(item);
        }
    }
}
