// Database-backed order service
// Uses Vercel Postgres with Drizzle ORM.
// Falls back to in-memory storage if DB is not configured.

import { db, orders } from './db';
import { eq } from 'drizzle-orm';

export interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  country: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  shippingMethod: string;
  shippingFee: number;
  discountCode: string | null;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  stripePaymentIntentId: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  fulfillmentStatus: string;
  notes: string;
  createdAt: string;
}

// ============ In-memory fallback ============
const fallbackOrders: Map<string, Order> = new Map();

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `AV-${timestamp}-${random}`;
}

// ============ Public API ============

export async function createOrder(data: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'paymentStatus' | 'fulfillmentStatus' | 'notes'>): Promise<Order> {
  const orderNumber = generateOrderNumber();

  try {
    const [order] = await db.insert(orders).values({
      orderNumber,
      customerName: data.customerName,
      email: data.email,
      phone: data.phone,
      country: data.country,
      address: data.address,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      productName: data.productName,
      quantity: data.quantity,
      unitPrice: data.unitPrice,
      subtotal: data.subtotal,
      shippingMethod: data.shippingMethod,
      shippingFee: data.shippingFee,
      discountCode: data.discountCode,
      discountAmount: data.discountAmount,
      totalAmount: data.totalAmount,
      currency: data.currency,
      stripePaymentIntentId: data.stripePaymentIntentId,
      paymentStatus: 'pending',
      fulfillmentStatus: 'pending',
      notes: '',
    }).returning();

    return mapOrder(order);
  } catch {
    // Fallback to in-memory
    const fallback: Order = {
      id: Date.now(),
      orderNumber,
      ...data,
      paymentStatus: 'pending',
      fulfillmentStatus: 'pending',
      notes: '',
      createdAt: new Date().toISOString(),
    };
    fallbackOrders.set(String(fallback.id), fallback);
    return fallback;
  }
}

export async function getOrder(id: number): Promise<Order | undefined> {
  try {
    const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    if (result.length === 0) return undefined;
    const o = result[0];
    return mapOrder(o);
  } catch {
    return Array.from(fallbackOrders.values()).find((o) => o.id === id);
  }
}

export async function getOrderByPaymentIntent(piId: string): Promise<Order | undefined> {
  try {
    const result = await db.select().from(orders).where(eq(orders.stripePaymentIntentId, piId)).limit(1);
    if (result.length === 0) return undefined;
    return mapOrder(result[0]);
  } catch {
    return Array.from(fallbackOrders.values()).find((o) => o.stripePaymentIntentId === piId);
  }
}

function mapOrder(o: any): Order {
  return {
    id: o.id,
    orderNumber: o.orderNumber,
    customerName: o.customerName,
    email: o.email,
    phone: o.phone || '',
    country: o.country,
    address: o.address,
    city: o.city,
    state: o.state || '',
    zipCode: o.zipCode,
    productName: o.productName,
    quantity: o.quantity,
    unitPrice: o.unitPrice,
    subtotal: o.subtotal,
    shippingMethod: o.shippingMethod,
    shippingFee: o.shippingFee,
    discountCode: o.discountCode,
    discountAmount: o.discountAmount,
    totalAmount: o.totalAmount,
    currency: o.currency,
    stripePaymentIntentId: o.stripePaymentIntentId || '',
    paymentStatus: (o.paymentStatus || 'pending') as Order['paymentStatus'],
    fulfillmentStatus: o.fulfillmentStatus || 'pending',
    notes: o.notes || '',
    createdAt: o.createdAt?.toISOString?.() || String(o.createdAt || ''),
  };
}

export async function updatePaymentStatus(id: number, status: Order['paymentStatus']): Promise<Order | undefined> {
  try {
    await db.update(orders).set({
      paymentStatus: status,
      updatedAt: new Date(),
    }).where(eq(orders.id, id));
    return getOrder(id);
  } catch {
    const order = Array.from(fallbackOrders.values()).find((o) => o.id === id);
    if (order) order.paymentStatus = status;
    return order;
  }
}

export async function getAllOrders(): Promise<Order[]> {
  try {
    const result = await db.select().from(orders).orderBy(orders.createdAt);
    return result.map(mapOrder);
  } catch {
    return Array.from(fallbackOrders.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
}
