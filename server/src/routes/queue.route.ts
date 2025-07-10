import { Router } from 'express';
import queueController from '../controllers/queue.controller';

const router = Router();

// Queue statistics routes
router.get('/stats', queueController.getAllQueuesStats);
router.get('/stats/:queueName', queueController.getQueueStats);

// Queue management routes
router.post('/pause/:queueName', queueController.pauseQueue);
router.post('/resume/:queueName', queueController.resumeQueue);

// Worker management routes
router.post('/workers/pause/:queueName', queueController.pauseWorker);
router.post('/workers/resume/:queueName', queueController.resumeWorker);

// Job management routes
router.post('/jobs/orders', queueController.addOrderJob);

// Health check route
router.get('/health', queueController.healthCheck);

export default router; 