# WooCommerce Store Server

A Node.js/Express server for managing WooCommerce store data with Redis and BullMQ queue system.

## Features

- **Product Management**: CRUD operations for products
- **Order Management**: Order processing and synchronization
- **Queue System**: Redis-based job queue with BullMQ
- **Real-time Processing**: Background job processing for orders
- **API Endpoints**: RESTful API for all operations

## Queue System

### Overview

The application uses Redis and BullMQ for background job processing. The queue system handles:

- Order synchronization from WooCommerce
- Order processing and validation
- Email notifications
- Order status updates
- Cleanup operations

### Queue Configuration

#### Redis Configuration
```typescript
// server/src/config/redis.config.ts
const redisConfig: ConnectionOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  // ... other options
};
```

#### Environment Variables
```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_password
REDIS_DB=0
```

### Queue Structure

#### Available Queues
- **Orders Queue**: `orders` - Handles all order-related background jobs

#### Job Types
- `sync_orders`: Synchronize orders from WooCommerce
- `process_order`: Process new orders
- `send_order_email`: Send email notifications
- `update_order_status`: Update order status
- `cleanup_old_orders`: Clean up old order data

#### Job Priorities
- `HIGH`: 1 - Critical jobs (status updates, sync)
- `MEDIUM`: 2 - Standard jobs (order processing)
- `LOW`: 3 - Non-critical jobs (emails, cleanup)

### API Endpoints

#### Queue Management
```
GET    /api/queues/health              - Queue system health check
GET    /api/queues/stats               - All queue statistics
GET    /api/queues/stats/:queueName    - Specific queue statistics
POST   /api/queues/pause/:queueName    - Pause a queue
POST   /api/queues/resume/:queueName   - Resume a queue
```

#### Worker Management
```
POST   /api/queues/workers/pause/:queueName    - Pause a worker
POST   /api/queues/workers/resume/:queueName   - Resume a worker
```

#### Job Management
```
POST   /api/queues/jobs/orders         - Add order job
```

### Usage Examples

#### Adding Jobs Programmatically
```typescript
import queueService from './services/queue.service';

// Add order sync job
await queueService.addOrderSyncJob({
  source: 'woocommerce',
  ordersCount: 50,
  timestamp: new Date().toISOString(),
});

// Add order processing job
await queueService.addProcessOrderJob({
  orderId: 'order_123',
  orderKey: 'wc_order_123',
  status: 'processing',
  total: 99.99,
});

// Add email notification job
await queueService.addOrderEmailJob({
  orderId: 'order_123',
  customerEmail: 'customer@example.com',
  customerName: 'John Doe',
  orderTotal: 99.99,
  status: 'processing',
});
```

#### Adding Jobs via API
```bash
# Add order sync job
curl -X POST http://localhost:3000/api/queues/jobs/orders \
  -H "Content-Type: application/json" \
  -d '{
    "jobType": "sync_orders",
    "data": {
      "source": "woocommerce",
      "ordersCount": 50
    },
    "options": {
      "priority": 1,
      "delay": 0
    }
  }'

# Check queue statistics
curl http://localhost:3000/api/queues/stats

# Health check
curl http://localhost:3000/api/queues/health
```

### Worker Implementation

Workers are automatically initialized and handle job processing:

```typescript
// Job processing example
private async handleProcessOrder(data: JobData): Promise<any> {
  logger.info('Processing order:', data);
  
  // Your order processing logic here
  // - Validate order data
  // - Update inventory
  // - Calculate totals
  // - etc.
  
  return { success: true, message: 'Order processed successfully' };
}
```

### Monitoring

#### Queue Statistics
- **waiting**: Jobs waiting to be processed
- **active**: Jobs currently being processed
- **completed**: Successfully completed jobs
- **failed**: Failed jobs
- **delayed**: Jobs scheduled for later

#### Health Check Response
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "queues": {
    "orders": {
      "exists": true,
      "isPaused": false
    }
  },
  "workers": {
    "orders": {
      "exists": true,
      "isRunning": true
    }
  }
}
```

### Error Handling

- **Automatic Retry**: Failed jobs are retried with exponential backoff
- **Dead Letter Queue**: Failed jobs are moved to failed queue after max attempts
- **Logging**: All queue operations are logged with Winston
- **Graceful Shutdown**: Queues and workers are properly closed on app shutdown

### Best Practices

1. **Job Idempotency**: Ensure jobs can be safely retried
2. **Data Validation**: Validate job data before processing
3. **Error Handling**: Implement proper error handling in job processors
4. **Monitoring**: Monitor queue statistics and failed jobs
5. **Cleanup**: Regularly clean up completed and failed jobs

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up Redis:
```bash
# Using Docker
docker run -d -p 6379:6379 redis:alpine

# Or install locally
# Follow Redis installation guide for your OS
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the server:
```bash
npm run start:dev
```

## Dependencies

- **bullmq**: Redis-based queue system
- **redis**: Redis client for Node.js
- **express**: Web framework
- **mongoose**: MongoDB ODM
- **winston**: Logging library
- **node-cron**: Cron job scheduler
