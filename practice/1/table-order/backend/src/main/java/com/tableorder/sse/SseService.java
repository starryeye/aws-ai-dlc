package com.tableorder.sse;

import com.tableorder.sse.dto.OrderEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class SseService {

    private static final Logger log = LoggerFactory.getLogger(SseService.class);
    private static final long TIMEOUT = 1_800_000L; // 30 minutes

    private final Map<Long, List<SseEmitter>> emitters = new ConcurrentHashMap<>();

    public SseEmitter subscribe(Long storeId) {
        SseEmitter emitter = new SseEmitter(TIMEOUT);
        emitters.computeIfAbsent(storeId, k -> new CopyOnWriteArrayList<>()).add(emitter);

        emitter.onCompletion(() -> removeEmitter(storeId, emitter));
        emitter.onTimeout(() -> removeEmitter(storeId, emitter));
        emitter.onError(e -> removeEmitter(storeId, emitter));

        try {
            emitter.send(SseEmitter.event().name("connected").data(Map.of("storeId", storeId)));
        } catch (IOException e) {
            removeEmitter(storeId, emitter);
        }
        return emitter;
    }

    public void publishOrderEvent(Long storeId, OrderEvent event) {
        List<SseEmitter> storeEmitters = emitters.get(storeId);
        if (storeEmitters == null || storeEmitters.isEmpty()) return;

        List<SseEmitter> deadEmitters = new java.util.ArrayList<>();
        for (SseEmitter emitter : storeEmitters) {
            try {
                emitter.send(SseEmitter.event().name("orderEvent").data(event));
            } catch (IOException e) {
                deadEmitters.add(emitter);
            }
        }
        storeEmitters.removeAll(deadEmitters);
    }

    private void removeEmitter(Long storeId, SseEmitter emitter) {
        List<SseEmitter> storeEmitters = emitters.get(storeId);
        if (storeEmitters != null) {
            storeEmitters.remove(emitter);
        }
    }
}
