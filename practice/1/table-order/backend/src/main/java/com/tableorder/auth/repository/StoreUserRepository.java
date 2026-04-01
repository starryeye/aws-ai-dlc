package com.tableorder.auth.repository;

import com.tableorder.auth.entity.StoreUser;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface StoreUserRepository extends JpaRepository<StoreUser, Long> {
    Optional<StoreUser> findByStoreIdAndUsername(Long storeId, String username);
}
