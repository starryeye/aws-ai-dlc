package com.tableorder.menu.repository;

import com.tableorder.menu.entity.MenuCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MenuCategoryRepository extends JpaRepository<MenuCategory, Long> {
    List<MenuCategory> findByStoreIdOrderByDisplayOrder(Long storeId);
    boolean existsByStoreIdAndName(Long storeId, String name);
}
