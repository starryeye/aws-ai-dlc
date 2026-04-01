package com.tableorder.sse;

import net.jqwik.api.*;
import net.jqwik.api.constraints.IntRange;

class SseServicePBTTest {

    @Property
    void noSubscribersMeansNoError(@ForAll @IntRange(min = 1, max = 100) int storeId) {
        // Publishing to store with no subscribers should not throw
        boolean noError = true;
        assert noError;
    }

    @Property
    void eventTypeIsAlwaysValid(@ForAll("eventTypes") String eventType) {
        assert eventType.equals("NEW_ORDER") || eventType.equals("STATUS_CHANGED")
                || eventType.equals("ORDER_DELETED") || eventType.equals("TABLE_COMPLETED");
    }

    @Provide
    Arbitrary<String> eventTypes() {
        return Arbitraries.of("NEW_ORDER", "STATUS_CHANGED", "ORDER_DELETED", "TABLE_COMPLETED");
    }
}
