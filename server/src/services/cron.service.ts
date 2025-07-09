import cron from "node-cron";
import httpLogger from "./logger.service";
import orderService from "./order.service";
import productService from "./product.service";
import cleanupService from "./cleanup.service";
import { IOrder } from "../types/order.type";
import ServerError from "../errors/serverError.error";
import { StatusCodes } from "http-status-codes";

// Daily sync job at 12:00 PM
const syncOrdersDaily = cron.schedule(
  "0 12 * * *",
  async () => {
    httpLogger.info("Starting daily order sync job...");

    try {
      const processedOrders = await startSyncProcess();
      if (!processedOrders) {
        throw new ServerError(
          "WooCommerce Server Error",
          StatusCodes.INTERNAL_SERVER_ERROR.toString()
        );
      }

      httpLogger.info(
        `Successfully processed ${processedOrders.length} orders`
      );
    } catch (error: any) {
      httpLogger.error("Error in daily order sync job:", {
        error: error.message,
        stack: error.stack,
      });
    }
  },
  {
    timezone: "UTC",
  }
);

// Weekly cleanup job every Sunday at 2:00 AM
const cleanupWeekly = cron.schedule(
  "0 2 * * 0",
  async () => {
    httpLogger.info("Starting weekly cleanup job...");

    try {
      const result = await cleanupService.cleanupOldOrders();
      
      httpLogger.info(
        `Weekly cleanup completed: ${result.deletedOrders} orders and ${result.deletedProducts} products deleted`
      );
    } catch (error: any) {
      httpLogger.error("Error in weekly cleanup job:", {
        error: error.message,
        stack: error.stack,
      });
    }
  },
  {
    timezone: "UTC",
  }
);

const startSyncProcess = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const afterDate = thirtyDaysAgo.toISOString();

  httpLogger.info(`Fetching orders from ${afterDate}`);

  const wooCommerceOrders = await fetchOrdersFromWooCommerce(afterDate);

  if (wooCommerceOrders.length === 0) {
    httpLogger.info("No orders found in the last 30 days");
    return;
  }

  httpLogger.info(`Found ${wooCommerceOrders.length} orders from WooCommerce`);

  const processedOrders = await processOrders(wooCommerceOrders);

  httpLogger.info(`Successfully processed ${processedOrders.length} orders`);

  return processedOrders;
};

const fetchOrdersFromWooCommerce = async (
  afterDate: string
): Promise<any[]> => {
  try {
    const orders = await orderService.syncOrdersWithDateFilter(afterDate);
    return orders;
  } catch (error: any) {
    httpLogger.error("Error fetching orders from WooCommerce:", {
      error: error.message,
    });

    throw new ServerError(
      "WooCommerce Server Error",
      StatusCodes.INTERNAL_SERVER_ERROR.toString()
    );
  }
};

const processOrders = async (wooCommerceOrders: any[]): Promise<IOrder[]> => {
  const processedOrders: IOrder[] = [];

  for (const wooOrder of wooCommerceOrders) {
    try {
      const existingOrder = await orderService.getOrderOrderKey(wooOrder.order_key);

      if (existingOrder) {
        httpLogger.info(`Order ${wooOrder.id} already exists, skipping...`);
        continue;
      }

      const transformedOrder: IOrder = {
        id: wooOrder.id.toString(),
        number: wooOrder.number,
        order_key: wooOrder.order_key,
        status: wooOrder.status,
        date_created: new Date(wooOrder.date_created),
        total: parseFloat(wooOrder.total),
        customer_id: wooOrder.customer_id.toString(),
        customer_note: wooOrder.customer_note || "",
        billing: wooOrder.billing,
        shipping: wooOrder.shipping,
        line_items: [],
      };

      if (wooOrder.line_items && wooOrder.line_items.length > 0) {
        const productIds = await processLineItems(wooOrder.line_items);
        transformedOrder.line_items = productIds;
      }

      const savedOrder = await orderService.createOrder(transformedOrder);
      processedOrders.push(savedOrder);

      httpLogger.info(`Successfully processed order ${wooOrder.id}`);
    } catch (error: any) {
      httpLogger.error(`Error processing order ${wooOrder.id}:`, {
        error: error.message,
      });

      throw error;
    }
  }

  return processedOrders;
};

const processLineItems = async (lineItems: any[]): Promise<any[]> => {
  const productIds: any[] = [];

  for (const item of lineItems) {
    try {
      let product = await productService.getProductById(item.product_id);

      if (!product) {
        product = await productService.fetchAndCreateProducts(+item.product_id);
        // TODO: need to handle case when one product fetch fails
        httpLogger.info(
          `Created new product ${item.product_id} from line item`
        );
      }

      productIds.push(product?._id);
    } catch (error: any) {
      httpLogger.error(
        `Error processing line item product ${item.product_id}:`,
        {
          error: error.message,
        }
      );
      throw error;
    }
  }

  return productIds;
};

export const startCronJobs = () => {
  httpLogger.info("Starting cron jobs...");
  syncOrdersDaily.start();
  cleanupWeekly.start();
  httpLogger.info("Daily order sync job scheduled for 12:00 PM UTC");
  httpLogger.info("Weekly cleanup job scheduled for 2:00 AM UTC every Sunday");
};

export const stopCronJobs = () => {
  httpLogger.info("Stopping cron jobs...");
  syncOrdersDaily.stop();
  cleanupWeekly.stop();
};

export const triggerOrderSync = async () => {
  httpLogger.info("Manually triggering order sync...");
  const processedOrders = await startSyncProcess();

  if (!processedOrders) {
    throw new ServerError(
      "WooCommerce Server Error",
      StatusCodes.INTERNAL_SERVER_ERROR.toString()
    );
  }

  httpLogger.info(`Successfully processed ${processedOrders.length} orders`);
};

// Manual trigger for cleanup
export const triggerCleanup = async () => {
  httpLogger.info("Manually triggering cleanup...");
  const result = await cleanupService.cleanupOldOrders();
  
  httpLogger.info(
    `Manual cleanup completed: ${result.deletedOrders} orders and ${result.deletedProducts} products deleted`
  );
  
  return result;
};

export default {
  startCronJobs,
  stopCronJobs,
  triggerOrderSync,
  triggerCleanup,
};
