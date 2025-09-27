# SOLEKTA - Laptop Shop Management System

A modern, full-featured laptop shop management system built with React, TypeScript, and Tailwind CSS. Features a responsive design, shopping cart, user authentication, admin dashboard, and repair booking system.

![SOLEKTA Preview](src/assets/hero-laptops.jpg)

## ✨ Features

### 🛍️ Customer Features
- **Product Catalog**: Browse and search premium laptops with advanced filtering
- **Shopping Cart**: Add, remove, and manage items with persistent storage
- **User Authentication**: Secure login/register with JWT token management
- **Order Management**: View order history and track shipments
- **Repair Booking**: Schedule laptop repair appointments
- **Responsive Design**: Optimized for desktop, tablet, and mobile

### 👨‍💼 Admin Features
- **Dashboard**: Overview of sales, orders, and key metrics
- **Product Management**: Add, edit, and manage laptop inventory
- **Order Management**: Process orders and update shipping status
- **Customer Management**: View and manage customer accounts
- **Appointment Management**: Handle repair service bookings

### 🎨 Design System
- **Modern UI**: Clean, professional design with tech-inspired aesthetic
- **Design Tokens**: Consistent colors, typography, and spacing
- **Dark/Light Mode**: Automatic theme switching support
- **Animations**: Smooth transitions and micro-interactions
- **Accessibility**: WCAG compliant components

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-git-url>
   cd solekta-laptop-shop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:8080`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/ui components
│   ├── layout/         # Layout components (Header, Footer)
│   └── common/         # Common components (ProtectedRoute)
├── pages/              # Page components
│   ├── Home.tsx        # Landing page
│   ├── Products.tsx    # Product catalog
│   ├── Login.tsx       # Authentication
│   └── admin/          # Admin pages
├── context/            # React Context providers
│   ├── AuthContext.tsx # Authentication state
│   └── CartContext.tsx # Shopping cart state
├── services/           # API service layers
│   ├── api.ts          # Axios configuration
│   ├── authService.ts  # Authentication API
│   └── productService.ts # Product API
├── types/              # TypeScript type definitions
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── assets/             # Static assets
└── styles/             # Global styles
```

## 🛠️ Built With

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Shadcn/ui
- **Routing**: React Router v6
- **State Management**: React Context + Zustand
- **Form Handling**: React Hook Form + Zod validation
- **HTTP Client**: Axios with interceptors
- **Icons**: Lucide React

## 📱 Key Pages

### Public Pages
- **Home** (`/`) - Hero section, featured products, company info
- **Products** (`/products`) - Product catalog with filtering and search
- **Product Detail** (`/products/:id`) - Individual product page
- **Cart** (`/cart`) - Shopping cart management
- **Checkout** (`/checkout`) - Order completion
- **Login/Register** (`/login`, `/register`) - User authentication
- **Repair Booking** (`/repair-booking`) - Service appointment scheduling

### Protected Pages
- **Profile** (`/profile`) - User account management
- **Orders** (`/orders`) - Order history and tracking
- **Repair History** (`/repair-history`) - Service appointment history

### Admin Pages (Role-based)
- **Dashboard** (`/admin`) - Sales overview and metrics
- **Manage Products** (`/admin/products`) - Inventory management
- **Manage Orders** (`/admin/orders`) - Order processing
- **Manage Customers** (`/admin/customers`) - Customer management
- **Manage Appointments** (`/admin/appointments`) - Service scheduling

## 🔐 Authentication Flow

The app uses JWT token-based authentication:

1. **Login/Register**: User credentials sent to API
2. **Token Storage**: JWT token stored in localStorage
3. **Auto-Login**: Token validated on app initialization
4. **Protected Routes**: ProtectedRoute component guards private pages
5. **Token Refresh**: Automatic token refresh handling
6. **Logout**: Token removal and state cleanup

## 🛒 Shopping Cart

Features persistent shopping cart with:
- Add/remove items
- Quantity management
- Price calculations
- Local storage persistence
- Stock validation
- Checkout integration

## 🎨 Design System

### Colors
- **Primary**: Tech blue (#3B82F6) with glow variant
- **Secondary**: Elegant gray tones
- **Success**: Modern green for positive actions
- **Warning**: Bright orange for alerts
- **Destructive**: Red for errors and deletions

### Typography
- **Headings**: Bold, modern sans-serif
- **Body**: Clean, readable font stack
- **Code**: Monospace for technical content

### Components
- **Cards**: Subtle gradients with elegant shadows
- **Buttons**: Multiple variants with hover effects
- **Forms**: Clean inputs with validation states
- **Navigation**: Responsive header with mobile menu

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Code Standards
- **TypeScript**: Strict mode enabled
- **ESLint**: Configured for React + TypeScript
- **Prettier**: Code formatting
- **Component Structure**: Function components with hooks
- **Naming**: PascalCase for components, camelCase for functions

## 🌐 API Integration

The frontend is designed to work with a Spring Boot REST API:

- **Base URL**: Configurable via `VITE_API_BASE_URL`
- **Authentication**: JWT Bearer tokens
- **Error Handling**: Centralized error management
- **Request/Response**: JSON format
- **CORS**: Configured for development

### API Endpoints (Expected)
```
Auth:          POST /api/auth/login, /api/auth/register
Products:      GET  /api/products, GET /api/products/:id
Orders:        POST /api/orders, GET /api/orders/my
Appointments:  POST /api/appointments, GET /api/appointments/my
Admin:         GET  /api/admin/*, POST /api/admin/*
```

## 🧪 Testing

### Demo Accounts
For testing purposes, use these demo credentials:

**Customer Account:**
- Email: `customer@demo.com`
- Password: `password123`

**Admin Account:**
- Email: `admin@demo.com`
- Password: `password123`

## 📦 Deployment

### Production Build
```bash
npm run build
```

The `dist/` folder contains the production-ready files.

### Environment Variables
Set these environment variables for production:
- `VITE_API_BASE_URL`: Your backend API URL
- Additional variables as needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Shadcn/ui** for beautiful, accessible components
- **Tailwind CSS** for utility-first styling
- **Lucide** for modern, consistent icons
- **React Ecosystem** for powerful development tools

---

**SOLEKTA** - Your trusted partner for premium laptops and professional repair services.