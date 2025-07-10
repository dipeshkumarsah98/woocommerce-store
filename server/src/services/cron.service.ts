import cron from "node-cron";
import httpLogger from "./logger.service";
import orderService from "./order.service";
import cleanupService from "./cleanup.service";
import ServerError from "../errors/serverError.error";
import queueService from "./queue.service";
import { StatusCodes } from "http-status-codes";

// Daily sync job at 12:00 PM
const syncOrdersDaily = cron.schedule(
  "0 12 * * *",
  async () => {
    httpLogger.info("Starting daily order sync job...");

    try {
      await startSyncProcess();
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

export const startSyncProcess = async () => {
  await queueService.addOrderSyncJob({}, {
    attempts: 3
  }); 
  httpLogger.info("Added order sync job to the queue");
};

export const fetchOrdersFromWooCommerce = async (
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

  await startSyncProcess();

  httpLogger.info(`Successfully triggered order sync`);
};

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
