# WooCommerce Store API

A Node.js/Express.js backend API that synchronizes products and orders from a WooCommerce store into a local MongoDB database. This application provides RESTful endpoints for managing orders and products with advanced search, filtering, and sorting capabilities.

## 🎯 Project Overview

This is a MERN stack application backend designed as an interview assessment task. It demonstrates:

- **WooCommerce API Integration**: Fetches orders and products from a remote WooCommerce store
- **Automated Synchronization**: Daily cron jobs to sync new orders and cleanup old data
- **RESTful API**: Provides endpoints for frontend consumption with search, filter, and sort capabilities
- **Data Management**: Intelligent cleanup of old orders and orphaned products
- **Error Handling**: Comprehensive logging and error management
- **TypeScript**: Full TypeScript implementation for type safety

## 🚀 Features

### Core Functionality
- ✅ **Order Synchronization**: Fetches orders from the last 30 days
- ✅ **Product Management**: Automatically syncs products from order line items
- ✅ **Automated Cleanup**: Removes orders older than 3 months and orphaned products
- ✅ **Search & Filter**: Advanced search and filtering capabilities
- ✅ **Cron Jobs**: Daily sync at 12 PM UTC and weekly cleanup on Sundays
- ✅ **Error Handling**: Comprehensive logging and error management
- ✅ **TypeScript**: Full type safety implementation

### API Endpoints
- **Orders Management**: CRUD operations with search, filter, and sort
- **Products Catalog**: Product listing with search and sort capabilities
- **Sync Operations**: Manual trigger endpoints for sync and cleanup
- **Health Monitoring**: Cleanup statistics and preview endpoints

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Language**: TypeScript
- **HTTP Client**: Axios
- **Cron Jobs**: node-cron
- **Logging**: Winston
- **Testing**: Jest + Supertest
- **Development**: Nodemon

## 📋 Prerequisites

Before running this application, ensure you have:

- **Node.js** (version 18 or above)
- **MongoDB** (local installation or MongoDB Atlas)
- **pnpm** (package manager)
- **WooCommerce Store** with REST API enabled

## 🚀 Setup and Installation

### 1. Clone the Repository
```bash
git clone https://github.com/dipeshkumarsah98/woocommerce-store.git
cd server
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Environment Configuration
Create a `.env` file in the server root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/woocommerce-store

# WooCommerce API Configuration
BASE_URL=https://interview-test.matat.io/
C_USERNAME=ck_40d0806b16feb3bd67a4d8dbbff163c6dfcf061d
C_PASSWORD=cs_9544e30809595750f8f1c6f3f9a6efcc38bfd06d
```

### 4. Database Setup
Ensure MongoDB is running on your system:
```bash
# For local MongoDB
mongod

# Or use MongoDB Atlas connection string in MONGODB_URI
```

### 5. Start the Application

#### Development Mode
```bash
pnpm start:dev
```

#### Production Mode
```bash
pnpm build
pnpm start
```

### 6. Verify Installation
The server should start on `http://localhost:3000` with the following log messages:
```
Server started successfully in http://localhost:3000
Database connection: ✅ Connected
Starting cron jobs...
Daily order sync job scheduled for 12:00 PM UTC
Weekly cleanup job scheduled for 2:00 AM UTC every Sunday
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication
The API uses HTTP Basic Authentication for WooCommerce API calls (configured via environment variables).

---

### 📦 Orders Endpoints

#### `GET /api/orders`
Retrieve orders with optional filtering and sorting.

**Query Parameters:**
- `search` (string, optional): Search in order number, customer info, or product names
- `status` (string, optional): Filter by order status (`completed`, `processing`, `pending`, `cancelled`, `refunded`)
- `sortBy` (string, optional): Sort field (`total`, `date_created`, `number`)
- `sortOrder` (string, optional): Sort direction (`asc`, `desc`)

**Example:**
```bash
GET /api/orders?search=john&status=completed&sortBy=total&sortOrder=desc
```

**Response:**
```json
[
  {
    "_id": "64f7c8a9b123456789abcdef",
    "id": "123",
    "number": "123",
    "order_key": "wc_order_abc123",
    "status": "completed",
    "date_created": "2024-01-15T10:30:00.000Z",
    "total": 299.99,
    "customer_id": "456",
    "customer_note": "Please deliver after 6 PM",
    "billing": {
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890"
    },
    "shipping": {
      "first_name": "John",
      "last_name": "Doe",
      "address_1": "123 Main St"
    },
    "line_items": [
      {
        "_id": "64f7c8a9b123456789abcdef",
        "name": "Product Name"
      }
    ]
  }
]
```

#### `GET /api/orders/:orderKey`
Retrieve a specific order by order key.

**Parameters:**
- `orderKey` (string): The unique order key

**Example:**
```bash
GET /api/orders/wc_order_abc123
```

#### `GET /api/orders/:orderKey/products`
Retrieve products associated with a specific order.

**Parameters:**
- `orderKey` (string): The unique order key

---

### 🛍️ Products Endpoints

#### `GET /api/products`
Retrieve products with optional filtering and sorting.

**Query Parameters:**
- `search` (string, optional): Search in product name or SKU
- `sortBy` (string, optional): Sort field (`name`, `price`)
- `sortOrder` (string, optional): Sort direction (`asc`, `desc`)

**Example:**
```bash
GET /api/products?search=laptop&sortBy=price&sortOrder=asc
```

**Response:**
```json
[
  {
    "_id": "64f7c8a9b123456789abcdef",
    "id": "789",
    "name": "Gaming Laptop",
    "slug": "gaming-laptop",
    "price": 1299.99,
    "regular_price": 1499.99,
    "sale_price": "1299.99",
    "sku": "LAPTOP-001",
    "stock_status": "instock",
    "stock_quantity": 10,
    "images": [
      {
        "src": "https://example.com/image.jpg",
        "alt": "Gaming Laptop"
      }
    ],
    "categories": [
      {
        "id": 15,
        "name": "Electronics",
        "slug": "electronics"
      }
    ]
  }
]
```

#### `GET /api/products/:slug`
Retrieve a specific product by slug.

**Parameters:**
- `slug` (string): The product slug

---

### 🔄 Sync Endpoints

#### `POST /api/sync/orders`
Manually trigger order synchronization.

**Response:**
```json
{
  "success": true,
  "message": "Order sync completed successfully"
}
```

#### `POST /api/sync/cleanup`
Manually trigger cleanup of old orders and orphaned products.

**Response:**
```json
{
  "success": true,
  "message": "Cleanup completed successfully",
  "data": {
    "deletedOrders": 5,
    "deletedProducts": 2
  }
}
```

#### `GET /api/sync/cleanup/preview`
Preview what would be deleted in cleanup (dry run).

**Response:**
```json
{
  "success": true,
  "message": "Cleanup preview generated successfully",
  "data": {
    "ordersToDelete": [
      {
        "id": "123",
        "number": "123",
        "date_created": "2024-01-15T10:30:00.000Z",
        "line_items_count": 3
      }
    ],
    "productsToCheck": ["64f7c8a9b123456789abcdef"],
    "summary": {
      "ordersCount": 1,
      "productsToCheckCount": 1
    }
  }
}
```

#### `GET /api/sync/cleanup/stats`
Get cleanup statistics.

**Response:**
```json
{
  "success": true,
  "message": "Cleanup statistics retrieved successfully",
  "data": {
    "totalOrders": 150,
    "oldOrders": 5,
    "totalProducts": 45,
    "cutoffDate": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 🚨 Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

## 🔧 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port number | `3000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/woocommerce-store` |
| `BASE_URL` | WooCommerce store URL | `https://interview-test.matat.io/` |
| `C_USERNAME` | WooCommerce consumer key | `ck_40d0806b16feb3bd67a4d8dbbff163c6dfcf061d` |
| `C_PASSWORD` | WooCommerce consumer secret | `cs_9544e30809595750f8f1c6f3f9a6efcc38bfd06d` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |

### Environment Setup Examples

#### Development
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/woocommerce-store
BASE_URL=https://interview-test.matat.io/
C_USERNAME=ck_40d0806b16feb3bd67a4d8dbbff163c6dfcf061d
C_PASSWORD=cs_9544e30809595750f8f1c6f3f9a6efcc38bfd06d
```

#### Production
```env
PORT=8080
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/woocommerce-store
BASE_URL=https://interview-test.matat.io/
C_USERNAME=ck_40d0806b16feb3bd67a4d8dbbff163c6dfcf061d
C_PASSWORD=cs_9544e30809595750f8f1c6f3f9a6efcc38bfd06d
```

## 🔄 Automated Processes

### Daily Order Sync
- **Schedule**: Every day at 12:00 PM UTC
- **Function**: Fetches orders from the last 30 days
- **Process**: 
  1. Fetches orders from WooCommerce API
  2. Processes line items and syncs products
  3. Stores orders in MongoDB
  4. Logs process results

### Weekly Cleanup
- **Schedule**: Every Sunday at 2:00 AM UTC
- **Function**: Removes old orders and orphaned products
- **Process**:
  1. Identifies orders older than 3 months
  2. Deletes old orders
  3. Finds products no longer referenced by any orders
  4. Deletes orphaned products
  5. Logs cleanup results

### Manual Triggers
Both processes can be triggered manually via API endpoints:
- `POST /api/sync/orders` - Manual order sync
- `POST /api/sync/cleanup` - Manual cleanup

## 🧪 Testing

### Run Tests
```bash
# Run all tests
pnpm test

# Run end-to-end tests
pnpm test:e2e

# Run tests in watch mode
pnpm test --watch
```

### Test Structure
```
src/
├── __tests__/
│   └── handlers/
│       └── users.test.ts
└── e2e/
    └── index.test.ts
```

## 📊 Monitoring and Logging

### Logging
The application uses Winston for comprehensive logging:
- **Console Output**: Colored, timestamped logs
- **Log Levels**: Info, Warning, Error
- **Structured Data**: JSON format for error details

### Log Examples
```
Jan-15-2024 10:30:00 info: Server started successfully in http://localhost:3000
Jan-15-2024 10:30:01 info: Database connection: ✅ Connected
Jan-15-2024 12:00:00 info: Starting daily order sync job...
Jan-15-2024 12:00:05 info: Successfully processed 15 orders
```

### Health Monitoring
- Database connection status
- Cron job execution logs
- API request/response logging
- Error tracking with stack traces

## 🚨 Known Issues and Limitations

### Current Limitations

1. **API Rate Limiting**
   - **Issue**: WooCommerce API has rate limits
   - **Impact**: Large sync operations may fail
   - **Workaround**: Implement retry logic and batch processing

2. **Single Product Fetch Failure**
   - **Issue**: If one product fetch fails, entire order processing stops
   - **Impact**: Some orders may not be synced
   - **Status**: TODO - needs better error handling

3. **Memory Usage**
   - **Issue**: Large order syncs can consume significant memory
   - **Impact**: Potential performance issues with large datasets
   - **Recommendation**: Implement streaming for large datasets

4. **Time Zone Handling**
   - **Issue**: All cron jobs run in UTC
   - **Impact**: May not align with store's local time zone
   - **Workaround**: Configure timezone in cron expressions

5. **Database Indexes**
   - **Issue**: Limited indexing for complex queries
   - **Impact**: Performance may degrade with large datasets
   - **Recommendation**: Add compound indexes for frequently queried fields

### Error Scenarios

1. **WooCommerce API Unavailable**
   - **Handling**: Graceful error logging, retry mechanism needed
   - **Impact**: Sync jobs will fail but won't crash the server

2. **MongoDB Connection Loss**
   - **Handling**: Automatic reconnection attempts
   - **Impact**: Temporary service unavailability

3. **Invalid Product Data**
   - **Handling**: Validation and error logging
   - **Impact**: Specific products may not sync

### Performance Considerations

1. **Large Dataset Handling**
   - Consider pagination for large order lists
   - Implement database indexing for better query performance
   - Use aggregation pipelines for complex queries

2. **Concurrent Requests**
   - Current implementation handles concurrent requests
   - Consider implementing request queuing for heavy operations

3. **Memory Management**
   - Monitor memory usage during large sync operations
   - Consider implementing streaming for large datasets

## 🔮 Future Enhancements

### Planned Features
- [ ] Implement retry logic for failed API calls
- [ ] Add request queuing for heavy operations
- [ ] Implement streaming for large datasets
- [ ] Add more comprehensive error handling
- [ ] Implement database connection pooling
- [ ] Add API rate limiting
- [ ] Implement caching layer
- [ ] Add monitoring dashboard
- [ ] Implement backup and restore functionality

### Performance Optimizations
- [ ] Database query optimization
- [ ] Implement connection pooling
- [ ] Add response caching
- [ ] Optimize memory usage
- [ ] Add compression for API responses
