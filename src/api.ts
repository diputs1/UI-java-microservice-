import { mockEvents, mockInventory, mockOrders, mockProducts } from "./data";

export const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api/v1";

export type Product = {
  id: number;
  sku: string;
  name: string;
  description: string;
  price: number;
  quantity?: number;
  updatedAt?: string;
};

export type BasketItem = {
  sku: string;
  productName: string;
  quantity: number;
  unitPrice: number;
};

export type Basket = {
  customerId: string;
  items: BasketItem[];
  totalAmount: number;
  version?: number;
  expiresAt?: string;
  updatedAt?: string;
};

export type OrderStatus = "PENDING" | "INVENTORY_RESERVED" | "COMPLETED" | "FAILED" | "CANCELLED";

export type Order = {
  id: number | string;
  customerId: number;
  ownerSubject?: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  idempotencyKey?: string;
};

export type Inventory = {
  id: string;
  sku: string;
  availableQuantity: number;
  location: string;
};

export type JobEvent = {
  id: string;
  eventType: string;
  aggregateId: string;
  correlationId: string;
  status: "PROCESSED" | "RETRYING" | "DLQ";
  occurredAt: string;
};

type ApiEnvelope<T> = T | { data: T; success?: boolean; traceId?: string };

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "X-Correlation-Id": crypto.randomUUID(),
      ...(init?.headers ?? {})
    }
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  const json = (await response.json()) as ApiEnvelope<T>;
  return "data" in Object(json) ? (json as { data: T }).data : (json as T);
}

export async function getProducts() {
  try {
    return await request<Product[]>("/products");
  } catch {
    return mockProducts;
  }
}

export async function saveBasket(basket: Basket) {
  try {
    return await request<Basket>("/baskets", {
      method: "POST",
      body: JSON.stringify(basket)
    });
  } catch {
    return basket;
  }
}

export async function createOrder(customerId: number, totalAmount: number) {
  try {
    return await request<Order>("/orders", {
      method: "POST",
      headers: { "Idempotency-Key": crypto.randomUUID() },
      body: JSON.stringify({ customerId, totalAmount })
    });
  } catch {
    return {
      id: `mock-${Date.now()}`,
      customerId,
      totalAmount,
      status: "PENDING",
      createdAt: new Date().toISOString(),
      idempotencyKey: crypto.randomUUID()
    } satisfies Order;
  }
}

export async function getOrders() {
  try {
    return await request<Order[]>("/orders");
  } catch {
    return mockOrders;
  }
}

export async function getInventory() {
  try {
    return await request<Inventory[]>("/inventory");
  } catch {
    return mockInventory;
  }
}

export async function getJobEvents() {
  try {
    return await request<JobEvent[]>("/jobs/events");
  } catch {
    return mockEvents;
  }
}
