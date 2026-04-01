package com.tableorder.table.repository;

import com.tableorder.table.entity.TableEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TableRepository extends JpaRepository<TableEntity, Long> {
    Optional<TableEntity> findByStoreIdAndTableNumber(Long storeId, String tableNumber);
    List<TableEntity> findByStoreId(Long storeId);
}
