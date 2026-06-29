import type { Inventory, JobEvent, Order, Product } from "./api";

export const mockProducts: Product[] = [
  {
    id: 1,
    sku: "SKU-8821",
    name: "Quantum X1 Phone",
    description: "Flagship device with titanium frame and secure checkout telemetry.",
    price: 1299,
    quantity: 8,
    updatedAt: "2026-06-26T09:00:00Z"
  },
  {
    id: 2,
    sku: "SKU-4402",
    name: "NebulaBook Pro 16",
    description: "Workstation laptop tuned for creators, engineers, and heavy workflows.",
    price: 2499,
    quantity: 3,
    updatedAt: "2026-06-26T09:10:00Z"
  },
  {
    id: 3,
    sku: "SKU-9912",
    name: "SonicStream V2",
    description: "Noise-canceling headset with precise low-latency audio.",
    price: 349,
    quantity: 16,
    updatedAt: "2026-06-26T09:20:00Z"
  },
  {
    id: 4,
    sku: "SKU-1004",
    name: "Core Link Pack",
    description: "Accessory bundle with dock, cable, and fast charger.",
    price: 89,
    quantity: 42,
    updatedAt: "2026-06-26T09:30:00Z"
  }
];

export const mockOrders: Order[] = [
  {
    id: "ORD-29384-XB",
    customerId: 101,
    ownerSubject: "auth0|64f1e92d...",
    totalAmount: 1452,
    status: "FAILED",
    createdAt: "2026-06-26T08:22:10Z",
    idempotencyKey: "ide_88f72a..."
  },
  {
    id: "ORD-29385-AC",
    customerId: 102,
    ownerSubject: "auth0|62a1c81b...",
    totalAmount: 89.99,
    status: "COMPLETED",
    createdAt: "2026-06-26T08:15:33Z",
    idempotencyKey: "ide_42c91b..."
  },
  {
    id: "ORD-29386-ZZ",
    customerId: 103,
    ownerSubject: "auth0|88v4k22z...",
    totalAmount: 210.5,
    status: "INVENTORY_RESERVED",
    createdAt: "2026-06-26T08:28:45Z",
    idempotencyKey: "ide_99d1e4..."
  },
  {
    id: "ORD-29387-MN",
    customerId: 104,
    ownerSubject: "auth0|99f2a0z...",
    totalAmount: 427,
    status: "PENDING",
    createdAt: "2026-06-26T08:31:15Z",
    idempotencyKey: "ide_z77x0d..."
  }
];

export const mockInventory: Inventory[] = [
  { id: "inv-1", sku: "SKU-8821", availableQuantity: 8, location: "HCM-A1" },
  { id: "inv-2", sku: "SKU-4402", availableQuantity: 3, location: "HCM-A1" },
  { id: "inv-3", sku: "SKU-9912", availableQuantity: 16, location: "HN-B2" },
  { id: "inv-4", sku: "SKU-1004", availableQuantity: 42, location: "DN-C1" }
];

export const mockEvents: JobEvent[] = [
  {
    id: "evt-1001",
    eventType: "OrderCompleted",
    aggregateId: "ORD-29385-AC",
    correlationId: "trace-9d1a",
    status: "PROCESSED",
    occurredAt: "2026-06-26T08:15:36Z"
  },
  {
    id: "evt-1002",
    eventType: "OutboxDispatchFailed",
    aggregateId: "ORD-29384-XB",
    correlationId: "trace-b8f2",
    status: "DLQ",
    occurredAt: "2026-06-26T08:22:13Z"
  },
  {
    id: "evt-1003",
    eventType: "ReservationExpiration",
    aggregateId: "res-9931",
    correlationId: "trace-aa77",
    status: "RETRYING",
    occurredAt: "2026-06-26T08:30:00Z"
  }
];

