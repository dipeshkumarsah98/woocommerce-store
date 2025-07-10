import Order from "../models/order.model";
import { IOrder, IOrderQuery } from "../types/order.type";
import { Types } from "mongoose";
import { IProduct } from "../types/product.type";
import axiosInstance from "../utils/axiosInstance.utils";
import httpLogger from "./logger.service";
import productService from "./product.service";
import queueService from "./queue.service";

const getOrders = async (filterQuery: IOrderQuery) => {
  const { search, status, sortBy, sortOrder, lineItem } = filterQuery;

  const query: any = {};

  if (status) query.status = status;

  if (lineItem && Types.ObjectId.isValid(lineItem)) query.line_items = { $in: [new Types.ObjectId(lineItem)] };

  if (search) {
    query.$text = { $search: search };
  }

  const sortField =
    sortBy === "total" || sortBy === "date_created" ? sortBy : "date_created";
  const sortDirection = sortOrder === "asc" ? 1 : -1;
  const sort: { [key: string]: 1 | -1 } = { [sortField]: sortDirection };

  const orders = await Order.find(query)
    .populate({
      path: "line_items",
      select: "name",
    })
    .sort(sort)
    .lean();
  return orders;
};

const createOrder = async (order: IOrder) => {
  const newOrder = new Order(order);
  await newOrder.save();
  return newOrder;
};

const getProductOrders = async (productId: Types.ObjectId) => {
  const orders = await Order.find({
    line_items: { $in: [productId] },
  }).populate({
    path: "line_items",
    select: "name",
  });

  return orders;
};

const getOrderById = async (id: string): Promise<IOrder | null> => {
  const order = await Order.findById(id).populate("line_items.product").lean();
  return order;
};

const getOrderOrderKey = async (orderKey: string): Promise<IOrder | null> => {
  const order = await Order.findOne({ order_key: orderKey }).lean();
  return order;
};

const getOrderProducts = async (
  orderKey: string
): Promise<IProduct[] | null> => {
  const order = await getOrderOrderKey(orderKey);
  if (!order) {
    return null;
  }
  const products = await productService.getProductsByIds(order.line_items);
  return products;
};

const createManyOrders = async (orders: IOrder[]) => {
  const newOrders = await Order.insertMany(orders);
  
  // Add sync completion job
  await queueService.addOrderSyncJob({
    syncedCount: newOrders.length,
    timestamp: new Date().toISOString(),
    orderIds: newOrders.map(order => order._id),
  });
  
  return newOrders;
};

const updateOrderStatus = async (orderKey: string, newStatus: string) => {
  const updatedOrder = await Order.findOneAndUpdate(
    { order_key: orderKey },
    { status: newStatus },
    { new: true }
  );
  
  if (updatedOrder) {
    await queueService.addUpdateOrderStatusJob({
      orderId: updatedOrder._id,
      orderKey: updatedOrder.order_key,
      oldStatus: updatedOrder.status, 
      newStatus: newStatus,
      timestamp: new Date().toISOString(),
    });
    
    if (updatedOrder.billing?.email) {
      await queueService.addOrderEmailJob({
        orderId: updatedOrder._id,
        orderKey: updatedOrder.order_key,
        customerEmail: updatedOrder.billing.email,
        customerName: `${updatedOrder.billing.first_name} ${updatedOrder.billing.last_name}`,
        orderTotal: updatedOrder.total,
        status: newStatus,
        isStatusUpdate: true,
      });
    }
  }
  
  return updatedOrder;
};

const syncOrders = async () => {
  try {
    const { data } = await axiosInstance.get("wp-json/wc/v3/orders");
    
    return data;
  } catch (error: any) {
    httpLogger.error(`Error syncing orders`, {
      error: error.message,
    });

    return [];
  }
};

const syncOrdersWithDateFilter = async (afterDate: string) => {
  try {
    const { data } = await axiosInstance.get("wp-json/wc/v3/orders", {
      params: {
        after: afterDate,
        per_page: 100,
        orderBy: "date_created",
        order: "desc",
      },
    });
    
    return data;
  } catch (error: any) {
    httpLogger.error(`Error syncing orders with date filter`, {
      error: error?.response?.data?.message || error.message,
      afterDate,
    });

    return [];
  }
};


export default {
  createOrder,
  getOrderById,
  createManyOrders,
  getOrderProducts,
  getOrders,
  syncOrders,
  getOrderOrderKey,
  syncOrdersWithDateFilter,
  getProductOrders,
  updateOrderStatus,
};
