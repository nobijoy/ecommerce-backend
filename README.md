# E-commerce Backend API

A professional e-commerce backend built with NestJS, TypeORM, and PostgreSQL. This project demonstrates core e-commerce functionality with a clean, modular architecture designed for learning Redis, Kafka, and Elasticsearch integration.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with password hashing
- **User Management**: User registration, login, and profile management
- **Product Catalog**: Products with categories, pagination, and filtering
- **Shopping Cart**: Add, update, and remove items from cart
- **Order Management**: Create orders from cart with stock management
- **Payment Processing**: Mock payment implementation
- **API Documentation**: Auto-generated Swagger documentation
- **Database Seeding**: Pre-populated test data for quick testing

## 🛠️ Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT (Passport)
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **Containerization**: Docker & Docker Compose

## 📋 Prerequisites

- Node.js (v18 or higher)
- Docker & Docker Compose
- npm or yarn

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerce-backend
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your configuration if needed.

4. **Start Docker services**
   ```bash
   docker-compose up -d
   ```
   This will start PostgreSQL, Redis, Kafka, Zookeeper, and Elasticsearch.

5. **Run database seeders**
   ```bash
   yarn seed
   ```
   This will populate the database with test data.

6. **Start the application**
   ```bash
   yarn start:dev
   ```

## 🌐 API Documentation

Once the application is running, access the Swagger documentation at:
```
http://localhost:3000/api
```

## 🔑 Test Credentials

After running the seeders, you can use these credentials:

- **Email**: `admin@example.com`
- **Password**: `Admin123!`

Other test users:
- `john.doe@example.com` / `Password123!`
- `jane.smith@example.com` / `Password123!`

## 📚 API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user

### Users
- `GET /users/profile` - Get current user profile
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Categories
- `GET /categories` - Get all categories
- `GET /categories/:id` - Get category by ID
- `POST /categories` - Create category (protected)
- `PATCH /categories/:id` - Update category (protected)
- `DELETE /categories/:id` - Delete category (protected)

### Products
- `GET /products` - Get all products (with pagination)
- `GET /products/:id` - Get product by ID
- `POST /products` - Create product (protected)
- `PATCH /products/:id` - Update product (protected)
- `DELETE /products/:id` - Delete product (protected)

### Cart
- `GET /cart` - Get current user cart
- `POST /cart/items` - Add item to cart
- `PATCH /cart/items/:itemId` - Update cart item quantity
- `DELETE /cart/items/:itemId` - Remove item from cart
- `DELETE /cart` - Clear cart

### Orders
- `GET /orders` - Get all user orders
- `GET /orders/:id` - Get order by ID
- `POST /orders` - Create order from cart
- `PATCH /orders/:id/status` - Update order status
- `POST /orders/:id/cancel` - Cancel order

### Payments
- `POST /payments` - Process payment for order
- `GET /payments/:id` - Get payment by ID
- `GET /payments/order/:orderId` - Get payment by order ID

## 🗄️ Database Schema

The application uses the following main entities:

- **User**: User accounts with authentication
- **Category**: Product categories
- **Product**: Products with pricing and stock
- **Cart & CartItem**: Shopping cart functionality
- **Order & OrderItem**: Order management
- **Payment**: Payment records

## 🧪 Testing

```bash
# Unit tests
yarn test

# E2E tests
yarn test:e2e

# Test coverage
yarn test:cov
```

## 🐳 Docker Services

The `docker-compose.yml` includes:

- **PostgreSQL**: Main database (port 5432)
- **Redis**: Caching and session storage (port 6379)
- **Kafka**: Event streaming (port 9092)
- **Zookeeper**: Kafka coordination (port 2181)
- **Elasticsearch**: Search and analytics (port 9200)

## 🔮 Future Enhancements

This project is designed as a foundation for learning:

- **Redis Integration**: Implement caching for products, session management, and cart storage
- **Kafka Integration**: Add event-driven architecture for order processing and notifications
- **Elasticsearch Integration**: Implement advanced product search with filters and faceting

## 📝 Scripts

```bash
yarn start          # Start the application
yarn start:dev      # Start in development mode with watch
yarn start:prod     # Start in production mode
yarn build          # Build the application
yarn seed           # Run database seeders
yarn lint           # Lint the code
yarn format         # Format the code
```

## 📄 License

This project is licensed under the UNLICENSED license.

## 👤 Author

Md. Nobi Hossen  
jbc.nobijoy@gmail.com

---

Built with ❤️ using NestJS
