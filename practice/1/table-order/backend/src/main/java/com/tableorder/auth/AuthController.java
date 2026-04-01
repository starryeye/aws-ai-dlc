package com.tableorder.auth;

import com.tableorder.auth.dto.LoginRequest;
import com.tableorder.auth.dto.TokenResponse;
import com.tableorder.auth.dto.UserInfo;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.authenticate(request));
    }

    @GetMapping("/validate")
    public ResponseEntity<UserInfo> validateToken(@AuthenticationPrincipal UserInfo userInfo) {
        return ResponseEntity.ok(userInfo);
    }
}
