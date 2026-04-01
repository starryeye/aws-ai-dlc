package com.tableorder.menu.repository;

import com.tableorder.menu.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    List<MenuItem> findByStoreIdAndDeletedFalseOrderByDisplayOrder(Long storeId);
    List<MenuItem> findByStoreIdAndCategoryIdAndDeletedFalseOrderByDisplayOrder(Long storeId, Long categoryId);
    Optional<MenuItem> findByIdAndStoreIdAndDeletedFalse(Long id, Long storeId);
}
