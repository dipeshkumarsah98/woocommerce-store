require('dotenv').config()
import "express-async-errors";

import { createApp } from "./createApp";
import notFoundHandler from "./middlewares/notFoundHandler.middleware";
import errorHandler from "./middlewares/errorHandler.middleware";
import httpLogger from "./services/logger.service";
import { connectDB, getConnectionStatus } from "./config/db.config";
import cronService from "./services/cron.service";
import queueService from "./services/queue.service";
import workerService from "./services/worker.service";

const app = createApp();

const PORT = process.env.PORT || 3000;

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    
    if (!getConnectionStatus()) {
      throw new Error('Database connection failed');
    }

    cronService.startCronJobs();

    app.listen(PORT, () => {
      httpLogger.info(`Server started successfully in http://localhost:${PORT}`);
      httpLogger.info('Database connection: ✅ Connected');
      httpLogger.info('Queue system: ✅ Initialized');
      httpLogger.info(`CORS enabled for origins: ${process.env.NODE_ENV === 'production' ? 'Production origins' : 'Development origins'}`);
    });

  } catch (error: any) {
    httpLogger.error('Failed to start server:', { error: error.message });
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = async () => {
  httpLogger.info('Received shutdown signal. Gracefully shutting down...');
  
  try {
    // Close queue services
    await queueService.closeQueues();
    await workerService.closeWorkers();
    
    httpLogger.info('Queue services closed successfully');
    process.exit(0);
  } catch (error) {
    httpLogger.error('Error during shutdown:', error);
    process.exit(1);
  }
};

// Handle shutdown signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

startServer();
