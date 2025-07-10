export const QUERY_KEYS = {
  PRODUCTS: "products",
  ORDERS: "orders",
};

export const QUEUE_NAMES = {
  ORDERS: "orders",
  PRODUCTS: "products",
} as const;

export const JOB_TYPES = {
  ORDERS: {
    SYNC_ORDERS: "sync_orders",
    PROCESS_ORDER: "process_order",
    SEND_ORDER_EMAIL: "send_order_email",
    UPDATE_ORDER_STATUS: "update_order_status",
    CLEANUP_OLD_ORDERS: "cleanup_old_orders",
  },
  PRODUCTS: {
    PROCESS_PRODUCT: "process_product",
  },
} as const;

export const JOB_PRIORITIES = {
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
} as const;

export const JOB_DELAYS = {
  IMMEDIATE: 0,
  SHORT: 5000,    // 5 seconds
  MEDIUM: 30000,  // 30 seconds
  LONG: 300000,   // 5 minutes
} as const;

