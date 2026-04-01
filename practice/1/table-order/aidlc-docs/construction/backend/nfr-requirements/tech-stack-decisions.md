# Unit 1: Backend API - 기술 스택 세부 결정

---

## 1. 핵심 프레임워크

| 항목 | 기술 | 버전 | 근거 |
|---|---|---|---|
| 언어 | Java | 17 | LTS, Spring Boot 3.x 최소 요구 |
| 프레임워크 | Spring Boot | 3.3.x | 최신 안정 버전, SSE/JPA/Security 통합 |
| 빌드 도구 | Gradle | 8.x | Kotlin DSL, 빠른 빌드 |

---

## 2. 데이터베이스

| 항목 | 기술 | 버전 | 근거 |
|---|---|---|---|
| DB | SQLite | 3.x | 경량, 파일 기반, 소규모 환경 적합 |
| JDBC 드라이버 | xerial sqlite-jdbc | 3.45.x | 가장 널리 사용되는 SQLite JDBC 드라이버 |
| ORM | Spring Data JPA + Hibernate | Spring Boot 내장 | 표준 JPA, 엔티티 매핑 |
| DDL 전략 | hibernate.ddl-auto=update | - | 개발 환경 간편 설정, 스키마 자동 생성/업데이트 |
| Hibernate Dialect | SQLite 커스텀 Dialect | - | SQLite 전용 SQL 방언 (커뮤니티 제공 또는 직접 구현) |

### SQLite 설정
```yaml
spring:
  datasource:
    url: jdbc:sqlite:./data/tableorder.db
    driver-class-name: org.sqlite.JDBC
  jpa:
    hibernate:
      ddl-auto: update
    database-platform: org.hibernate.community.dialect.SQLiteDialect
    show-sql: false
```

---

## 3. 인증/보안

| 항목 | 기술 | 버전 | 근거 |
|---|---|---|---|
| 인증 | JWT (jjwt) | 0.12.x | 업계 표준, 경량 |
| 해싱 | BCryptPasswordEncoder | Spring Security 내장 | bcrypt 해싱 표준 |
| 보안 프레임워크 | Spring Security | Spring Boot 내장 | 필터 체인, RBAC |

### JWT 설정
```yaml
jwt:
  secret: ${JWT_SECRET:your-256-bit-secret-key-for-development}
  expiration: 57600  # 16시간 (초)
```

### Spring Security 의존성
- spring-boot-starter-security
- jjwt-api, jjwt-impl, jjwt-jackson

---

## 4. 실시간 통신

| 항목 | 기술 | 근거 |
|---|---|---|
| SSE | Spring SseEmitter | Spring MVC 내장, 추가 의존성 없음 |
| 타임아웃 | 30분 (1,800,000ms) | 합리적 재연결 주기 |

---

## 5. 테스트

| 항목 | 기술 | 버전 | 근거 |
|---|---|---|---|
| 단위 테스트 | JUnit 5 | Spring Boot 내장 | 표준 테스트 프레임워크 |
| PBT | jqwik | 1.9.x | JUnit 5 통합, Java PBT 표준 |
| 모킹 | Mockito | Spring Boot 내장 | 서비스 레이어 단위 테스트 |
| 통합 테스트 | Spring Boot Test | 내장 | @SpringBootTest, TestRestTemplate |

### PBT 적용 범위 (전체 서비스 레이어)
| 서비스 | PBT 대상 속성 |
|---|---|
| AuthService | 토큰 생성 → 검증 왕복, 잠금 정책 일관성 |
| MenuService | 가격 범위 불변식, CRUD 후 조회 일관성, 소프트 삭제 불변식 |
| OrderService | 금액 계산 정확성, 상태 전이 규칙 준수, 주문번호 유일성 |
| TableSessionService | 세션 생명주기 일관성, 이용 완료 후 데이터 이동 정확성 |
| SseService | 이벤트 발행 후 구독자 수신, 연결 해제 후 정리 |

---

## 6. API 문서화

| 항목 | 기술 | 버전 | 근거 |
|---|---|---|---|
| OpenAPI | SpringDoc OpenAPI | 2.6.x | Spring Boot 3.x 호환, 자동 생성 |
| UI | Swagger UI | SpringDoc 내장 | 브라우저 기반 API 탐색 |

### SpringDoc 설정
```yaml
springdoc:
  api-docs:
    path: /v3/api-docs
  swagger-ui:
    path: /swagger-ui.html
    tags-sorter: alpha
    operations-sorter: alpha
```

---

## 7. 로깅

| 항목 | 기술 | 근거 |
|---|---|---|
| 프레임워크 | SLF4J + Logback | Spring Boot 기본 내장 |
| 요청 로깅 | Spring Web Filter | 모든 HTTP 요청/응답 기록 |
| 형식 | 구조화된 텍스트 | 개발 환경 가독성 |

---

## 8. Gradle 의존성 요약

```groovy
dependencies {
    // Spring Boot Starters
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'org.springframework.boot:spring-boot-starter-security'
    implementation 'org.springframework.boot:spring-boot-starter-validation'

    // SQLite
    implementation 'org.xerial:sqlite-jdbc:3.45.3.0'
    implementation 'org.hibernate.orm:hibernate-community-dialects:6.5.2.Final'

    // JWT
    implementation 'io.jsonwebtoken:jjwt-api:0.12.6'
    runtimeOnly 'io.jsonwebtoken:jjwt-impl:0.12.6'
    runtimeOnly 'io.jsonwebtoken:jjwt-jackson:0.12.6'

    // API Documentation
    implementation 'org.springdoc:springdoc-openapi-starter-webmvc-ui:2.6.0'

    // Test
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    testImplementation 'org.springframework.security:spring-security-test'
    testImplementation 'net.jqwik:jqwik:1.9.1'
}
```

---

## 9. 프로젝트 구조

```
backend/
+-- src/main/java/com/tableorder/
|   +-- auth/           # 인증 (Controller, Service, JWT, Security)
|   +-- menu/           # 메뉴 (Controller, Service, Repository, Entity)
|   +-- order/          # 주문 (Controller, Service, Repository, Entity)
|   +-- table/          # 테이블 (Controller, Service, Repository, Entity)
|   +-- sse/            # SSE (Controller, Service)
|   +-- common/         # 공통 (Exception, Config, DataInitializer)
|   +-- TableOrderApplication.java
+-- src/main/resources/
|   +-- application.yml
+-- src/test/java/com/tableorder/
|   +-- auth/
|   +-- menu/
|   +-- order/
|   +-- table/
|   +-- sse/
+-- build.gradle
+-- Dockerfile
```
