import {
  Queue,
  QueueOptions,
  JobsOptions,
  FlowProducer,
  FlowChildJob,
  JobNode,
} from "bullmq";
import redisConfig from "../config/redis.config";
import {
  QUEUE_NAMES,
  JOB_TYPES,
  JOB_PRIORITIES,
  JOB_DELAYS,
} from "../utils/constants.utils";
import logger from "./logger.service";

interface QueueJobData {
  [key: string]: any;
}

interface QueueJobOptions extends JobsOptions {
  priority?: number;
  delay?: number;
  attempts?: number;
  backoff?: {
    type: "exponential" | "fixed";
    delay: number;
  };
}

class QueueService {
  private queues: Map<string, Queue> = new Map();
  private flow: Map<string, FlowProducer> = new Map();

  private defaultQueueOptions: QueueOptions = {
    connection: redisConfig,
    defaultJobOptions: {
      removeOnComplete: 10,
      removeOnFail: 5,
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
    },
  };

  constructor() {
    this.initializeQueues();
  }

  private initializeQueues(): void {
    this.createQueue(QUEUE_NAMES.ORDERS);
    this.createQueue(QUEUE_NAMES.PRODUCTS);
    this.createFlow(QUEUE_NAMES.ORDERS);

    logger.info("Queue service initialized successfully");
  }

  private createQueue(queueName: string, options?: QueueOptions): Queue {
    if (this.queues.has(queueName)) {
      return this.queues.get(queueName)!;
    }

    const queueOptions = {
      ...this.defaultQueueOptions,
      ...options,
    };

    const queue = new Queue(queueName, queueOptions);

    // Add basic error listener
    queue.on("error", (error: Error) => {
      logger.error(`Queue ${queueName} error:`, error);
    });

    this.queues.set(queueName, queue);
    return queue;
  }

  private createFlow(queueName: string): FlowProducer {
    if (this.flow.has(queueName)) {
      return this.flow.get(queueName)!;
    }

    const flow = new FlowProducer({
      connection: redisConfig,
    });

    this.flow.set(queueName, flow);

    return flow;
  }

  public getQueue(queueName: string): Queue | undefined {
    return this.queues.get(queueName);
  }

  public getFlow(queueName: string): FlowProducer | undefined {
    return this.flow.get(queueName);
  }

  public async addFlowJob(
    flowName: string,
    queueName: string,
    data: QueueJobData,
    childrens: FlowChildJob[],
    options?: QueueJobOptions
  ): Promise<JobNode | null> {
    const flow = this.getFlow(queueName);
    if (!flow) {
      throw new Error(`Flow ${queueName} not found`);
    }

    const job = await flow.add({
      name: flowName,
      queueName: queueName,
      data,
      children: childrens,
      ...options,
    });

    logger.info(`Flow job ${queueName} added to flow ${flowName}`);
    return job;
  }

  public async addJob(
    queueName: string,
    jobType: string,
    data: QueueJobData,
    options?: QueueJobOptions
  ): Promise<void> {
    try {
      const queue = this.getQueue(queueName);
      if (!queue) {
        throw new Error(`Queue ${queueName} not found`);
      }

      const jobOptions: QueueJobOptions = {
        priority: JOB_PRIORITIES.MEDIUM,
        delay: JOB_DELAYS.IMMEDIATE,
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 2000,
        },
        ...options,
      };

      await queue.add(jobType, data, jobOptions);
      logger.info(`Job ${jobType} added to queue ${queueName}`);
    } catch (error) {
      logger.error(
        `Failed to add job ${jobType} to queue ${queueName}:`,
        error
      );
      throw error;
    }
  }

  public async addOrderSyncJob(
    data: QueueJobData,
    options?: QueueJobOptions
  ): Promise<void> {
    return this.addJob(QUEUE_NAMES.ORDERS, JOB_TYPES.ORDERS.SYNC_ORDERS, data, {
      priority: JOB_PRIORITIES.HIGH,
      ...options,
    });
  }

  public async addProcessOrderJob(
    data: QueueJobData,
    options?: QueueJobOptions
  ): Promise<void> {
    return this.addJob(QUEUE_NAMES.ORDERS, JOB_TYPES.ORDERS.PROCESS_ORDER, data, {
      priority: JOB_PRIORITIES.HIGH,
      ...options,
    });
  }

  public async addProcessOrderFlowJob(
    data: QueueJobData,
    children: FlowChildJob[],
    options?: QueueJobOptions
  ): Promise<JobNode | null> {
    const flow = this.getFlow(QUEUE_NAMES.ORDERS);
    if (!flow) {
      throw new Error(`Flow ${QUEUE_NAMES.ORDERS} not found`);
    }

    const job = await this.addFlowJob(
      `${QUEUE_NAMES.ORDERS}-FLOW`, 
      QUEUE_NAMES.ORDERS,
      data,
      children,
      {
        priority: JOB_PRIORITIES.MEDIUM,
        ...options,
      }
    );

    return job;
  }

  public async addOrderEmailJob(
    data: QueueJobData,
    options?: QueueJobOptions
  ): Promise<void> {
    return this.addJob(
      QUEUE_NAMES.ORDERS,
      JOB_TYPES.ORDERS.SEND_ORDER_EMAIL,
      data,
      {
        priority: JOB_PRIORITIES.LOW,
        delay: JOB_DELAYS.SHORT,
        ...options,
      }
    );
  }

  public async addUpdateOrderStatusJob(
    data: QueueJobData,
    options?: QueueJobOptions
  ): Promise<void> {
    return this.addJob(
      QUEUE_NAMES.ORDERS,
      JOB_TYPES.ORDERS.UPDATE_ORDER_STATUS,
      data,
      {
        priority: JOB_PRIORITIES.HIGH,
        ...options,
      }
    );
  }

  public async addCleanupOrdersJob(
    data: QueueJobData,
    options?: QueueJobOptions
  ): Promise<void> {
    return this.addJob(
      QUEUE_NAMES.ORDERS,
      JOB_TYPES.ORDERS.CLEANUP_OLD_ORDERS,
      data,
      {
        priority: JOB_PRIORITIES.LOW,
        delay: JOB_DELAYS.LONG,
        ...options,
      }
    );
  }

  public async getQueueStats(queueName: string): Promise<any> {
    const queue = this.getQueue(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queue.getWaiting(),
      queue.getActive(),
      queue.getCompleted(),
      queue.getFailed(),
      queue.getDelayed(),
    ]);

    return {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
      delayed: delayed.length,
    };
  }

  public async pauseQueue(queueName: string): Promise<void> {
    const queue = this.getQueue(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    await queue.pause();
    logger.info(`Queue ${queueName} paused`);
  }

  public async resumeQueue(queueName: string): Promise<void> {
    const queue = this.getQueue(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    await queue.resume();
    logger.info(`Queue ${queueName} resumed`);
  }

  public async closeQueues(): Promise<void> {
    const closePromises = Array.from(this.queues.values()).map((queue) =>
      queue.close()
    );
    await Promise.all(closePromises);
    this.queues.clear();
    logger.info("All queues closed");
  }
}

export default new QueueService();
