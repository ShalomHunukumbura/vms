# Vehicle Management System (VMS)

## Overview

The Vehicle Management System (VMS) is a comprehensive web application designed for managing vehicle inventories with advanced features including user authentication, role-based access control, AI-powered descriptions, and responsive design.

### 🎯 Key Highlights

- **🔐 Secure Authentication**: JWT-based authentication.
- **🚗 Advanced Vehicle Management**: Complete CRUD operations with filtering and search
- **🤖 AI Integration**: Automated vehicle description generation using OpenAI
- **📱 Responsive Design**: Mobile-first design that works on all devices
- **🧪 Comprehensive Testing**: 96 tests with 100% pass rate
- **📊 Admin Dashboard**: Complete administrative control panel

## Features

### 🚀 Core Features

#### Vehicle Management
- **Vehicle Catalog**: Browse vehicles with advanced filtering and search
- **Detailed Views**: Comprehensive vehicle information with image galleries
- **Advanced Search**: Filter by type, brand, price range, year, and more
- **Pagination**: pagination for navigation
- **Image Management**: Multi-image upload

#### Authentication & Authorization
- **User Registration**: Secure account creation with password validation
- **Role-Based Access**: Separate user and admin access levels
- **JWT Security**: Token-based authentication with automatic expiration
- **Protected Routes**: Access control for sensitive operations

#### Admin Features
- **Vehicle CRUD**: Create, read, update, and delete vehicles
- **AI Descriptions**: Generate marketing-friendly descriptions automatically
- **User Management**: Admin user creation and management
- **Analytics Dashboard**: Insights into vehicle inventory and usage

#### Technical Features
- **RESTful API**: Well-designed API with comprehensive endpoints
- **Database Management**: Data persistence with MySQL/SQLite
- **File Upload**: Secure image upload with validation
- **Error Handling**: Error management and user feedback

## Tech Stack

### Frontend
- **Framework**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 7.1.6 for lightning-fast development
- **Styling**: Tailwind CSS 4.1.13 for responsive design
- **Routing**: React Router DOM 7.9.1
- **HTTP Client**: Axios for API communication
- **Icons**: React Icons + HugeIcons for modern UI

### Backend
- **Runtime**: Node.js 18+ with Express.js 5.x
- **Language**: TypeScript 5.x for type safety
- **Database**: MySQL 8.x (SQLite for development/testing)
- **ORM**: Sequelize 6.x for database operations
- **Authentication**: JWT with bcrypt password hashing
- **File Handling**: Multer for image uploads
- **Security**: Helmet.js for security headers

### Development & Testing
- **Testing**: Jest with 96 comprehensive tests
- **Linting**: ESLint for code quality
- **Development**: Nodemon for backend hot reload
- **API Testing**: Supertest for integration testing
- **Database Testing**: SQLite in-memory for fast testing

## Quick Start

### Prerequisites
- Node.js 18 or higher
- MySQL 8.x (for production) or SQLite (for development)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/vms.git
   cd vms
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install

   # Configure environment variables
   cp .env.example .env
   # Edit .env with your database configuration

   # Start development server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install

   # Start development server
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - Health Check: http://localhost:3001/health

### Environment Configuration

#### Backend (.env)
```bash
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=vms_development
DB_USER=your_username
DB_PASSWORD=your_password

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION=24h

# AI Service (Optional)
OPENAI_API_KEY=your-openai-api-key
```

#### Frontend (.env)
```bash
VITE_API_URL=http://localhost:3001
```

## Project Structure

```
vms/
├── backend/                      # Node.js API server
│   ├── src/
│   │   ├── controllers/          # Request handlers
│   │   ├── services/             # Business logic
│   │   ├── models/               # Database models
│   │   ├── routes/               # API routes
│   │   ├── middleware/           # Express middleware
│   │   ├── config/               # Configuration files
│   │   └── utils/                # Utility functions
│   ├── tests/                    # Test suites (96 tests)
│   ├── uploads/                  # File upload directory
│   └── backend-readme.md         # Backend documentation
├── frontend/                     # React application
│   ├── src/
│   │   ├── components/           # React components
│   │   ├── pages/                # Route components
│   │   ├── context/              # React context
│   │   ├── hooks/                # Custom hooks
│   │   ├── utils/                # Utility functions
│   │   └── types/                # TypeScript types
│   ├── public/                   # Static assets
│   └── frontend-readme.md        # Frontend documentation
├── docs/                         # Additional documentation
└── README.md                     # This file
```

## API Endpoints

### Authentication
```http
POST /api/auth/login              # User login
POST /api/auth/register           # User registration
POST /api/auth/create-admin       # Create admin user
```

### Vehicles
```http
GET    /api/vehicles              # Get vehicles (with filters)
GET    /api/vehicles/:id          # Get vehicle by ID
POST   /api/vehicles              # Create vehicle (Admin)
PUT    /api/vehicles/:id          # Update vehicle (Admin)
DELETE /api/vehicles/:id          # Delete vehicle (Admin)
POST   /api/vehicles/upload       # Upload images (Admin)
```

### AI Services
```http
POST /api/ai/generate-description    # Generate AI description (Admin)
POST /api/ai/regenerate-description/:id # Regenerate description (Admin)
```

### Utilities
```http
GET /health                       # Health check
GET /uploads/:filename            # Static file serving
```

## Testing

The project includes comprehensive testing with **96 tests** achieving **100% pass rate**:

### Backend Testing (96 tests)
- **Unit Tests**: Service and controller testing
- **Integration Tests**: End-to-end API testing
- **Coverage**: Authentication, vehicle management, file upload, AI integration

### Running Tests
```bash
# Backend tests
cd backend
npm test                    # All tests
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests only
npm run test:coverage      # With coverage report

# Frontend tests (when implemented)
cd frontend
npm test
```

### Test Results Summary
- **Authentication Service**: 17/17 tests passing
- **Vehicle Service**: 29/29 tests passing
- **Authentication Controller**: 18/18 tests passing
- **Vehicle Controller**: 10/10 tests passing
- **Integration Tests**: 22/22 tests passing

## Development

### Development Workflow
```bash
# Start both servers concurrently
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### Code Quality
```bash
# Backend
cd backend
npm run build      # TypeScript compilation
npm run lint       # Code linting (if configured)
npm test           # Run all tests

# Frontend
cd frontend
npm run build      # Production build
npm run lint       # ESLint checking
npm run preview    # Preview production build
```

### Development Guidelines
- **TypeScript**: Strict mode enabled for both frontend and backend
- **Code Style**: Consistent formatting and naming conventions
- **Testing**: Write tests for new features and bug fixes
- **Documentation**: Update relevant documentation for changes
- **Error Handling**: Comprehensive error management
- **Security**: Follow security best practices

### Detailed Documentation
- 📖 **[Backend Documentation](docs/backend-readme.md)**: Complete backend API and architecture guide
- 📱 **[Frontend Documentation](docs/frontend-readme.md)**: React application and component documentation
- 🧪 **[Testing Documentation](docs/test-readme.md)**: Comprehensive testing guide and coverage