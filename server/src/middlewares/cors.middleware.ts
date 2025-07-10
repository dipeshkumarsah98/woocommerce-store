import cors from "cors";
import logger from "../services/logger.service";

// Define allowed origins based on environment
const getAllowedOrigins = (): string[] => {
  const origins = [
    "http://localhost:5173", 
    "http://localhost:3001",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3001",
  ];

  if (process.env.NODE_ENV === "production") {
    const productionOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];
    origins.push(...productionOrigins);
  }

  return origins;
};

const allowedOrigins = getAllowedOrigins();

const corsHandler = cors({
  origin: (origin, callback) => {
    if (!origin) {
      logger.debug("CORS: Allowing request with no origin");
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      logger.debug(`CORS: Allowing origin: ${origin}`);
      return callback(null, true);
    }

    logger.warn(`CORS: Blocked origin: ${origin}`);
    logger.debug(`CORS: Allowed origins: ${allowedOrigins.join(", ")}`);
    
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "Cache-Control",
    "Pragma",
  ],
  exposedHeaders: [
    "Content-Length",
    "Content-Type",
    "X-Total-Count",
  ],
});

export default corsHandler;