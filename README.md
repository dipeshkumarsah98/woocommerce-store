# WooCommerce Store Application

A full-stack MERN (MongoDB, Express.js, React, Node.js) application for managing WooCommerce store data with real-time processing capabilities.

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **React 18** with TypeScript for type safety
- **Vite** for fast development and building
- **Tailwind CSS** for modern, responsive UI
- **shadcn/ui** components for consistent design
- **Axios** for API communication

### Backend (Node.js + Express)
- **Express.js** REST API server
- **MongoDB** with Mongoose ODM
- **Redis** for caching and session management
- **BullMQ** for background job processing
- **Winston** for comprehensive logging

## 🚀 Features

### Product Management
- **Product Catalog**: Browse and search products with real-time filtering
- **Product Details**: Detailed product information with related orders
- **Inventory Tracking**: Real-time stock management
- **Product Synchronization**: Auto-sync with WooCommerce API

### Order Management
- **Order Processing**: Automated order processing pipeline
- **Order Status Tracking**: Real-time status updates
- **Order History**: Complete order history with details
- **Customer Information**: Billing and shipping details
- **Order Synchronization**: Background sync with WooCommerce

### Queue System & Background Processing
- **Redis-based Queue**: Reliable job processing with BullMQ
- **Order Processing Flow**: Multi-step order processing pipeline
- **Product Processing**: Background product data processing
- **Email Notifications**: Automated email notifications
- **Status Updates**: Real-time order status updates
- **Cleanup Operations**: Automated data cleanup

### Real-time Features
- **Live Updates**: Real-time order and product updates
- **Background Sync**: Continuous WooCommerce synchronization
- **Job Monitoring**: Queue health and statistics monitoring
- **Error Handling**: Comprehensive error handling and retry logic

## 🔄 Business Logic

### Order Processing Pipeline
1. **Order Sync**: Fetch orders from WooCommerce API
2. **Order Validation**: Validate order data and customer information
3. **Product Processing**: Process each line item product
4. **Order Creation**: Create order with processed products
5. **Status Updates**: Update order status in real-time
6. **Email Notifications**: Send customer notifications
7. **Cleanup**: Regular cleanup of old data

### Product Management Flow
1. **Product Sync**: Fetch products from WooCommerce
2. **Data Processing**: Process and validate product data
3. **Inventory Updates**: Update stock levels
4. **Price Management**: Handle pricing and discounts
5. **Category Management**: Organize products by categories

### Queue System Architecture
- **Orders Queue**: Handles all order-related background jobs
- **Products Queue**: Manages product processing jobs
- **Flow Jobs**: Complex multi-step job workflows
- **Priority System**: High, Medium, Low priority job handling
- **Retry Logic**: Exponential backoff for failed jobs
- **Dead Letter Queue**: Failed job management

## 📊 Data Models

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

## 🔧 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order

### Queue Management
- `GET /api/queues/health` - Queue system health check
- `GET /api/queues/stats` - Queue statistics
- `POST /api/queues/jobs/orders` - Add order job
- `POST /api/queues/pause/:queueName` - Pause queue
- `POST /api/queues/resume/:queueName` - Resume queue

## 🎯 Key Features

### Frontend Features
- **Responsive Design**: Mobile-first responsive UI
- **Real-time Search**: Instant product and order search
- **Loading States**: Skeleton loading components
- **Error Handling**: Comprehensive error boundaries
- **Theme Support**: Dark/light mode toggle
- **Navigation**: Intuitive navigation with breadcrumbs

### Backend Features
- **RESTful API**: Clean, consistent API design
- **Middleware**: CORS, error handling, validation
- **Authentication**: JWT-based authentication (planned)
- **Rate Limiting**: API rate limiting (planned)
- **Caching**: Redis-based caching
- **Logging**: Structured logging with Winston

### Queue Features
- **Job Types**: Sync, Process, Email, Status, Cleanup
- **Priorities**: High (1), Medium (2), Low (3)
- **Retry Logic**: Exponential backoff
- **Monitoring**: Real-time queue statistics
- **Flow Jobs**: Complex multi-step workflows
- **Error Recovery**: Dead letter queue management

## 🛠️ Technology Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Axios
- React Router

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- Redis
- BullMQ
- Winston

### DevOps
- Docker (planned)
- CI/CD (planned)
- Monitoring (planned)

## 📈 Performance & Scalability

### Frontend Optimization
- **Code Splitting**: Lazy loading of components
- **Memoization**: React.memo for performance
- **Bundle Optimization**: Vite build optimization
- **Caching**: Browser caching strategies

### Backend Optimization
- **Database Indexing**: Optimized MongoDB queries
- **Connection Pooling**: Database connection management
- **Caching**: Redis-based caching layer
- **Queue Processing**: Background job processing
- **Load Balancing**: Horizontal scaling support

### Queue Optimization
- **Job Batching**: Efficient job processing
- **Memory Management**: Optimized memory usage
- **Concurrency Control**: Controlled job concurrency
- **Monitoring**: Real-time performance monitoring

## 🔒 Security Considerations

### Frontend Security
- **Input Validation**: Client-side validation
- **XSS Prevention**: Content Security Policy
- **CSRF Protection**: Cross-site request forgery protection

### Backend Security
- **Input Sanitization**: Server-side validation
- **SQL Injection**: MongoDB injection prevention
- **Rate Limiting**: API rate limiting
- **Authentication**: JWT token management
- **Authorization**: Role-based access control
