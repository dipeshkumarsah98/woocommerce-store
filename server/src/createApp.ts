import express from "express";
import ordersRouter from "./routes/orders.route";
import productsRouter from "./routes/product.route";
import syncRouter from "./routes/sync.route";
import queueRouter from "./routes/queue.route";

// Initialize queue services
import "./services/queue.service";
import "./services/worker.service";

export function createApp() {
  const app = express();

  app.use("/api/products", productsRouter);
  app.use("/api/orders", ordersRouter);
  app.use("/api/sync", syncRouter);
  app.use("/api/queues", queueRouter);

  return app;
}