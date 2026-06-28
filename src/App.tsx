import { useMemo, useState } from "react";
import { NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Activity,
  AlertTriangle,
  Archive,
  BarChart3,
  Boxes,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Database,
  Fingerprint,
  Gauge,
  HeartPulse,
  Home,
  KeyRound,
  Layers3,
  Package,
  RefreshCcw,
  Search,
  ShieldCheck,
  ShoppingBasket,
  Terminal,
  UserCircle
} from "lucide-react";
import {
  API_BASE,
  BasketItem,
  Product,
  createOrder,
  getInventory,
  getJobEvents,
  getOrders,
  getProducts,
  saveBasket
} from "./api";
import { mockProducts, roadmapPhases } from "./data";

const customerId = "101";

function money(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function StatusBadge({ value }: { value: string }) {
  return <span className={`badge ${value.toLowerCase().replaceAll("_", "-")}`}>{value}</span>;
}

function TopNav({ cartCount }: { cartCount: number }) {
  return (
    <header className="topbar">
      <NavLink className="brand" to="/">
        MicroShop Ecosystem
      </NavLink>
      <nav className="toplinks">
        <NavLink to="/">Catalog</NavLink>
        <NavLink to="/checkout">Checkout</NavLink>
        <NavLink to="/admin/orders">Admin</NavLink>
        <NavLink to="/roadmap">Roadmap</NavLink>
      </nav>
      <div className="top-actions">
        <span className="api-pill">Gateway {API_BASE.replace("/api/v1", "")}</span>
        <NavLink className="basket-button" to="/checkout" aria-label="Open basket">
          <ShoppingBasket size={20} />
          Basket
          <b>{cartCount}</b>
        </NavLink>
      </div>
    </header>
  );
}

function ProductArt({ product, index }: { product: Product; index: number }) {
  return (
    <div className={`product-art art-${index % 4}`}>
      <span>{product.sku}</span>
      <div />
    </div>
  );
}

function CatalogPage({ onAdd }: { onAdd: (product: Product) => void }) {
  const { data = mockProducts, isLoading, isError } = useQuery({ queryKey: ["products"], queryFn: getProducts });
  const [query, setQuery] = useState("");
  const products = data.filter((item) => `${item.name} ${item.sku}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <main className="page customer-page">
      <section className="hero">
        <div>
          <p className="eyebrow">Catalog read via /api/v1/products</p>
          <h1>Premium Electronics</h1>
          <p>Curated hardware catalog with inventory-aware checkout through the Java microservices gateway.</p>
        </div>
        <label className="searchbox">
          <Search size={18} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search catalog or SKU" />
        </label>
      </section>

      {isError ? <div className="notice warning">Backend unavailable. Showing mock catalog fallback.</div> : null}
      {isLoading ? <div className="grid skeleton-grid">{Array.from({ length: 4 }).map((_, i) => <div className="skeleton-card" key={i} />)}</div> : null}

      <section className="grid product-grid">
        {products.map((product, index) => (
          <article className="product-card" key={product.sku}>
            <ProductArt product={product} index={index} />
            <div className="product-body">
              <div>
                <h2>{product.name}</h2>
                <p>{product.description}</p>
              </div>
              <dl>
                <div>
                  <dt>SKU</dt>
                  <dd>{product.sku}</dd>
                </div>
                <div>
                  <dt>v1 quantity</dt>
                  <dd>{product.quantity ?? "deprecated"}</dd>
                </div>
              </dl>
              <div className="card-actions">
                <strong>{money(Number(product.price))}</strong>
                <button className="icon-button primary" onClick={() => onAdd(product)} aria-label={`Add ${product.name}`}>
                  <ShoppingBasket size={18} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

function CheckoutPage({ items, setItems }: { items: BasketItem[]; setItems: (items: BasketItem[]) => void }) {
  const navigate = useNavigate();
  const total = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const [phase, setPhase] = useState<"idle" | "pending" | "reserved" | "completed" | "failed">("idle");
  const orderMutation = useMutation({
    mutationFn: async () => {
      const basket = {
        customerId,
        items,
        totalAmount: total,
        version: Date.now(),
        updatedAt: new Date().toISOString()
      };
      await saveBasket(basket);
      setPhase("pending");
      await new Promise((resolve) => setTimeout(resolve, 650));
      setPhase("reserved");
      await new Promise((resolve) => setTimeout(resolve, 650));
      const order = await createOrder(Number(customerId), total);
      setPhase(order.status === "FAILED" ? "failed" : "completed");
      return order;
    },
    onSuccess: () => {
      setItems([]);
    }
  });

  const updateQty = (sku: string, quantity: number) => {
    setItems(items.map((item) => (item.sku === sku ? { ...item, quantity: Math.max(1, quantity) } : item)));
  };

  return (
    <main className="page checkout-layout">
      <section className="panel saga-panel">
        <div className="section-title">
          <div>
            <p className="eyebrow">POST /api/v1/orders</p>
            <h1>Checkout Saga</h1>
          </div>
          <StatusBadge value={phase === "reserved" ? "INVENTORY_RESERVED" : phase === "completed" ? "COMPLETED" : phase === "failed" ? "FAILED" : "PENDING"} />
        </div>

        <div className="stepper">
          <div className={phase !== "idle" ? "done" : ""}>
            <ClipboardList />
            <strong>Basket Versioned</strong>
            <span>Basket saved through /baskets</span>
          </div>
          <div className={["reserved", "completed"].includes(phase) ? "done" : ""}>
            <Archive />
            <strong>Inventory Reserved</strong>
            <span>/inventory/reservations</span>
          </div>
          <div className={phase === "completed" ? "done" : phase === "failed" ? "failed" : ""}>
            <CheckCircle2 />
            <strong>Order Completed</strong>
            <span>Outbox event recorded</span>
          </div>
        </div>

        <pre className="log-window">{`[gateway] API base ${API_BASE}
[basket] POST /api/v1/baskets customerId=${customerId}
[ordering] POST /api/v1/orders with Idempotency-Key
[ordering] reserve inventory before COMPLETED
[outbox] publish OrderCompleted via RabbitMQ topic exchange`}</pre>

        {orderMutation.data ? (
          <div className="notice success">
            Order {orderMutation.data.id} is {orderMutation.data.status}. Idempotency key: {orderMutation.data.idempotencyKey}
          </div>
        ) : null}
      </section>

      <aside className="panel summary-panel">
        <div className="section-title">
          <h2>Basket</h2>
          <span className="api-pill">customerId {customerId}</span>
        </div>
        {items.length === 0 ? (
          <div className="empty-state">
            <ShoppingBasket size={36} />
            <p>Your basket is empty.</p>
            <button onClick={() => navigate("/")}>Back to Catalog</button>
          </div>
        ) : (
          <>
            <div className="basket-list">
              {items.map((item) => (
                <div className="basket-line" key={item.sku}>
                  <div>
                    <strong>{item.productName}</strong>
                    <span>{item.sku}</span>
                  </div>
                  <input type="number" min={1} value={item.quantity} onChange={(event) => updateQty(item.sku, Number(event.target.value))} />
                  <b>{money(item.quantity * item.unitPrice)}</b>
                </div>
              ))}
            </div>
            <div className="summary-total">
              <span>Total</span>
              <strong>{money(total)}</strong>
            </div>
            <button className="primary-button" disabled={orderMutation.isPending} onClick={() => orderMutation.mutate()}>
              {orderMutation.isPending ? "Processing saga..." : "Confirm Checkout"}
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </aside>
    </main>
  );
}

function AdminLayout() {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <Terminal />
          <div>
            <strong>Admin Console</strong>
            <span>Microservices Orchestrator</span>
          </div>
        </div>
        <nav>
          <NavLink to="/admin/monitoring"><BarChart3 /> Monitoring</NavLink>
          <NavLink to="/admin/products"><Package /> Catalog</NavLink>
          <NavLink to="/admin/inventory"><Boxes /> Inventory</NavLink>
          <NavLink to="/admin/orders"><ShoppingBasket /> Orders</NavLink>
          <NavLink to="/admin/jobs"><Terminal /> Jobs</NavLink>
        </nav>
        <div className="admin-profile">
          <UserCircle />
          <div>
            <strong>System Admin</strong>
            <span>ADMIN role</span>
          </div>
        </div>
      </aside>
      <Routes>
        <Route path="monitoring" element={<MonitoringPage />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="jobs" element={<JobsPage />} />
        <Route path="*" element={<OrdersPage />} />
      </Routes>
    </div>
  );
}

function AdminHeader({ title, caption }: { title: string; caption: string }) {
  return (
    <header className="admin-header">
      <div>
        <p className="eyebrow">{caption}</p>
        <h1>{title}</h1>
      </div>
      <label className="searchbox compact">
        <Search size={17} />
        <input placeholder="Search trace IDs, orders, SKUs..." />
      </label>
    </header>
  );
}

function MonitoringPage() {
  const services = [
    ["Gateway", "5000", "UP", "42ms"],
    ["Identity", "5001", "UP", "65ms"],
    ["Product", "5002", "UP", "88ms"],
    ["Basket", "5004", "UP", "51ms"],
    ["Ordering", "5005", "DEGRADED", "212ms"],
    ["Inventory", "5006", "UP", "97ms"],
    ["RabbitMQ DLQ", "infra", "ATTENTION", "3 msg"]
  ];

  return (
    <main className="admin-main">
      <AdminHeader title="Mission Control" caption="Readiness, latency, outbox lag, and DLQ alerts" />
      <section className="metric-grid">
        <Metric icon={<Gauge />} label="Request rate" value="92 RPS" helper="Target <= 100 RPS" />
        <Metric icon={<Activity />} label="p95 checkout" value="1.74s" helper="Alert above 2s" />
        <Metric icon={<RefreshCcw />} label="Outbox lag" value="38s" helper="Alert above 60s" />
        <Metric icon={<AlertTriangle />} label="DLQ messages" value="3" helper="Needs inspection" danger />
      </section>
      <section className="panel">
        <div className="section-title">
          <h2>Service Health</h2>
          <span className="api-pill">Actuator / Elastic dashboards</span>
        </div>
        <div className="service-grid">
          {services.map(([name, port, status, latency]) => (
            <div className="service-card" key={name}>
              <HeartPulse />
              <div>
                <strong>{name}</strong>
                <span>Port {port}</span>
              </div>
              <StatusBadge value={status} />
              <b>{latency}</b>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function Metric({ icon, label, value, helper, danger }: { icon: React.ReactNode; label: string; value: string; helper: string; danger?: boolean }) {
  return (
    <article className={`metric-card ${danger ? "danger" : ""}`}>
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{helper}</p>
    </article>
  );
}

function AdminProducts() {
  const { data = mockProducts } = useQuery({ queryKey: ["admin-products"], queryFn: getProducts });
  return (
    <main className="admin-main">
      <AdminHeader title="Catalog Management" caption="ADMIN + catalog.write" />
      <DataTable
        headers={["SKU", "Name", "Price", "Deprecated quantity", "Updated"]}
        rows={data.map((product) => [product.sku, product.name, money(Number(product.price)), product.quantity ?? "deprecated", product.updatedAt ?? "-"])}
      />
    </main>
  );
}

function InventoryPage() {
  const { data = [] } = useQuery({ queryKey: ["inventory"], queryFn: getInventory });
  return (
    <main className="admin-main">
      <AdminHeader title="Inventory" caption="MongoDB stock authority and reservations" />
      <DataTable headers={["ID", "SKU", "Available", "Location", "Reservation policy"]} rows={data.map((item) => [item.id, item.sku, item.availableQuantity, item.location, "Atomic reserve/release"])} />
    </main>
  );
}

function OrdersPage() {
  const { data = [] } = useQuery({ queryKey: ["orders"], queryFn: getOrders });
  const failedOutbox = data.filter((order) => order.status === "FAILED").length;

  return (
    <main className="admin-main">
      <AdminHeader title="Order Management" caption="Saga state, idempotency, and transactional outbox" />
      <div className="toolbar">
        <select aria-label="Filter status">
          <option>All Statuses</option>
          <option>PENDING</option>
          <option>INVENTORY_RESERVED</option>
          <option>COMPLETED</option>
          <option>FAILED</option>
        </select>
        <button>Export CSV</button>
        <span className="danger-text">{failedOutbox} Failed Outbox</span>
      </div>
      <DataTable
        headers={["Order ID", "Owner", "Total", "Status", "Created", "Idempotency Key"]}
        rows={data.map((order) => [order.id, order.ownerSubject ?? `customer:${order.customerId}`, money(Number(order.totalAmount)), <StatusBadge value={order.status} />, new Date(order.createdAt).toLocaleString(), order.idempotencyKey ?? "-"])}
      />
      <section className="panel detail-panel">
        <h2>Selected Saga Trace</h2>
        <div className="timeline">
          <div className="done"><CheckCircle2 /> Order PENDING saved with basket snapshot</div>
          <div className="done"><Archive /> Inventory RESERVED before completion</div>
          <div className="warn"><RefreshCcw /> Outbox publisher uses confirm + retry backoff</div>
        </div>
      </section>
    </main>
  );
}

function JobsPage() {
  const { data = [] } = useQuery({ queryKey: ["jobs"], queryFn: getJobEvents });
  return (
    <main className="admin-main">
      <AdminHeader title="Background Jobs & Events" caption="Audit, recovery, cleanup retry, reservation expiration, DLQ" />
      <DataTable headers={["Event ID", "Type", "Aggregate", "Correlation", "Status", "Occurred"]} rows={data.map((event) => [event.id, event.eventType, event.aggregateId, event.correlationId, <StatusBadge value={event.status} />, new Date(event.occurredAt).toLocaleString()])} />
    </main>
  );
}

function DataTable({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) {
  return (
    <section className="panel table-panel">
      <table>
        <thead>
          <tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function RoadmapPage() {
  return (
    <main className="roadmap-page">
      <aside className="roadmap-sidebar">
        <h1>Java Microservices</h1>
        <span>Production Roadmap</span>
        <nav>
          {roadmapPhases.map((phase, index) => (
            <a className={index === 0 ? "active" : ""} key={phase}>
              <Layers3 size={18} />
              {phase}
            </a>
          ))}
        </nav>
      </aside>
      <section className="roadmap-main">
        <div className="roadmap-hero">
          <p className="eyebrow">Architecture Roadmap 2025</p>
          <h1>Java Microservices Production Foundation</h1>
          <div className="progress-line"><span style={{ width: "10%" }} /></div>
        </div>
        <div className="roadmap-grid">
          <article className="roadmap-card large">
            <b>Phase 1</b>
            <h2>Platform Standardization</h2>
            <ul>
              <li>Java 21, Spring Boot 3.5.x, Spring Cloud 2025.0.x</li>
              <li>MapStruct, Bean Validation, Flyway validate</li>
              <li>Common module split by API, security, events, observability</li>
            </ul>
          </article>
          <article className="roadmap-card checklist">
            <h2>Readiness Checklist</h2>
            <label><input type="checkbox" checked readOnly /> Non-root Docker images</label>
            <label><input type="checkbox" checked readOnly /> Error contract with traceId</label>
            <label><input type="checkbox" readOnly /> 100 RPS k6 load test</label>
            <label><input type="checkbox" readOnly /> Helm staging green</label>
          </article>
          <article className="roadmap-card code-card">
            <pre>{`server:
  port: 5000
spring:
  cloud:
    gateway:
      routes:
        - Path=/api/v1/orders/**
security:
  oauth2: pkce`}</pre>
          </article>
          <article className="roadmap-card">
            <h2>Saga & Outbox</h2>
            <p>PENDING to INVENTORY_RESERVED to COMPLETED with idempotency key and publisher confirm.</p>
          </article>
        </div>
      </section>
    </main>
  );
}

export default function App() {
  const [items, setItems] = useState<BasketItem[]>([]);
  const cartCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  const addItem = (product: Product) => {
    const existing = items.find((item) => item.sku === product.sku);
    if (existing) {
      setItems(items.map((item) => (item.sku === product.sku ? { ...item, quantity: item.quantity + 1 } : item)));
      return;
    }
    setItems([
      ...items,
      {
        sku: product.sku,
        productName: product.name,
        quantity: 1,
        unitPrice: Number(product.price)
      }
    ]);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <TopNav cartCount={cartCount} />
            <CatalogPage onAdd={addItem} />
          </>
        }
      />
      <Route
        path="/checkout"
        element={
          <>
            <TopNav cartCount={cartCount} />
            <CheckoutPage items={items} setItems={setItems} />
          </>
        }
      />
      <Route path="/admin/*" element={<AdminLayout />} />
      <Route path="/roadmap" element={<RoadmapPage />} />
      <Route
        path="*"
        element={
          <main className="page empty-route">
            <Home size={42} />
            <h1>Route not found</h1>
            <NavLink to="/">Back to catalog</NavLink>
          </main>
        }
      />
    </Routes>
  );
}
