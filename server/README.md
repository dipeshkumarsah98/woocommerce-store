# WooCommerce Store Backend

Node.js/Express server with Redis and BullMQ queue system for managing WooCommerce store data and background processing.

## 🚀 Features

- **Express.js** REST API server
- **MongoDB** with Mongoose ODM
- **Redis** for caching and session management
- **BullMQ** for background job processing
- **Winston** for comprehensive logging
- **TypeScript** for type safety
- **Queue Management** with health monitoring
- **Background Processing** for orders and products

## ⚙️ Prerequisites

Make sure you have the following installed:

- **Node.js** (version 18 or above)
- **MongoDB** (local or cloud instance)
- **Redis** (local or cloud instance)
- **pnpm** (recommended package manager)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/dipeshkumarsah98/woocommerce-store.git
cd WooCommerce-store
```

### 2. Install Dependencies

```bash
cd server
pnpm install
```

### 3. Environment Setup

Create a `.env` file in the server directory:

```bash
cp .env.example .env
```

Configure the environment variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/woocommerce_store

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# WooCommerce API Configuration
WOOCOMMERCE_CONSUMER_KEY=your_consumer_key
WOOCOMMERCE_CONSUMER_SECRET=your_consumer_secret
WOOCOMMERCE_STORE_URL=https://your-store.com

# CORS Configuration (for production)
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Logging
LOG_LEVEL=info
```

### 4. Database Setup

#### MongoDB Setup

```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or install MongoDB locally
# Follow MongoDB installation guide for your OS
```

#### Redis Setup

```bash
# Using Docker
docker run -d -p 6379:6379 --name redis redis:alpine

# Or install Redis locally
# Follow Redis installation guide for your OS
```

### 5. Start the Server

```bash
# Development mode
pnpm dev

# Production mode
pnpm start
```

The server will be available at `http://localhost:3000`

## 📜 Available Scripts

- `pnpm dev` - Start development server with nodemon
- `pnpm start` - Start production server
- `pnpm build` - Build TypeScript to JavaScript
- `pnpm lint` - Run ESLint for code analysis
- `pnpm test` - Run test suite
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Run tests with coverage report

## 📂 Project Structure

```
server/
├── src/
│   ├── config/           # Configuration files
│   │   ├── db.config.ts  # Database configuration
│   │   └── redis.config.ts # Redis configuration
│   ├── controllers/      # Route controllers
│   │   ├── orders.controller.ts
│   │   ├── products.controller.ts
│   │   └── queue.controller.ts
│   ├── middlewares/      # Express middlewares
│   │   ├── cors.middleware.ts
│   │   ├── errorHandler.middleware.ts
│   │   └── notFoundHandler.middleware.ts
│   ├── models/           # Mongoose models
│   │   ├── order.model.ts
│   │   └── product.model.ts
│   ├── routes/           # API routes
│   │   ├── orders.route.ts
│   │   ├── products.route.ts
│   │   └── queue.route.ts
│   ├── services/         # Business logic services
│   │   ├── order.service.ts
│   │   ├── product.service.ts
│   │   ├── queue.service.ts
│   │   ├── worker.service.ts
│   │   └── logger.service.ts
│   ├── types/            # TypeScript type definitions
│   │   ├── order.type.ts
│   │   └── product.type.ts
│   ├── utils/            # Utility functions
│   │   ├── constants.utils.ts
│   │   ├── axiosInstance.utils.ts
│   │   └── response.utils.ts
│   ├── createApp.ts      # Express app setup
│   └── index.ts          # Server entry point
├── __tests__/            # Test files
├── jest.config.js        # Jest configuration
├── package.json          # Dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

## 🔧 API Endpoints

### Products
```
GET    /api/products              - Get all products
GET    /api/products/:id          - Get product by ID
POST   /api/products              - Create new product
PUT    /api/products/:id          - Update product
DELETE /api/products/:id          - Delete product
```

### Orders
```
GET    /api/orders                - Get all orders
GET    /api/orders/:id            - Get order by ID
POST   /api/orders                - Create new order
PUT    /api/orders/:id            - Update order
DELETE /api/orders/:id            - Delete order
```

### Queue Management
```
GET    /api/queues/health         - Queue system health check
GET    /api/queues/stats          - All queue statistics
GET    /api/queues/stats/:queue   - Specific queue statistics
POST   /api/queues/pause/:queue   - Pause a queue
POST   /api/queues/resume/:queue  - Resume a queue
POST   /api/queues/jobs/orders    - Add order job
```

## 🗄️ Database Models

### Order Model
```typescript
interface Order {
  id: string;
  number: string;
  order_key: string;
  status: string;
  date_created: Date;
  total: number;
  customer_id: string;
  customer_note: string;
  billing: BillingInfo;
  shipping: ShippingInfo;
  line_items: Product[];
}
```

### Product Model
```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  categories: string[];
  images: string[];
  status: string;
}
```

## 🔄 Queue System

### Queue Configuration

The application uses Redis and BullMQ for background job processing:

```typescript
// Redis Configuration
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  lazyConnect: true,
};
```

### Available Queues
- **Orders Queue**: Handles order processing and synchronization
- **Products Queue**: Manages product processing jobs

### Job Types
- `sync_orders`: Synchronize orders from WooCommerce
- `process_order`: Process new orders
- `process_product`: Process product data
- `send_order_email`: Send email notifications
- `update_order_status`: Update order status
- `cleanup_old_orders`: Clean up old order data

## 🧪 Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

### Test Structure

```
__tests__/
├── handlers/           # API handler tests
│   └── users.test.ts
└── e2e/               # End-to-end tests
    └── index.test.ts
```

## 📦 Building for Production

### Build Process

```bash
pnpm build
```

### Production Deployment

1. **Environment Variables**: Set production environment variables
2. **Database**: Configure production MongoDB instance
3. **Redis**: Configure production Redis instance
4. **Process Manager**: Use PM2 or similar for process management

```bash
# Using PM2
npm install -g pm2
pm2 start dist/index.js --name "woocommerce-server"
```

## 🔧 Configuration

### CORS Configuration

The server includes a robust CORS setup that supports:

- **Development**: Automatically allows localhost origins (5173, 3001)
- **Production**: Configurable via `ALLOWED_ORIGINS` environment variable
- **Credentials**: Supports cookies and authorization headers
- **Preflight Caching**: Caches preflight requests for 24 hours
- **Comprehensive Headers**: Supports all necessary HTTP headers

```typescript
// CORS is automatically configured based on environment
// Development: localhost origins
// Production: ALLOWED_ORIGINS environment variable
```

### Database Configuration

```typescript
// src/config/db.config.ts
export const dbConfig = {
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/woocommerce_store',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
};
```

### Redis Configuration

```typescript
// src/config/redis.config.ts
export const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  lazyConnect: true,
};
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   ```bash
   # Check if MongoDB is running
   docker ps | grep mongodb
   # Or check local MongoDB service
   sudo systemctl status mongod
   ```

2. **Redis Connection Failed**
   ```bash
   # Check if Redis is running
   docker ps | grep redis
   # Or check local Redis service
   sudo systemctl status redis
   ```

3. **Port Already in Use**
   ```bash
   # Change port in .env file
   PORT=3001
   ```