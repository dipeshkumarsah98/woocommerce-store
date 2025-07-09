require('dotenv').config()
import "express-async-errors";

import { createApp } from "./createApp";
import bodyParser from "body-parser";
import notFoundHandler from "./middlewares/notFoundHandler.middleware";
import errorHandler from "./middlewares/errorHandler.middleware";
import corsHandler from "./middlewares/cors.middleware";
import httpLogger from "./services/logger.service";
import { connectDB, getConnectionStatus } from "./config/db.config";
import cronService from "./services/cron.service";

const app = createApp();

app.use(corsHandler);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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
    });

  } catch (error: any) {
    httpLogger.error('Failed to start server:', { error: error.message });
    process.exit(1);
  }
};

startServer();
