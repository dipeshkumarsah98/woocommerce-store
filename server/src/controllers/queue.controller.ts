import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import queueService from '../services/queue.service';
import workerService from '../services/worker.service';
import { QUEUE_NAMES } from '../utils/constants.utils';
import { successResponse } from '../utils/successResponse.utils';
import errorResponse from '../utils/errorResponse.utils';
import logger from '../services/logger.service';

class QueueController {
  // Get queue statistics
  public async getQueueStats(req: Request, res: Response): Promise<void> {
    try {
      const { queueName } = req.params;
      
      if (!Object.values(QUEUE_NAMES).includes(queueName as any)) {
        res.status(StatusCodes.BAD_REQUEST).json(errorResponse('Invalid queue name', StatusCodes.BAD_REQUEST));
        return;
      }

      const stats = await queueService.getQueueStats(queueName);
      
      res.status(StatusCodes.OK).json(successResponse(StatusCodes.OK, { message: 'Queue statistics retrieved successfully', stats }));
    } catch (error) {
      logger.error('Error getting queue stats:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse('Failed to get queue statistics', StatusCodes.INTERNAL_SERVER_ERROR));
    }
  }

  // Get all queues statistics
  public async getAllQueuesStats(req: Request, res: Response): Promise<void> {
    try {
      const allStats: Record<string, any> = {};
      
      for (const queueName of Object.values(QUEUE_NAMES)) {
        try {
          allStats[queueName] = await queueService.getQueueStats(queueName);
        } catch (error) {
          logger.error(`Error getting stats for queue ${queueName}:`, error);
          allStats[queueName] = { error: 'Failed to get statistics' };
        }
      }
      
      res.status(StatusCodes.OK).json(successResponse(StatusCodes.OK, { message: 'All queue statistics retrieved successfully', stats: allStats }));
    } catch (error) {
      logger.error('Error getting all queue stats:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse('Failed to get queue statistics', StatusCodes.INTERNAL_SERVER_ERROR));
    }
  }

  // Add a job to the orders queue
  public async addOrderJob(req: Request, res: Response): Promise<void> {
    try {
      const { jobType, data, options } = req.body;

      if (!jobType || !data) {
        res.status(StatusCodes.BAD_REQUEST).json(errorResponse('Job type and data are required', StatusCodes.BAD_REQUEST));
        return;
      }

      // Add job based on type
      switch (jobType) {
        case 'sync_orders':
          await queueService.addOrderSyncJob(data, options);
          break;
        case 'process_order':
          await queueService.addProcessOrderJob(data, options);
          break;
        case 'send_order_email':
          await queueService.addOrderEmailJob(data, options);
          break;
        case 'update_order_status':
          await queueService.addUpdateOrderStatusJob(data, options);
          break;
        case 'cleanup_old_orders':
          await queueService.addCleanupOrdersJob(data, options);
          break;
        default:
          res.status(StatusCodes.BAD_REQUEST).json(errorResponse('Invalid job type', StatusCodes.BAD_REQUEST));
          return;
      }

      res.status(StatusCodes.CREATED).json(successResponse(StatusCodes.CREATED, {
        message: 'Job added successfully',
        jobType,
        queueName: QUEUE_NAMES.ORDERS,
      }));
    } catch (error) {
      logger.error('Error adding job:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse('Failed to add job', StatusCodes.INTERNAL_SERVER_ERROR));
    }
  }

  // Pause a queue
  public async pauseQueue(req: Request, res: Response): Promise<void> {
    try {
      const { queueName } = req.params;
      
      if (!Object.values(QUEUE_NAMES).includes(queueName as any)) {
        res.status(StatusCodes.BAD_REQUEST).json(errorResponse('Invalid queue name', StatusCodes.BAD_REQUEST));
        return;
      }

      await queueService.pauseQueue(queueName);
      
      res.status(StatusCodes.OK).json(successResponse(StatusCodes.OK, { message: `Queue ${queueName} paused successfully` }));
    } catch (error) {
      logger.error('Error pausing queue:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse('Failed to pause queue', StatusCodes.INTERNAL_SERVER_ERROR));
    }
  }

  // Resume a queue
  public async resumeQueue(req: Request, res: Response): Promise<void> {
    try {
      const { queueName } = req.params;
      
      if (!Object.values(QUEUE_NAMES).includes(queueName as any)) {
        res.status(StatusCodes.BAD_REQUEST).json(errorResponse('Invalid queue name', StatusCodes.BAD_REQUEST));
        return;
      }

      await queueService.resumeQueue(queueName);
      
      res.status(StatusCodes.OK).json(successResponse(StatusCodes.OK, { message: `Queue ${queueName} resumed successfully` }));
    } catch (error) {
      logger.error('Error resuming queue:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse('Failed to resume queue', StatusCodes.INTERNAL_SERVER_ERROR));
    }
  }

  // Pause a worker
  public async pauseWorker(req: Request, res: Response): Promise<void> {
    try {
      const { queueName } = req.params;
      
      if (!Object.values(QUEUE_NAMES).includes(queueName as any)) {
        res.status(StatusCodes.BAD_REQUEST).json(errorResponse('Invalid queue name', StatusCodes.BAD_REQUEST));
        return;
      }

      await workerService.pauseWorker(queueName);
      
      res.status(StatusCodes.OK).json(successResponse(StatusCodes.OK, { message: `Worker for queue ${queueName} paused successfully` }));
    } catch (error) {
      logger.error('Error pausing worker:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse('Failed to pause worker', StatusCodes.INTERNAL_SERVER_ERROR));
    }
  }

  // Resume a worker
  public async resumeWorker(req: Request, res: Response): Promise<void> {
    try {
      const { queueName } = req.params;
      
      if (!Object.values(QUEUE_NAMES).includes(queueName as any)) {
        res.status(StatusCodes.BAD_REQUEST).json(errorResponse('Invalid queue name', StatusCodes.BAD_REQUEST));
        return;
      }

      await workerService.resumeWorker(queueName);
      
      res.status(StatusCodes.OK).json(successResponse(StatusCodes.OK, { message: `Worker for queue ${queueName} resumed successfully` }));
    } catch (error) {
      logger.error('Error resuming worker:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse('Failed to resume worker', StatusCodes.INTERNAL_SERVER_ERROR));
    }
  }

  // Health check for queue system
  public async healthCheck(req: Request, res: Response): Promise<void> {
    try {
      const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        queues: {} as Record<string, any>,
        workers: {} as Record<string, any>,
      };

      // Check queue health
      for (const queueName of Object.values(QUEUE_NAMES)) {
        try {
          const queue = queueService.getQueue(queueName);
          const worker = workerService.getWorker(queueName);
          
          health.queues[queueName] = {
            exists: !!queue,
            isPaused: queue ? await queue.isPaused() : false,
          };
          
          health.workers[queueName] = {
            exists: !!worker,
            isRunning: worker ? worker.isRunning() : false,
          };
        } catch (error) {
          health.queues[queueName] = { error: 'Failed to check queue health' };
          health.workers[queueName] = { error: 'Failed to check worker health' };
        }
      }

      res.status(StatusCodes.OK).json(successResponse(StatusCodes.OK, { message: 'Queue system health check completed', health }));
    } catch (error) {
      logger.error('Error in queue health check:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse('Failed to perform health check', StatusCodes.INTERNAL_SERVER_ERROR));
    }
  }
}

export default new QueueController(); 