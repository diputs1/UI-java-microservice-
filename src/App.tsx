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
  CreditCard,
  Gauge,
  HeartPulse,
  Home,
  MapPin,
  Package,
  RefreshCcw,
  Search,
  ShieldCheck,
  ShoppingBasket,
  Terminal,
  Truck,
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
import { AuthUser, hasRole, readAuthUser } from "./auth";
import { mockProducts } from "./data";

const customerId = "101";

function money(value: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "USD" }).format(value);
}

const statusLabels: Record<string, string> = {
  ATTENTION: "Cần chú ý",
  CANCELLED: "Đã hủy",
  COMPLETED: "Hoàn tất",
  DEGRADED: "Suy giảm",
  DLQ: "Hàng đợi lỗi",
  FAILED: "Thất bại",
  INVENTORY_RESERVED: "Đã giữ kho",
  PENDING: "Đang chờ",
  PROCESSED: "Đã xử lý",
  RETRYING: "Đang thử lại",
  UP: "Hoạt động"
};

const eventTypeLabels: Record<string, string> = {
  OrderCompleted: "Đơn hàng hoàn tất",
  OutboxDispatchFailed: "Phát outbox thất bại",
  ReservationExpiration: "Hết hạn đặt giữ"
};

function displayStatus(value: string) {
  return statusLabels[value] ?? value;
}

function displayEventType(value: string) {
  return eventTypeLabels[value] ?? value;
}

function StatusBadge({ value }: { value: string }) {
  return <span className={`badge ${value.toLowerCase().replaceAll("_", "-")}`}>{displayStatus(value)}</span>;
}

function TopNav({ cartCount, user }: { cartCount: number; user: AuthUser }) {
  const isAdmin = hasRole(user, "ADMIN");

  return (
    <header className="topbar">
      <NavLink className="brand" to="/">
        Sofy-shop
      </NavLink>
      <nav className="toplinks">
        <NavLink to="/">Danh mục</NavLink>
        <NavLink to="/checkout">Thanh toán</NavLink>
        {isAdmin ? <NavLink to="/admin/orders">Quản trị</NavLink> : null}
      </nav>
      <div className="top-actions">
        <span className="api-pill">Gateway {API_BASE.replace("/api/v1", "")}</span>
        <span className="user-pill">
          {user.displayName}
          <b>{user.roles.join(" + ")}</b>
        </span>
        <NavLink className="basket-button" to="/checkout" aria-label="Mở giỏ hàng">
          <ShoppingBasket size={20} />
          Giỏ hàng
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
          <p className="eyebrow">Danh mục đọc qua /api/v1/products</p>
          <h1>Thiết bị điện tử cao cấp</h1>
        </div>
        <label className="searchbox">
          <Search size={18} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm danh mục hoặc SKU" />
        </label>
      </section>

      {isError ? <div className="notice warning">Backend không khả dụng. Đang hiển thị danh mục mẫu.</div> : null}
      {isLoading ? (
        <div className="grid skeleton-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div className="skeleton-card" key={i} />
          ))}
        </div>
      ) : null}

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
                  <dt>Số lượng v1</dt>
                  <dd>{product.quantity ?? "không dùng nữa"}</dd>
                </div>
              </dl>
              <div className="card-actions">
                <strong>{money(Number(product.price))}</strong>
                <button
                  className="icon-button primary"
                  onClick={() => onAdd(product)}
                  aria-label={`Thêm ${product.name}`}
                >
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
  const [phase, setPhase] = useState<"idle" | "submitting" | "completed" | "failed">("idle");
  const orderMutation = useMutation({
    mutationFn: async () => {
      const basket = {
        customerId,
        items,
        totalAmount: total,
        version: Date.now(),
        updatedAt: new Date().toISOString()
      };
      setPhase("submitting");
      await saveBasket(basket);
      const order = await createOrder(Number(customerId), total);
      setPhase(order.status === "FAILED" ? "failed" : "completed");
      return order;
    },
    onSuccess: (order) => {
      if (order.status !== "FAILED") {
        setItems([]);
      }
    }
  });

  const updateQty = (sku: string, quantity: number) => {
    setItems(items.map((item) => (item.sku === sku ? { ...item, quantity: Math.max(1, quantity) } : item)));
  };

  const phaseLabel =
    phase === "completed"
      ? "Đặt hàng thành công"
      : phase === "failed"
        ? "Không thể đặt hàng"
        : phase === "submitting"
          ? "Đang gửi đơn hàng"
          : "Sẵn sàng thanh toán";

  return (
    <main className="page checkout-layout">
      <section className="panel checkout-panel">
        <div className="section-title">
          <div>
            <p className="eyebrow">Kiểm tra thông tin</p>
            <h1>Thanh toán đơn hàng</h1>
          </div>
          <span className={`checkout-status ${phase}`}>{phaseLabel}</span>
        </div>

        <div className="checkout-info-grid">
          <article className="checkout-info">
            <MapPin />
            <div>
              <strong>Thông tin nhận hàng</strong>
              <span>Khách hàng #{customerId}</span>
              <p>Địa chỉ giao hàng sẽ được lấy từ hồ sơ khách hàng khi backend sẵn sàng.</p>
            </div>
          </article>
          <article className="checkout-info">
            <Truck />
            <div>
              <strong>Phương thức giao hàng</strong>
              <span>Giao tiêu chuẩn</span>
              <p>Dự kiến 2-4 ngày làm việc sau khi đơn hàng được xác nhận.</p>
            </div>
          </article>
          <article className="checkout-info">
            <CreditCard />
            <div>
              <strong>Thanh toán</strong>
              <span>Thanh toán khi nhận hàng</span>
              <p>Không cần nhập thông tin thẻ trên giao diện demo này.</p>
            </div>
          </article>
          <article className="checkout-info">
            <ShieldCheck />
            <div>
              <strong>Xác nhận an toàn</strong>
              <span>Đơn hàng được gửi một lần</span>
              <p>Hệ thống sẽ xử lý tồn kho và trạng thái đơn hàng ở backend.</p>
            </div>
          </article>
        </div>

        {orderMutation.data ? (
          <div className="notice success">
            Đặt hàng thành công. Mã đơn hàng: {orderMutation.data.id}. Trạng thái:{" "}
            {displayStatus(orderMutation.data.status)}.
          </div>
        ) : null}
        {phase === "failed" ? (
          <div className="notice warning">Chưa thể tạo đơn hàng. Vui lòng kiểm tra lại giỏ hàng và thử lại.</div>
        ) : null}
      </section>

      <aside className="panel summary-panel">
        <div className="section-title">
          <h2>Giỏ hàng</h2>
          <span className="api-pill">customerId {customerId}</span>
        </div>
        {items.length === 0 ? (
          <div className="empty-state">
            <ShoppingBasket size={36} />
            <p>Giỏ hàng của bạn đang trống.</p>
            <button onClick={() => navigate("/")}>Quay lại danh mục</button>
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
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(event) => updateQty(item.sku, Number(event.target.value))}
                  />
                  <b>{money(item.quantity * item.unitPrice)}</b>
                </div>
              ))}
            </div>
            <div className="summary-total">
              <span>Tổng cộng</span>
              <strong>{money(total)}</strong>
            </div>
            <button
              className="primary-button"
              disabled={orderMutation.isPending}
              onClick={() => orderMutation.mutate()}
            >
              {orderMutation.isPending ? "Đang gửi đơn hàng..." : "Đặt hàng"}
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </aside>
    </main>
  );
}

function AdminLayout({ user }: { user: AuthUser }) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <Terminal />
          <div>
            <strong>Bảng điều khiển quản trị</strong>
            <span>Bộ điều phối microservices</span>
          </div>
        </div>
        <nav>
          <NavLink to="/admin/monitoring">
            <BarChart3 /> Giám sát
          </NavLink>
          <NavLink to="/admin/products">
            <Package /> Danh mục
          </NavLink>
          <NavLink to="/admin/inventory">
            <Boxes /> Tồn kho
          </NavLink>
          <NavLink to="/admin/orders">
            <ShoppingBasket /> Đơn hàng
          </NavLink>
          <NavLink to="/admin/jobs">
            <Terminal /> Tác vụ
          </NavLink>
        </nav>
        <div className="admin-profile">
          <UserCircle />
          <div>
            <strong>{user.displayName}</strong>
            <span>Vai trò {user.roles.join(" + ")}</span>
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

function RequireRole({
  user,
  role,
  children
}: {
  user: AuthUser;
  role: "ADMIN" | "CUSTOMER";
  children: React.ReactNode;
}) {
  if (hasRole(user, role)) {
    return <>{children}</>;
  }

  return <AccessDenied user={user} requiredRole={role} />;
}

function AccessDenied({ user, requiredRole }: { user: AuthUser; requiredRole: "ADMIN" | "CUSTOMER" }) {
  return (
    <main className="page access-denied">
      <AlertTriangle size={46} />
      <p className="eyebrow">RBAC từ chối</p>
      <h1>Quyền truy cập bị hạn chế</h1>
      <p>
        Vai trò hiện tại: <strong>{user.roles.join(" + ")}</strong>. Khu vực này yêu cầu{" "}
        <strong>{requiredRole}</strong>.
      </p>
      <NavLink to="/">Quay lại danh mục</NavLink>
    </main>
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
        <input placeholder="Tìm trace ID, đơn hàng, SKU..." />
      </label>
    </header>
  );
}

function MonitoringPage() {
  const services = [
    ["Gateway", "5000", "UP", "42ms"],
    ["Danh tính", "5001", "UP", "65ms"],
    ["Sản phẩm", "5002", "UP", "88ms"],
    ["Giỏ hàng", "5004", "UP", "51ms"],
    ["Đặt hàng", "5005", "DEGRADED", "212ms"],
    ["Tồn kho", "5006", "UP", "97ms"],
    ["RabbitMQ DLQ", "infra", "ATTENTION", "3 tin"]
  ];

  return (
    <main className="admin-main">
      <AdminHeader title="Trung tâm điều hành" caption="Sẵn sàng, độ trễ, độ trễ outbox và cảnh báo DLQ" />
      <section className="metric-grid">
        <Metric icon={<Gauge />} label="Tốc độ request" value="92 RPS" helper="Mục tiêu <= 100 RPS" />
        <Metric icon={<Activity />} label="p95 thanh toán" value="1.74s" helper="Cảnh báo trên 2s" />
        <Metric icon={<RefreshCcw />} label="Độ trễ outbox" value="38s" helper="Cảnh báo trên 60s" />
        <Metric icon={<AlertTriangle />} label="Tin nhắn DLQ" value="3" helper="Cần kiểm tra" danger />
      </section>
      <section className="panel">
        <div className="section-title">
          <h2>Sức khỏe dịch vụ</h2>
          <span className="api-pill">Bảng điều khiển Actuator / Elastic</span>
        </div>
        <div className="service-grid">
          {services.map(([name, port, status, latency]) => (
            <div className="service-card" key={name}>
              <HeartPulse />
              <div>
                <strong>{name}</strong>
                <span>Cổng {port}</span>
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

function Metric({
  icon,
  label,
  value,
  helper,
  danger
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  helper: string;
  danger?: boolean;
}) {
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
      <AdminHeader title="Quản lý danh mục" caption="ADMIN + catalog.write" />
      <DataTable
        headers={["SKU", "Tên", "Giá", "Số lượng không dùng nữa", "Cập nhật"]}
        rows={data.map((product) => [
          product.sku,
          product.name,
          money(Number(product.price)),
          product.quantity ?? "không dùng nữa",
          product.updatedAt ?? "-"
        ])}
      />
    </main>
  );
}

function InventoryPage() {
  const { data = [] } = useQuery({ queryKey: ["inventory"], queryFn: getInventory });
  return (
    <main className="admin-main">
      <AdminHeader title="Tồn kho" caption="MongoDB quản lý nguồn tồn kho và đặt giữ hàng" />
      <DataTable
        headers={["ID", "SKU", "Có sẵn", "Vị trí", "Chính sách đặt giữ"]}
        rows={data.map((item) => [item.id, item.sku, item.availableQuantity, item.location, "Giữ/nhả nguyên tử"])}
      />
    </main>
  );
}

function OrdersPage() {
  const { data = [] } = useQuery({ queryKey: ["orders"], queryFn: getOrders });
  const failedOutbox = data.filter((order) => order.status === "FAILED").length;

  return (
    <main className="admin-main">
      <AdminHeader title="Quản lý đơn hàng" caption="Trạng thái saga, idempotency và transactional outbox" />
      <div className="toolbar">
        <select aria-label="Lọc trạng thái">
          <option>Tất cả trạng thái</option>
          <option>Đang chờ</option>
          <option>Đã giữ kho</option>
          <option>Hoàn tất</option>
          <option>Thất bại</option>
        </select>
        <button>Xuất CSV</button>
        <span className="danger-text">{failedOutbox} outbox thất bại</span>
      </div>
      <DataTable
        headers={["ID đơn hàng", "Chủ sở hữu", "Tổng tiền", "Trạng thái", "Ngày tạo", "Khóa idempotency"]}
        rows={data.map((order) => [
          order.id,
          order.ownerSubject ?? `customer:${order.customerId}`,
          money(Number(order.totalAmount)),
          <StatusBadge value={order.status} />,
          new Date(order.createdAt).toLocaleString(),
          order.idempotencyKey ?? "-"
        ])}
      />
      <section className="panel detail-panel">
        <h2>Trace saga đã chọn</h2>
        <div className="timeline">
          <div className="done">
            <CheckCircle2 /> Đơn hàng PENDING đã lưu cùng snapshot giỏ hàng
          </div>
          <div className="done">
            <Archive /> Tồn kho RESERVED trước khi hoàn tất
          </div>
          <div className="warn">
            <RefreshCcw /> Bộ phát outbox dùng confirm + retry backoff
          </div>
        </div>
      </section>
    </main>
  );
}

function JobsPage() {
  const { data = [] } = useQuery({ queryKey: ["jobs"], queryFn: getJobEvents });
  return (
    <main className="admin-main">
      <AdminHeader
        title="Tác vụ nền & sự kiện"
        caption="Audit, khôi phục, thử lại dọn dẹp, hết hạn đặt giữ, DLQ"
      />
      <DataTable
        headers={["ID sự kiện", "Loại", "Aggregate", "Correlation", "Trạng thái", "Thời điểm"]}
        rows={data.map((event) => [
          event.id,
          displayEventType(event.eventType),
          event.aggregateId,
          event.correlationId,
          <StatusBadge value={event.status} />,
          new Date(event.occurredAt).toLocaleString()
        ])}
      />
    </main>
  );
}

function DataTable({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) {
  return (
    <section className="panel table-panel">
      <table>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default function App() {
  const [items, setItems] = useState<BasketItem[]>([]);
  const user = useMemo(() => readAuthUser(), []);
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
            <TopNav cartCount={cartCount} user={user} />
            <CatalogPage onAdd={addItem} />
          </>
        }
      />
      <Route
        path="/checkout"
        element={
          <>
            <TopNav cartCount={cartCount} user={user} />
            <CheckoutPage items={items} setItems={setItems} />
          </>
        }
      />
      <Route
        path="/admin/*"
        element={
          <RequireRole user={user} role="ADMIN">
            <AdminLayout user={user} />
          </RequireRole>
        }
      />
      <Route
        path="*"
        element={
          <main className="page empty-route">
            <Home size={42} />
            <h1>Không tìm thấy trang</h1>
            <NavLink to="/">Quay lại danh mục</NavLink>
          </main>
        }
      />
    </Routes>
  );
}
