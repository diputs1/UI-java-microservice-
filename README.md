# MicroShop Production Foundation UI

React + TypeScript frontend for the Java microservices production foundation roadmap.

## Tech stack

- React 19
- TypeScript
- Vite
- React Router
- TanStack Query
- Lucide React icons

## Run locally

```bash
npm install
npm run dev
```

The `index.html` file is the Vite entry point. Application UI code lives in `src/`.

## RBAC

The UI uses the same roles as the Java services: `CUSTOMER` and `ADMIN`.

- `CUSTOMER` can use the catalog and checkout pages.
- `ADMIN` can access `/admin/*` and see the Admin link.
- When a Keycloak JWT is stored in `localStorage` as `microshop.accessToken`, `accessToken`, `access_token`, or `kcToken`, the UI reads roles from `realm_access.roles` and `resource_access.microservices-web.roles`.
- Without a JWT, the UI falls back to a local `CUSTOMER` demo user.

## Production Roadmap

### Phases

- Standardization
- Docker & Config
- Identity & OAuth2
- Product Basket Inventory
- Ordering Saga & Outbox
- RabbitMQ & Jobs
- Observability
- Kubernetes & Helm
- CI/CD
- Testing

### Phase 1: Platform Standardization

- Java 21, Spring Boot 3.5.x, Spring Cloud 2025.0.x
- MapStruct, Bean Validation, Flyway validate
- Common module split by API, security, events, observability

### Readiness Checklist

- [x] Non-root Docker images
- [x] Error contract with traceId
- [ ] 100 RPS k6 load test
- [ ] Helm staging green

### Gateway Example

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

### Saga & Outbox

PENDING to INVENTORY_RESERVED to COMPLETED with idempotency key and publisher confirm.
