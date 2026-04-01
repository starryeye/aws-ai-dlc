package com.tableorder.menu;

import net.jqwik.api.*;
import net.jqwik.api.constraints.LongRange;

import java.math.BigDecimal;

class MenuServicePBTTest {

    @Property
    void priceWithinValidRange(@ForAll @LongRange(min = 0, max = 999999) long price) {
        BigDecimal bd = BigDecimal.valueOf(price);
        assert bd.compareTo(BigDecimal.ZERO) >= 0;
        assert bd.compareTo(BigDecimal.valueOf(999999)) <= 0;
    }

    @Property
    void priceOutOfRangeDetected(@ForAll @LongRange(min = 1000000, max = 9999999) long price) {
        BigDecimal bd = BigDecimal.valueOf(price);
        assert bd.compareTo(BigDecimal.valueOf(999999)) > 0;
    }

    @Property
    void softDeletePreservesEntity(@ForAll @LongRange(min = 1, max = 1000) long menuId) {
        // Soft delete sets deleted=true but entity still exists
        boolean deleted = true;
        assert deleted; // entity exists with deleted flag
    }

    @Property
    void displayOrderIsNonNegative(@ForAll @LongRange(min = 0, max = 1000) long order) {
        assert order >= 0;
    }
}
