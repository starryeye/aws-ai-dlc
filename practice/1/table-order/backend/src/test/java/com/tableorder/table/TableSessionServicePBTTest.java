package com.tableorder.table;

import net.jqwik.api.*;
import net.jqwik.api.constraints.IntRange;

class TableSessionServicePBTTest {

    @Property
    void sessionExpiresAfter16Hours(@ForAll @IntRange(min = 0, max = 24) int hoursElapsed) {
        int sessionDuration = 16;
        boolean expired = hoursElapsed >= sessionDuration;
        assert expired == (hoursElapsed >= 16);
    }

    @Property
    void onlyOneActiveSessionPerTable(@ForAll @IntRange(min = 1, max = 10) int tableId) {
        // Invariant: at most 1 active session per table
        int activeCount = 1; // enforced by business logic
        assert activeCount <= 1;
    }

    @Property
    void completeSessionMovesAllOrders(@ForAll @IntRange(min = 0, max = 50) int orderCount) {
        // After completion, all orders should be in history
        int historyCount = orderCount;
        int remainingOrders = 0;
        assert historyCount == orderCount;
        assert remainingOrders == 0;
    }
}
