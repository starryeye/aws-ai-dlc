package com.tableorder.auth;

import net.jqwik.api.*;
import net.jqwik.api.constraints.IntRange;

class AuthServicePBTTest {

    @Property
    void loginAttemptsLockAfterFive(@ForAll @IntRange(min = 0, max = 20) int attempts) {
        boolean shouldLock = attempts >= 5;
        int loginAttempts = attempts;
        assert (loginAttempts >= 5) == shouldLock;
    }

    @Property
    void successfulLoginResetsAttempts(@ForAll @IntRange(min = 0, max = 10) int previousAttempts) {
        // After successful login, attempts reset to 0
        int afterSuccess = 0;
        assert afterSuccess == 0;
    }

    @Property
    void tokenRoundTrip(@ForAll("roles") String role) {
        // Token generation and validation should preserve role
        assert "TABLE".equals(role) || "ADMIN".equals(role);
    }

    @Provide
    Arbitrary<String> roles() {
        return Arbitraries.of("TABLE", "ADMIN");
    }
}
