package com.tableorder.common;

import com.tableorder.auth.entity.StoreUser;
import com.tableorder.auth.repository.StoreUserRepository;
import com.tableorder.common.entity.Store;
import com.tableorder.common.repository.StoreRepository;
import com.tableorder.menu.entity.MenuCategory;
import com.tableorder.menu.entity.MenuItem;
import com.tableorder.menu.repository.MenuCategoryRepository;
import com.tableorder.menu.repository.MenuItemRepository;
import com.tableorder.table.entity.TableEntity;
import com.tableorder.table.repository.TableRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final StoreRepository storeRepository;
    private final StoreUserRepository storeUserRepository;
    private final TableRepository tableRepository;
    private final MenuCategoryRepository categoryRepository;
    private final MenuItemRepository menuItemRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(StoreRepository storeRepository, StoreUserRepository storeUserRepository,
                           TableRepository tableRepository, MenuCategoryRepository categoryRepository,
                           MenuItemRepository menuItemRepository, PasswordEncoder passwordEncoder) {
        this.storeRepository = storeRepository;
        this.storeUserRepository = storeUserRepository;
        this.tableRepository = tableRepository;
        this.categoryRepository = categoryRepository;
        this.menuItemRepository = menuItemRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (storeRepository.count() > 0) {
            log.info("Seed data already exists, skipping initialization");
            return;
        }
        log.info("Initializing seed data...");
        initStore1();
        initStore2();
        log.info("Seed data initialization complete");
    }

    private void initStore1() {
        Store store = storeRepository.save(new Store("STORE001", "맛있는 식당"));
        Long sid = store.getId();
        storeUserRepository.save(new StoreUser(sid, "admin", passwordEncoder.encode("admin123")));
        for (int i = 1; i <= 5; i++) {
            tableRepository.save(new TableEntity(sid, "T0" + i, passwordEncoder.encode("table" + i)));
        }

        MenuCategory main1 = categoryRepository.save(new MenuCategory(sid, "메인", 1));
        MenuCategory side1 = categoryRepository.save(new MenuCategory(sid, "사이드", 2));
        MenuCategory drink1 = categoryRepository.save(new MenuCategory(sid, "음료", 3));
        MenuCategory dessert1 = categoryRepository.save(new MenuCategory(sid, "디저트", 4));
        MenuCategory alcohol1 = categoryRepository.save(new MenuCategory(sid, "주류", 5));

        saveMenu(sid, main1.getId(), "김치찌개", 8000, "돼지고기 김치찌개", 1);
        saveMenu(sid, main1.getId(), "된장찌개", 7000, "두부 된장찌개", 2);
        saveMenu(sid, main1.getId(), "불고기", 12000, "양념 소불고기", 3);
        saveMenu(sid, main1.getId(), "비빔밥", 9000, "야채 비빔밥", 4);
        saveMenu(sid, side1.getId(), "계란말이", 5000, "치즈 계란말이", 1);
        saveMenu(sid, side1.getId(), "김치전", 6000, "바삭한 김치전", 2);
        saveMenu(sid, drink1.getId(), "콜라", 2000, "코카콜라 355ml", 1);
        saveMenu(sid, drink1.getId(), "사이다", 2000, "칠성사이다 355ml", 2);
        saveMenu(sid, dessert1.getId(), "아이스크림", 3000, "바닐라 아이스크림", 1);
        saveMenu(sid, alcohol1.getId(), "소주", 5000, "참이슬", 1);
    }

    private void initStore2() {
        Store store = storeRepository.save(new Store("STORE002", "행복한 카페"));
        Long sid = store.getId();
        storeUserRepository.save(new StoreUser(sid, "admin", passwordEncoder.encode("admin123")));
        for (int i = 1; i <= 5; i++) {
            tableRepository.save(new TableEntity(sid, "T0" + i, passwordEncoder.encode("table" + i)));
        }

        MenuCategory coffee = categoryRepository.save(new MenuCategory(sid, "커피", 1));
        MenuCategory tea = categoryRepository.save(new MenuCategory(sid, "차", 2));
        MenuCategory juice = categoryRepository.save(new MenuCategory(sid, "주스", 3));
        MenuCategory bakery = categoryRepository.save(new MenuCategory(sid, "베이커리", 4));
        MenuCategory dessert2 = categoryRepository.save(new MenuCategory(sid, "디저트", 5));

        saveMenu(sid, coffee.getId(), "아메리카노", 4500, "에스프레소 + 물", 1);
        saveMenu(sid, coffee.getId(), "카페라떼", 5000, "에스프레소 + 우유", 2);
        saveMenu(sid, coffee.getId(), "카푸치노", 5000, "에스프레소 + 스팀밀크", 3);
        saveMenu(sid, tea.getId(), "녹차", 4000, "제주 녹차", 1);
        saveMenu(sid, tea.getId(), "캐모마일", 4500, "캐모마일 허브티", 2);
        saveMenu(sid, juice.getId(), "오렌지주스", 5500, "생과일 오렌지", 1);
        saveMenu(sid, juice.getId(), "딸기스무디", 6000, "딸기 + 요거트", 2);
        saveMenu(sid, bakery.getId(), "크로와상", 3500, "버터 크로와상", 1);
        saveMenu(sid, bakery.getId(), "베이글", 3000, "플레인 베이글", 2);
        saveMenu(sid, dessert2.getId(), "치즈케이크", 6500, "뉴욕 치즈케이크", 1);
    }

    private void saveMenu(Long storeId, Long categoryId, String name, int price, String desc, int order) {
        MenuItem item = new MenuItem();
        item.setStoreId(storeId);
        item.setCategoryId(categoryId);
        item.setName(name);
        item.setPrice(BigDecimal.valueOf(price));
        item.setDescription(desc);
        item.setDisplayOrder(order);
        menuItemRepository.save(item);
    }
}
