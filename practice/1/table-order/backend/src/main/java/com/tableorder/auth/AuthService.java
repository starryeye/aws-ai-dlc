package com.tableorder.auth;

import com.tableorder.auth.dto.LoginRequest;
import com.tableorder.auth.dto.TokenResponse;
import com.tableorder.auth.dto.UserInfo;
import com.tableorder.auth.entity.StoreUser;
import com.tableorder.auth.repository.StoreUserRepository;
import com.tableorder.common.entity.Store;
import com.tableorder.common.repository.StoreRepository;
import com.tableorder.table.entity.TableEntity;
import com.tableorder.table.entity.TableSession;
import com.tableorder.table.repository.TableRepository;
import com.tableorder.table.repository.TableSessionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {

    private final StoreRepository storeRepository;
    private final StoreUserRepository storeUserRepository;
    private final TableRepository tableRepository;
    private final TableSessionRepository tableSessionRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    public AuthService(StoreRepository storeRepository, StoreUserRepository storeUserRepository,
                       TableRepository tableRepository, TableSessionRepository tableSessionRepository,
                       JwtTokenProvider jwtTokenProvider, PasswordEncoder passwordEncoder) {
        this.storeRepository = storeRepository;
        this.storeUserRepository = storeUserRepository;
        this.tableRepository = tableRepository;
        this.tableSessionRepository = tableSessionRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public TokenResponse authenticate(LoginRequest request) {
        Store store = storeRepository.findByStoreCode(request.storeCode())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "매장을 찾을 수 없습니다"));

        if ("TABLE".equals(request.role())) {
            return authenticateTable(store, request);
        } else if ("ADMIN".equals(request.role())) {
            return authenticateAdmin(store, request);
        }
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "잘못된 역할입니다");
    }

    private TokenResponse authenticateTable(Store store, LoginRequest request) {
        TableEntity table = tableRepository.findByStoreIdAndTableNumber(store.getId(), request.username())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "테이블을 찾을 수 없습니다"));

        if (!passwordEncoder.matches(request.password(), table.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "비밀번호가 일치하지 않습니다");
        }

        TableSession session = getOrCreateSession(store.getId(), table.getId());
        String token = jwtTokenProvider.generateToken(store.getId(), "TABLE", table.getId(), null, session.getId());
        return new TokenResponse(token, jwtTokenProvider.getExpirationSeconds(), "TABLE", store.getId());
    }

    private TokenResponse authenticateAdmin(Store store, LoginRequest request) {
        StoreUser user = storeUserRepository.findByStoreIdAndUsername(store.getId(), request.username())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다"));

        if (user.getLockedUntil() != null && user.getLockedUntil().isAfter(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.LOCKED, "계정이 잠겨 있습니다");
        }

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            user.setLoginAttempts(user.getLoginAttempts() + 1);
            if (user.getLoginAttempts() >= 5) {
                user.setLockedUntil(LocalDateTime.now().plusMinutes(15));
            }
            storeUserRepository.save(user);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "비밀번호가 일치하지 않습니다");
        }

        user.setLoginAttempts(0);
        user.setLockedUntil(null);
        storeUserRepository.save(user);

        String token = jwtTokenProvider.generateToken(store.getId(), "ADMIN", null, user.getId(), null);
        return new TokenResponse(token, jwtTokenProvider.getExpirationSeconds(), "ADMIN", store.getId());
    }

    private TableSession getOrCreateSession(Long storeId, Long tableId) {
        return tableSessionRepository.findByTableIdAndActiveTrue(tableId)
                .map(session -> {
                    if (session.getExpiresAt().isBefore(LocalDateTime.now())) {
                        session.setActive(false);
                        session.setCompletedAt(LocalDateTime.now());
                        tableSessionRepository.save(session);
                        return createNewSession(storeId, tableId);
                    }
                    return session;
                })
                .orElseGet(() -> createNewSession(storeId, tableId));
    }

    private TableSession createNewSession(Long storeId, Long tableId) {
        TableSession session = new TableSession(
                UUID.randomUUID().toString(), storeId, tableId,
                LocalDateTime.now().plusHours(16));
        return tableSessionRepository.save(session);
    }

    public UserInfo validateTokenInfo(String token) {
        return jwtTokenProvider.validateToken(token);
    }
}
