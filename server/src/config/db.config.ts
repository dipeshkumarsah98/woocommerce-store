import mongoose from 'mongoose';
import httpLogger from '../services/logger.service';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/woocommerce-store';

const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

let isConnected = false;

mongoose.connection.on('connected', () => {
  isConnected = true;
  httpLogger.info('MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
  isConnected = false;
  httpLogger.error('MongoDB connection error:', { error: err.message });
});

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  httpLogger.warn('MongoDB disconnected');
});

process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    httpLogger.info('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    httpLogger.error('Error during MongoDB connection closure:', { error: err });
    process.exit(1);
  }
});

export const connectDB = async (): Promise<void> => {
  try {
    if (isConnected) {
      httpLogger.info('MongoDB already connected');
      return;
    }

    httpLogger.info('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, connectionOptions);
  } catch (error: any) {
    httpLogger.error('Failed to connect to MongoDB:', { error: error.message });
    throw error;
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    if (!isConnected) {
      httpLogger.info('MongoDB already disconnected');
      return;
    }

    httpLogger.info('Disconnecting from MongoDB...');
    await mongoose.connection.close();
  } catch (error: any) {
    httpLogger.error('Failed to disconnect from MongoDB:', { error: error.message });
    throw error;
  }
};

export const getConnectionStatus = (): boolean => {
  return isConnected;
};

export const getConnectionInfo = () => {
  return {
    isConnected,
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host,
    port: mongoose.connection.port,
    name: mongoose.connection.name,
  };
};

export default mongoose;
