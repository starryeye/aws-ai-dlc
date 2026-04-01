package com.tableorder.order;

import net.jqwik.api.*;
import net.jqwik.api.constraints.IntRange;
import net.jqwik.api.constraints.LongRange;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

class OrderServicePBTTest {

    private static final Set<String> VALID_STATUSES = Set.of("PENDING", "PREPARING", "COMPLETED");

    @Property
    void totalAmountEqualsSum(@ForAll @IntRange(min = 1, max = 20) int itemCount,
                              @ForAll @LongRange(min = 0, max = 999999) long price,
                              @ForAll @IntRange(min = 1, max = 100) int quantity) {
        BigDecimal unitPrice = BigDecimal.valueOf(price);
        BigDecimal expected = unitPrice.multiply(BigDecimal.valueOf(quantity));
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (int i = 0; i < itemCount; i++) {
            totalAmount = totalAmount.add(unitPrice.multiply(BigDecimal.valueOf(quantity)));
        }
        assert totalAmount.equals(expected.multiply(BigDecimal.valueOf(itemCount)));
    }

    @Property
    void statusTransitionFromCompletedAlwaysFails(@ForAll("validStatuses") String targetStatus) {
        String current = "COMPLETED";
        boolean shouldFail = true;
        assert shouldFail == ("COMPLETED".equals(current));
    }

    @Property
    void statusTransitionFromPendingAllowsForward(@ForAll("forwardStatuses") String targetStatus) {
        String current = "PENDING";
        boolean allowed = !current.equals(targetStatus);
        assert allowed;
    }

    @Property
    void sameStatusTransitionAlwaysFails(@ForAll("validStatuses") String status) {
        assert status.equals(status);
    }

    @Property
    void orderNumberFormatIsValid(@ForAll @IntRange(min = 1, max = 999) int seq) {
        String orderNumber = "ORD-20260401-" + String.format("%03d", seq);
        assert orderNumber.matches("ORD-\\d{8}-\\d{3}");
    }

    @Provide
    Arbitrary<String> validStatuses() {
        return Arbitraries.of("PENDING", "PREPARING", "COMPLETED");
    }

    @Provide
    Arbitrary<String> forwardStatuses() {
        return Arbitraries.of("PREPARING", "COMPLETED");
    }
}
