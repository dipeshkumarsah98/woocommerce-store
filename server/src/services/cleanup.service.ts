import Order from "../models/order.model";
import Product from "../models/product.model";
import httpLogger from "./logger.service";
import { Types } from "mongoose";

const cleanupOldOrders = async (): Promise<{ deletedOrders: number; deletedProducts: number }> => {
  try {
    httpLogger.info("Starting cleanup process for old orders...");

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    httpLogger.info(`Cleaning up orders older than ${threeMonthsAgo.toISOString()}`);

    const oldOrders = await Order.find({
      date_created: { $lt: threeMonthsAgo }
    });

    if (oldOrders.length === 0) {
      httpLogger.info("No old orders found to cleanup");
      return { deletedOrders: 0, deletedProducts: 0 };
    }

    httpLogger.info(`Found ${oldOrders.length} orders to delete`);

    const productIdsToCheck = new Set<string>();
    oldOrders.forEach(order => {
      order.line_items.forEach(productId => {
        if (productId) {
          productIdsToCheck.add(productId.toString());
        }
      });
    });

    const deleteOrdersResult = await Order.deleteMany({
      date_created: { $lt: threeMonthsAgo }
    });

    httpLogger.info(`Deleted ${deleteOrdersResult.deletedCount} old orders`);

    const orphanedProducts = await findOrphanedProducts(Array.from(productIdsToCheck));
    
    let deletedProductsCount = 0;
    if (orphanedProducts.length > 0) {
      const deleteProductsResult = await Product.deleteMany({
        _id: { $in: orphanedProducts.map(id => new Types.ObjectId(id)) }
      });

      deletedProductsCount = deleteProductsResult.deletedCount || 0;
      httpLogger.info(`Deleted ${deletedProductsCount} orphaned products`);
    } else {
      httpLogger.info("No orphaned products found");
    }

    httpLogger.info(`Cleanup completed: ${deleteOrdersResult.deletedCount} orders and ${deletedProductsCount} products deleted`);

    return {
      deletedOrders: deleteOrdersResult.deletedCount || 0,
      deletedProducts: deletedProductsCount
    };

  } catch (error: any) {
    httpLogger.error("Error in cleanup process:", {
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
};

const findOrphanedProducts = async (productIdsToCheck: string[]): Promise<string[]> => {
  try {
    if (productIdsToCheck.length === 0) {
      return [];
    }

    httpLogger.info(`Checking ${productIdsToCheck.length} products for orphaned status`);

    const orphanedProducts: string[] = [];

    for (const productId of productIdsToCheck) {
      const ordersWithProduct = await Order.countDocuments({
        line_items: new Types.ObjectId(productId)
      });

      if (ordersWithProduct === 0) {
        orphanedProducts.push(productId);
      }
    }

    httpLogger.info(`Found ${orphanedProducts.length} orphaned products`);
    return orphanedProducts;

  } catch (error: any) {
    httpLogger.error("Error finding orphaned products:", {
      error: error.message
    });
    throw error;
  }
};

const getCleanupStats = async () => {
  try {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const [totalOrders, oldOrders, totalProducts] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ date_created: { $lt: threeMonthsAgo } }),
      Product.countDocuments()
    ]);

    return {
      totalOrders,
      oldOrders,
      totalProducts,
      cutoffDate: threeMonthsAgo.toISOString()
    };

  } catch (error: any) {
    httpLogger.error("Error getting cleanup stats:", {
      error: error.message
    });
    throw error;
  }
};

const previewCleanup = async () => {
  try {
    httpLogger.info("Running cleanup preview...");

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    // Find orders that would be deleted
    const ordersToDelete = await Order.find({
      date_created: { $lt: threeMonthsAgo }
    }).select('id number date_created line_items');

    if (ordersToDelete.length === 0) {
      return {
        ordersToDelete: [],
        productsToCheck: [],
        summary: {
          ordersCount: 0,
          productsToCheckCount: 0
        }
      };
    }

    const productIdsToCheck = new Set<string>();
    ordersToDelete.forEach(order => {
      order.line_items.forEach(productId => {
        if (productId) {
          productIdsToCheck.add(productId.toString());
        }
      });
    });

    return {
      ordersToDelete: ordersToDelete.map(order => ({
        id: order.id,
        number: order.number,
        date_created: order.date_created,
        line_items_count: order.line_items.length
      })),
      productsToCheck: Array.from(productIdsToCheck),
      summary: {
        ordersCount: ordersToDelete.length,
        productsToCheckCount: productIdsToCheck.size
      }
    };

  } catch (error: any) {
    httpLogger.error("Error in cleanup preview:", {
      error: error.message
    });
    throw error;
  }
};

export default {
  cleanupOldOrders,
  findOrphanedProducts,
  getCleanupStats,
  previewCleanup
}; 