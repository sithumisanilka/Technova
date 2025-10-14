# SOLEKTA Order Processing & Payment Module

## Overview

This module handles order processing, shopping cart management, and payment processing for the SOLEKTA Laptop Shop Management System.

## Features

- Shopping Cart Management (Add, Update, Remove items)
- Order Creation from Cart
- Order Status Tracking
- Payment Processing (Simulated)
- Order History
- Admin Order Management
- Payment Refunds

## Technology Stack

- Java 17
- Spring Boot 3.2.0
- Spring Data JPA
- MySQL 8.0
- Maven 3.9+
- JUnit 5
- Mockito
- Swagger/OpenAPI 3

## API Endpoints

### Cart Management

- `GET /api/cart/{customerId}` - Get customer's cart
- `POST /api/cart/{customerId}/items` - Add item to cart
- `PUT /api/cart/{customerId}/items/{productId}` - Update cart item
- `DELETE /api/cart/{customerId}/items/{productId}` - Remove item from cart
- `DELETE /api/cart/{customerId}` - Clear cart

### Order Management

- `POST /api/orders/checkout` - Create order from cart
- `GET /api/orders/{orderId}` - Get order by ID
- `GET /api/orders/number/{orderNumber}` - Get order by number
- `GET /api/orders/customer/{customerId}` - Get customer orders
- `PUT /api/orders/{orderId}/status` - Update order status
- `GET /api/orders` - Get all orders (Admin)
- `GET /api/orders/status/{status}` - Get orders by status
- `GET /api/orders/date-range` - Get orders by date range

### Payment Management

- `POST /api/payments/process` - Process payment
- `GET /api/payments/{paymentId}` - Get payment by ID
- `GET /api/payments/order/{orderId}` - Get payment by order
- `POST /api/payments/{paymentId}/refund` - Refund payment

## Database Schema

### Orders Table

- Stores order information including shipping details and totals
- Links to customer and contains order items

### Order Items Table

- Stores individual items within an order
- Links to products and contains pricing info

### Payment Transactions Table

- Stores payment information for each order
- Tracks payment status and transaction details

### Cart Tables

- Temporary storage for customer shopping carts
- Links to products with quantities

## Error Handling

The API uses consistent error response format:

```json
{
  "status": 400,
  "message": "Error description",
  "timestamp": "2024-01-01T10:00:00"
}
```

## Integration Points

This module needs to integrate with:

- Product Service (Member 1) - for product details
- User Service (Member 3) - for customer validation
- Notification Service - for order confirmations

## Development Guidelines

1. Follow RESTful API conventions
2. Use proper HTTP status codes
3. Implement comprehensive error handling
4. Write unit and integration tests
5. Document all API endpoints
6. Use proper transaction management

## Testing

```bash
mvn test                    # Run unit tests
mvn test -Dtest=*Integration # Run integration tests
mvn jacoco:report          # Generate test coverage report
```

## Security Considerations

- Input validation on all endpoints
- SQL injection prevention via JPA
- Proper error handling without sensitive data exposure
- Rate limiting for payment endpoints (recommended)

## Future Enhancements

- Real payment gateway integration
- Order tracking with external shipping APIs
- Inventory management integration
- Advanced reporting and analytics
- Mobile app API support

## Module Structure

```
src/main/java/com/solekta/solekta/
├── model/           # Entity classes
├── dto/            # Data Transfer Objects
├── repositories/   # Data access layer
├── service/        # Business logic
├── controller/     # REST endpoints
├── exception/      # Error handling
└── util/          # Utility classes

src/test/java/com/solekta/solekta/
├── service/        # Unit tests for services
└── controller/     # Integration tests
```

## Key Classes

### Entity Classes

- `Order` - Main order entity with shipping details
- `OrderItem` - Individual items in an order
- `PaymentTransaction` - Payment information
- `ShoppingCart` - Customer's shopping cart
- `CartItem` - Items in shopping cart

### Service Classes

- `CartService` - Shopping cart management
- `OrderService` - Order processing and management
- `PaymentService` - Payment processing and refunds

### Controller Classes

- `CartController` - Cart management endpoints
- `OrderController` - Order management endpoints
- `PaymentController` - Payment processing endpoints

### DTO Classes

- `OrderDTO` - Order data transfer object
- `OrderItemDTO` - Order item data transfer object
- `PaymentDTO` - Payment data transfer object
- `CartDTO` - Cart data transfer object
- `CartItemDTO` - Cart item data transfer object
- `CheckoutRequest` - Checkout request data
- `PaymentRequest` - Payment request data

## Usage Examples

### Adding Item to Cart

```bash
curl -X POST "http://localhost:8080/api/cart/1/items?productId=1&quantity=2&unitPrice=50000"
```

### Creating Order from Cart

```bash
curl -X POST "http://localhost:8080/api/orders/checkout" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 1,
    "shippingName": "John Doe",
    "shippingAddress": "123 Main St",
    "shippingCity": "Avissawella",
    "shippingPostalCode": "10700",
    "shippingPhone": "+94771234567",
    "paymentMethod": "CASH_ON_DELIVERY",
    "notes": "Please deliver in the morning"
  }'
```

### Processing Payment

```bash
curl -X POST "http://localhost:8080/api/payments/process" \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": 1,
    "paymentMethod": "CREDIT_CARD",
    "cardNumber": "1234567890123456",
    "cardHolderName": "John Doe",
    "expiryDate": "12/25",
    "cvv": "123"
  }'
```

## Configuration

The module uses standard Spring Boot configuration. Key properties:

- Database connection settings
- JPA/Hibernate configuration
- Logging levels
- Server port and context path

## Monitoring

- Health checks available at `/actuator/health`
- Metrics available at `/actuator/metrics`
- Application info at `/actuator/info`

## Contributing

1. Follow the existing code style
2. Write comprehensive tests
3. Update documentation
4. Ensure all tests pass
5. Follow RESTful API conventions

