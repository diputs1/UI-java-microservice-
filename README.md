# Giao diện nền tảng sản xuất MicroShop

Frontend React + TypeScript cho lộ trình nền tảng sản xuất Java microservices.

## Công nghệ

- React 19
- TypeScript
- Vite
- React Router
- TanStack Query
- Biểu tượng Lucide React

## Chạy cục bộ

```bash
npm install
npm run dev
```

File `index.html` là điểm vào của Vite. Mã giao diện ứng dụng nằm trong `src/`.

## RBAC

Giao diện dùng cùng vai trò với các service Java: `CUSTOMER` và `ADMIN`.

- `CUSTOMER` có thể dùng trang danh mục và thanh toán.
- `ADMIN` có thể truy cập `/admin/*` và thấy liên kết Quản trị.
- Khi JWT Keycloak được lưu trong `localStorage` với tên `microshop.accessToken`, `accessToken`, `access_token`, hoặc `kcToken`, giao diện đọc vai trò từ `realm_access.roles` và `resource_access.microservices-web.roles`.
- Nếu không có JWT, giao diện dùng người dùng demo cục bộ với vai trò `CUSTOMER`.

## Lộ trình sản xuất

### Giai đoạn

- Chuẩn hóa
- Docker & cấu hình
- Danh tính & OAuth2
- Sản phẩm, giỏ hàng, tồn kho
- Saga đặt hàng & outbox
- RabbitMQ & tác vụ
- Khả năng quan sát
- Kubernetes & Helm
- CI/CD
- Kiểm thử

### Giai đoạn 1: Chuẩn hóa nền tảng

- Java 21, Spring Boot 3.5.x, Spring Cloud 2025.0.x
- MapStruct, Bean Validation, kiểm tra Flyway
- Module common tách theo API, bảo mật, sự kiện, khả năng quan sát

### Danh sách sẵn sàng

- [x] Docker image không chạy bằng root
- [x] Hợp đồng lỗi với traceId
- [ ] Kiểm thử tải k6 100 RPS
- [ ] Helm staging xanh

### Ví dụ gateway

```yaml
server:
  port: 5000
spring:
  cloud:
    gateway:
      routes:
        - Path=/api/v1/orders/**
security:
  oauth2: pkce
```

### Saga & outbox

Từ PENDING sang INVENTORY_RESERVED rồi COMPLETED với khóa idempotency và xác nhận publisher.
