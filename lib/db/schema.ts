import {
  pgTable,
  serial,
  text,
  real,
  integer,
  timestamp,
  boolean,
  jsonb,
  varchar,
} from 'drizzle-orm/pg-core';

// ============ 产品表 ============
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  subtitle: varchar('subtitle', { length: 500 }).notNull().default(''),
  description: text('description').notNull().default(''),
  price: real('price').notNull().default(0),
  compareAtPrice: real('compare_at_price'),
  currency: varchar('currency', { length: 10 }).notNull().default('USD'),
  imageUrl: varchar('image_url', { length: 500 }).notNull().default(''),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ============ 产品图片 ============
export const productImages = pgTable('product_images', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  url: varchar('url', { length: 500 }).notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
});

// ============ 产品卖点 ============
export const productFeatures = pgTable('product_features', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  label: varchar('label', { length: 500 }).notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
});

// ============ 产品规格 ============
export const productSpecs = pgTable('product_specs', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  label: varchar('label', { length: 255 }).notNull(),
  value: varchar('value', { length: 500 }).notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
});

// ============ 订单表 ============
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  orderNumber: varchar('order_number', { length: 50 }).notNull().unique(),
  customerName: varchar('customer_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }).notNull().default(''),
  country: varchar('country', { length: 100 }).notNull(),
  address: text('address').notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 100 }).notNull().default(''),
  zipCode: varchar('zip_code', { length: 20 }).notNull(),
  productName: varchar('product_name', { length: 255 }).notNull(),
  quantity: integer('quantity').notNull().default(1),
  unitPrice: real('unit_price').notNull(),
  subtotal: real('subtotal').notNull(),
  shippingMethod: varchar('shipping_method', { length: 100 }).notNull(),
  shippingFee: real('shipping_fee').notNull().default(0),
  discountCode: varchar('discount_code', { length: 50 }),
  discountAmount: real('discount_amount').notNull().default(0),
  totalAmount: real('total_amount').notNull(),
  currency: varchar('currency', { length: 10 }).notNull().default('USD'),
  stripePaymentIntentId: varchar('stripe_payment_intent_id', { length: 255 }),
  paymentStatus: varchar('payment_status', { length: 20 }).notNull().default('pending'),
  fulfillmentStatus: varchar('fulfillment_status', { length: 20 }).notNull().default('pending'),
  notes: text('notes').default(''),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ============ 落地页内容 ============
export const landingContent = pgTable('landing_content', {
  id: serial('id').primaryKey(),
  sectionKey: varchar('section_key', { length: 50 }).notNull().unique(),
  contentJson: jsonb('content_json').notNull(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ============ 商店设置 ============
export const storeSettings = pgTable('store_settings', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 100 }).notNull().unique(),
  value: text('value').notNull().default(''),
});

// ============ 运费规则 ============
export const shippingRates = pgTable('shipping_rates', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  price: real('price').notNull().default(0),
  minDays: integer('min_days').notNull().default(7),
  maxDays: integer('max_days').notNull().default(12),
  minOrderForFree: real('min_order_for_free'),
  isActive: boolean('is_active').notNull().default(true),
});

// ============ 优惠码 ============
export const discountCodes = pgTable('discount_codes', {
  id: serial('id').primaryKey(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  type: varchar('type', { length: 20 }).notNull().default('percentage'), // percentage | fixed
  value: real('value').notNull(),
  minAmount: real('min_amount'),
  usageLimit: integer('usage_limit'),
  usageCount: integer('usage_count').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  startsAt: timestamp('starts_at'),
  endsAt: timestamp('ends_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ============ Ozon 利润测算 ============
export const ozonReports = pgTable('ozon_reports', {
  id: serial('id').primaryKey(),
  month: varchar('month', { length: 10 }).notNull().unique(), // YYYY-MM
  year: integer('year').notNull(),
  monthNum: integer('month_num').notNull(),

  // Ozon 平台数据（单位：卢布 RUB）
  salesRevenue: real('sales_revenue').notNull().default(0),           // 销售
  returns: real('returns').notNull().default(0),                      // 退货
  ozonCommission: real('ozon_commission').notNull().default(0),      // Ozon代理佣金
  deliveryService: real('delivery_service').notNull().default(0),    // 配送服务
  partnerServices: real('partner_services').notNull().default(0),    // 合作伙伴服务
  fboService: real('fbo_service').notNull().default(0),              // FBO服务
  promotionAdvertising: real('promotion_advertising').notNull().default(0), // 推广和广告
  otherFines: real('other_fines').notNull().default(0),              // 其他服务与罚款
  compensation: real('compensation').notNull().default(0),           // 赔偿和赔偿返还
  otherAccruals: real('other_accruals').notNull().default(0),        // 其他应计项目

  // 汇率
  exchangeRate: real('exchange_rate').notNull().default(0.08),       // 1 RUB = ? RMB

  // 额外成本（单位：人民币 RMB）
  purchaseCost: real('purchase_cost').notNull().default(0),          // 采购成本
  shippingCost: real('shipping_cost').notNull().default(0),          // 国际运费
  laborCost: real('labor_cost').notNull().default(0),                // 人工成本
  marketingCost: real('marketing_cost').notNull().default(0),        // 营销推广费用
  otherCost: real('other_cost').notNull().default(0),                // 其他费用

  // 计算结果
  ozonNetRub: real('ozon_net_rub').notNull().default(0),             // Ozon净收入(卢布)
  ozonNetRmb: real('ozon_net_rmb').notNull().default(0),             // Ozon净收入(人民币)
  totalAdditionalCost: real('total_additional_cost').notNull().default(0), // 额外成本合计(RMB)
  netProfit: real('net_profit').notNull().default(0),                // 净利润(RMB)
  profitMargin: real('profit_margin').notNull().default(0),          // 利润率(%)

  // 附件
  screenshotUrl: varchar('screenshot_url', { length: 500 }).default(''),
  notes: text('notes').default(''),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ============ WB 利润测算 ============
export const wbReports = pgTable('wb_reports', {
  id: serial('id').primaryKey(),
  month: varchar('month', { length: 10 }).notNull().unique(),
  year: integer('year').notNull(),
  monthNum: integer('month_num').notNull(),

  // 收入（卢布）
  salesRevenue: real('sales_revenue').notNull().default(0),
  lossesDefects: real('losses_defects').notNull().default(0),

  // 支出（卢布）
  logisticsFee: real('logistics_fee').notNull().default(0),
  storageFee: real('storage_fee').notNull().default(0),
  inboundFee: real('inbound_fee').notNull().default(0),
  fines: real('fines').notNull().default(0),
  commissionAcquiring: real('commission_acquiring').notNull().default(0),
  deductions: real('deductions').notNull().default(0),
  membershipFee: real('membership_fee').notNull().default(0),

  // 汇率
  exchangeRate: real('exchange_rate').notNull().default(0.08),

  // 额外成本（人民币）
  purchaseCost: real('purchase_cost').notNull().default(0),
  shippingCost: real('shipping_cost').notNull().default(0),
  laborCost: real('labor_cost').notNull().default(0),
  marketingCost: real('marketing_cost').notNull().default(0),
  otherCost: real('other_cost').notNull().default(0),

  // 计算结果
  wbNetRub: real('wb_net_rub').notNull().default(0),
  wbNetRmb: real('wb_net_rmb').notNull().default(0),
  totalAdditionalCost: real('total_additional_cost').notNull().default(0),
  netProfit: real('net_profit').notNull().default(0),
  profitMargin: real('profit_margin').notNull().default(0),

  screenshotUrl: varchar('screenshot_url', { length: 500 }).default(''),
  notes: text('notes').default(''),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ============ 共享成本（俄罗斯市场均摊） ============
export const sharedCosts = pgTable('shared_costs', {
  id: serial('id').primaryKey(),
  month: varchar('month', { length: 10 }).notNull().unique(),
  totalShipping: real('total_shipping').notNull().default(0),
  totalStorage: real('total_storage').notNull().default(0),
  totalOtherLabor: real('total_other_labor').notNull().default(0),   // 管理人事行政等其他人力
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ============ 管理员 ============
export const admins = pgTable('admins', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 100 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
