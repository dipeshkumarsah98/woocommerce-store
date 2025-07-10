import { Worker, Job, WorkerOptions, FlowChildJob, tryCatch } from "bullmq";
import redisConfig from "../config/redis.config";
import { QUEUE_NAMES, JOB_TYPES } from "../utils/constants.utils";
import logger from "./logger.service";
import { fetchOrdersFromWooCommerce } from "./cron.service";
import queueService from "./queue.service";
import orderService from "./order.service";
import { IOrder } from "../types/order.type";
import productService from "./product.service";
import { Types } from "mongoose";

interface JobData {
  [key: string]: any;
}

class WorkerService {
  private workers: Map<string, Worker> = new Map();
  private defaultWorkerOptions: WorkerOptions = {
    connection: redisConfig,
    concurrency: 5,
  };

  constructor() {
    this.initializeWorkers();
  }

  private initializeWorkers(): void {
    this.createWorker(QUEUE_NAMES.ORDERS, this.processOrdersJob.bind(this));
    this.createWorker(QUEUE_NAMES.PRODUCTS, this.processProductsJob.bind(this));

    logger.info("Worker service initialized successfully");
  }

  private createWorker(
    queueName: string,
    processor: (job: Job<JobData>) => Promise<any>,
    options?: WorkerOptions
  ): Worker {
    if (this.workers.has(queueName)) {
      return this.workers.get(queueName)!;
    }

    const workerOptions = {
      ...this.defaultWorkerOptions,
      ...options,
    };

    const worker = new Worker(queueName, processor, workerOptions);

    // Add event listeners
    worker.on("ready", () => {
      logger.info(`Worker for queue ${queueName} is ready`);
    });

    worker.on("error", (error: Error) => {
      logger.error(`Worker for queue ${queueName} error:`, error.message);
    });

    worker.on("failed", (job: Job | undefined, err: Error) => {
      logger.error(`Job ${job?.id} failed in worker ${queueName}:`, err);
    });

    worker.on("completed", (job: Job) => {
      logger.info(`Job ${job.id} completed in worker ${queueName}`);
    });

    this.workers.set(queueName, worker);
    return worker;
  }

  // ------------------------------------------------------------
  // Set up worker for each queue
  // ------------------------------------------------------------

  private async processProductsJob(job: Job<JobData>): Promise<any> {
    try {
      switch (job.name) {
        case JOB_TYPES.PRODUCTS.PROCESS_PRODUCT:
          return await this.handleProcessProduct(job.data);
      }
    } catch (error) {
      logger.error(`Error processing job ${job.id}:`, error);
      throw error;
    }
  }

  private async processOrdersJob(job: Job<JobData>): Promise<any> {
    try {
      switch (job.name) {
        case JOB_TYPES.ORDERS.SYNC_ORDERS:
          return await this.handleSyncOrders(job.data);

        case JOB_TYPES.ORDERS.PROCESS_ORDER:
          return await this.handleProcessOrder(job.data);

        case JOB_TYPES.ORDERS.SEND_ORDER_EMAIL:
          return await this.handleSendOrderEmail(job.data);

        case JOB_TYPES.ORDERS.UPDATE_ORDER_STATUS:
          return await this.handleUpdateOrderStatus(job.data);

        case JOB_TYPES.ORDERS.CLEANUP_OLD_ORDERS:
          return await this.handleCleanupOldOrders(job.data);

        case `${QUEUE_NAMES.ORDERS}-FLOW`:
          return await this.handleProcessOrderFlow(job as Job<IOrder>);

        default:
          throw new Error(`Unknown job type: ${job.name}`);
      }
    } catch (error) {
      logger.error(`Error processing job ${job.id}:`, error);
      throw error;
    }
  }
  // ------------------------------------------------------------
  // Process product job handler
  // ------------------------------------------------------------

  private async handleProcessProduct(data: JobData): Promise<any> {
    logger.info("Handling process product job for product", data.product_id);
    try {
      let product = await productService.getProductById(data.product_id);

      if (!product) {
        product = await productService.fetchAndCreateProducts(+data.product_id);
        // TODO: need to handle case when one product fetch fails
        logger.info(`Created new product ${data.product_id} from line item`);
      }
      return product?._id;
    } catch (error: any) {
      logger.error(`Error processing line item product ${data.product_id}:`, {
        error: error.message,
      });
      throw error;
    }
  }

  // ------------------------------------------------------------
  // Process order queue job handler
  // ------------------------------------------------------------

  private async handleSyncOrders(data: JobData): Promise<any> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const afterDate = thirtyDaysAgo.toISOString();

    logger.info(`Fetching orders from ${afterDate}`);

    const wooCommerceOrders = await fetchOrdersFromWooCommerce(afterDate);

    if (wooCommerceOrders.length === 0) {
      logger.info("No orders found in the last 30 days");
      return;
    }

    for (const order of wooCommerceOrders) {
      await queueService.addProcessOrderJob(order);
    }

    logger.info(`Found ${wooCommerceOrders.length} orders from WooCommerce`);
    return {
      success: true,
      message: "Orders processing job added to the queue",
    };
  }

  private async handleProcessOrder(data: JobData): Promise<any> {
    logger.info("--------------------------------\n");
    logger.info("Handling process order job for order", data.order_key);
    logger.info("--------------------------------\n");

    const order = await orderService.getOrderOrderKey(data.order_key);

    if (order) {
      logger.info(
        `Order ${data.order_key} already exists, will update the status only...`
      );
      queueService.addUpdateOrderStatusJob(
        {
          data: {
            orderKey: data.order_key,
            status: data.status,
          },
        },
        {
          attempts: 2,
        }
      );
      return;
    }

    const transformedOrder: IOrder = {
      id: data.id.toString(),
      number: data.number,
      order_key: data.order_key,
      status: data.status,
      date_created: new Date(data.date_created),
      total: parseFloat(data.total),
      customer_id: data.customer_id.toString(),
      customer_note: data.customer_note || "",
      billing: data.billing,
      shipping: data.shipping,
      line_items: [],
    };

    const childrens: FlowChildJob[] = data?.line_items.map(
      (item: any): FlowChildJob => {
        return {
          name: JOB_TYPES.PRODUCTS.PROCESS_PRODUCT,
          data: {
            ...item,
          },
          queueName: QUEUE_NAMES.PRODUCTS,
          opts: {
            attempts: 3,
          },
        };
      }
    );

    await queueService.addProcessOrderFlowJob(transformedOrder, childrens);

    console.log("Process order flow job added to the queue");
    return;
  }

  private async handleSendOrderEmail(data: JobData): Promise<any> {
    logger.info("Handling send order email job", data);

    // TODO: Implement email sending logic
    // This could integrate with email service providers

    return { success: true, message: "Order email sent successfully" };
  }

  private async handleUpdateOrderStatus(data: JobData): Promise<any> {
    logger.info("Handling update order status job", data);
    const order = await orderService.getOrderOrderKey(data.orderKey);

    if (!order) {
      logger.error(`Order ${data.orderKey} not found`);
      return;
    }

    if (order.status === data.newStatus) {
      logger.info(
        `Order ${data.orderKey} already has status ${data.newStatus}, skipping...`
      );
      return;
    }

    await orderService.updateOrderStatus(data.orderKey, data.newStatus);

    return { success: true, message: "Order status updated successfully" };
  }

  private async handleCleanupOldOrders(data: JobData): Promise<any> {
    logger.info("Handling cleanup old orders job", data);

    // TODO: Implement cleanup logic
    // This could integrate with your existing cleanup service

    return { success: true, message: "Old orders cleaned up successfully" };
  }

  // ------------------------------------------------------------
  // Process order flow job handler
  // ------------------------------------------------------------
  private async handleProcessOrderFlow(job: Job<IOrder>): Promise<any> {
    logger.info("--------------------------------\n");
    logger.info(`Processing FLOW for order ${job.data.order_key}`);
    logger.info("--------------------------------\n");
    try {
      const childrenValues = await job.getChildrenValues();

      const line_items: string[] = Object.values(childrenValues);

      const orderPayload: IOrder = {
        ...job.data,
        line_items: line_items.map((item: string) => new Types.ObjectId(item)),
      };

      const order = await orderService.createOrder(orderPayload);

      return order;
    } catch (error) {
      logger.error(
        `Error processing order flow for order ${job.data.order_key}:`,
        error
      );
      throw error;
    }
  }

  // ------------------------------------------------------------
  // Worker methods
  // ------------------------------------------------------------

  public getWorker(queueName: string): Worker | undefined {
    return this.workers.get(queueName);
  }

  public async pauseWorker(queueName: string): Promise<void> {
    const worker = this.getWorker(queueName);
    if (!worker) {
      throw new Error(`Worker for queue ${queueName} not found`);
    }

    await worker.pause();
    logger.info(`Worker for queue ${queueName} paused`);
  }

  public async resumeWorker(queueName: string): Promise<void> {
    const worker = this.getWorker(queueName);
    if (!worker) {
      throw new Error(`Worker for queue ${queueName} not found`);
    }

    await worker.resume();
    logger.info(`Worker for queue ${queueName} resumed`);
  }

  public async closeWorkers(): Promise<void> {
    const closePromises = Array.from(this.workers.values()).map((worker) =>
      worker.close()
    );
    await Promise.all(closePromises);
    this.workers.clear();
    logger.info("All workers closed");
  }
}

export default new WorkerService();
