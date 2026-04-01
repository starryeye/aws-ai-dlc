package com.tableorder.table;

import com.tableorder.order.entity.OrderHistory;
import com.tableorder.table.entity.TableEntity;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/stores/{storeId}/tables")
public class TableController {

    private final TableSessionService tableSessionService;

    public TableController(TableSessionService tableSessionService) {
        this.tableSessionService = tableSessionService;
    }

    @GetMapping
    public ResponseEntity<List<TableEntity>> getTables(@PathVariable Long storeId) {
        return ResponseEntity.ok(tableSessionService.getTables(storeId));
    }

    @PostMapping("/{tableId}/complete")
    public ResponseEntity<Void> completeTable(@PathVariable Long storeId, @PathVariable Long tableId) {
        tableSessionService.completeSession(storeId, tableId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{tableId}/history")
    public ResponseEntity<List<OrderHistory>> getTableHistory(
            @PathVariable Long storeId, @PathVariable Long tableId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo) {
        return ResponseEntity.ok(tableSessionService.getTableHistory(storeId, tableId, dateFrom, dateTo));
    }
}
