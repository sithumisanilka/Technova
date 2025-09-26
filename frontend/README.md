# SOLEKTA Frontend - Order Processing System

This is the frontend application for the SOLEKTA Laptop Shop Management System, specifically focused on the Order Processing functionality.

## Features

### Customer Features
- **Product Browsing**: Browse and search laptop products
- **Shopping Cart**: Add/remove items, update quantities
- **Checkout Process**: Complete order with shipping and payment information
- **Order History**: View past orders and their status
- **Order Details**: Detailed view of individual orders
- **User Authentication**: Login/Register functionality

### Admin Features
- **Order Management**: View and manage all customer orders
- **Status Updates**: Update order status (Pending, Confirmed, Processing, Shipped, Delivered, etc.)
- **Order Filtering**: Filter orders by status, search by order number/customer
- **Order Statistics**: Dashboard with order metrics and revenue

## Technology Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Radix UI** components with shadcn/ui
- **React Router** for navigation
- **React Hook Form** with Zod validation
- **Axios** for API calls
- **Zustand** for state management
- **React Query** for server state management

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Card, etc.)
│   ├── layout/         # Layout components (Header, Footer, Layout)
│   └── common/         # Common components (ProtectedRoute)
├── context/            # React contexts
│   ├── AuthContext.tsx # User authentication state
│   └── CartContext.tsx # Shopping cart state
├── pages/              # Page components
│   ├── Home.tsx        # Landing page
│   ├── Products.tsx    # Product listing
│   ├── Cart.tsx        # Shopping cart
│   ├── Checkout.tsx    # Checkout process
│   ├── OrderHistory.tsx # Customer order history
│   ├── OrderDetails.tsx # Order details view
│   ├── AdminOrders.tsx # Admin order management
│   ├── Login.tsx       # User login
│   └── Register.tsx    # User registration
├── services/           # API services
│   └── api.ts          # API client and endpoints
├── types/              # TypeScript type definitions
│   └── order.ts        # Order-related types
├── hooks/              # Custom React hooks
└── lib/                # Utility functions
```

## Backend Integration

The frontend is designed to work with the Spring Boot backend API. Key endpoints used:

- `POST /api/orders/checkout` - Create order from cart
- `GET /api/orders/{id}` - Get order by ID
- `GET /api/orders/customer/{customerId}` - Get customer orders
- `PUT /api/orders/{id}/status` - Update order status
- `GET /api/orders` - Get all orders (admin)
- `GET /api/cart/customer/{customerId}` - Get customer cart
- `POST /api/cart/customer/{customerId}/items` - Add item to cart

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## Environment Setup

Make sure your backend is running on `http://localhost:8080` or update the API_BASE_URL in `src/services/api.ts`.

## Demo Credentials

For testing purposes, you can use:
- **Email**: demo@solekta.lk
- **Password**: demo123

## Key Features Implemented

### Order Processing Flow
1. Customer browses products and adds items to cart
2. Customer proceeds to checkout with shipping information
3. Order is created and payment is processed
4. Admin can view and manage orders
5. Order status can be updated throughout the fulfillment process
6. Customer can track their orders

### Form Validation
- Comprehensive form validation using Zod schemas
- Real-time validation feedback
- Error handling and user-friendly messages

### Responsive Design
- Mobile-first responsive design
- Optimized for all screen sizes
- Modern UI with smooth animations

### State Management
- Context-based state management for auth and cart
- Optimistic updates for better UX
- Proper error handling and loading states

## Future Enhancements

- Real-time order status updates
- Email notifications for order updates
- Advanced filtering and search
- Order analytics and reporting
- Payment gateway integration
- Inventory management integration