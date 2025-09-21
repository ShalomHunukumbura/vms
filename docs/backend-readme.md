# VMS Backend Documentation

## Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Technologies](#technologies)
- [Installation & Setup](#installation--setup)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Authentication & Authorization](#authentication--authorization)
- [File Management](#file-management)
- [AI Integration](#ai-integration)
- [Testing](#testing)
- [Environment Configuration](#environment-configuration)
- [Deployment](#deployment)
- [Development Guidelines](#development-guidelines)

## Overview

The VMS (Vehicle Management System) backend is a RESTful API built with Node.js, Express, and TypeScript. It provides comprehensive vehicle management capabilities including CRUD operations, authentication, file upload, and AI-powered features.

### Key Features
- 🚗 **Vehicle Management**: Complete CRUD operations for vehicles
- 🔐 **Authentication & Authorization**: JWT-based auth with role-based access control
- 📁 **File Upload**: Multi-image upload with validation
- 🤖 **AI Integration**: Automated vehicle description generation
- 🔍 **Advanced Search**: Filtering, sorting, and pagination
- 🧪 **Comprehensive Testing**: 96 tests with 100% pass rate
- 📊 **Database Management**: Sequelize ORM with MySQL/SQLite support

## Architecture

### Architectural Pattern
The backend follows a **layered architecture** pattern:

```
┌─────────────────┐
│   Controllers   │ ← HTTP Request/Response handling
├─────────────────┤
│    Services     │ ← Business logic & data processing
├─────────────────┤
│     Models      │ ← Data models & database interaction
├─────────────────┤
│   Database      │ ← MySQL/SQLite storage
└─────────────────┘
```

### Key Design Principles
- **Separation of Concerns**: Clear separation between controllers, services, and models
- **Dependency Injection**: Services injected into controllers
- **Single Responsibility**: Each module has a specific purpose
- **Type Safety**: Full TypeScript implementation
- **Error Handling**: Comprehensive error handling throughout

## Project Structure

```
backend/
├── src/                          # Source code
│   ├── app.ts                    # Application entry point
│   ├── config/                   # Configuration files
│   │   ├── database.ts           # Database configuration
│   │   ├── testDatabase.ts       # Test database setup
│   │   ├── jwt.ts                # JWT configuration
│   │   └── ai.ts                 # AI service configuration
│   ├── controllers/              # Request handlers
│   │   ├── authController.ts     # Authentication endpoints
│   │   ├── vehicleController.ts  # Vehicle endpoints
│   │   └── aiController.ts       # AI service endpoints
│   ├── middleware/               # Express middleware
│   │   └── auth.ts               # Authentication middleware
│   ├── models/                   # Database models
│   │   ├── index.ts              # Model exports & initialization
│   │   ├── User.ts               # User model
│   │   └── Vehicle.ts            # Vehicle model
│   ├── routes/                   # Route definitions
│   │   ├── auth.ts               # Authentication routes
│   │   ├── vehicles.ts           # Vehicle routes
│   │   └── ai.ts                 # AI service routes
│   ├── services/                 # Business logic
│   │   ├── authService.ts        # Authentication logic
│   │   ├── vehicleService.ts     # Vehicle business logic
│   │   ├── fileService.ts        # File upload handling
│   │   └── aiService.ts          # AI integration
│   ├── types/                    # TypeScript type definitions
│   └── utils/                    # Utility functions
├── tests/                        # Test suites
│   ├── controllers/              # Controller tests
│   ├── services/                 # Service tests
│   ├── integration/              # Integration tests
│   ├── models/                   # Test models
│   └── utils/                    # Test utilities
├── uploads/                      # File upload directory
├── coverage/                     # Test coverage reports
├── dist/                         # Compiled JavaScript
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript configuration
├── jest.config.js                # Test configuration
└── .env                          # Environment variables
```

## Technologies

### Core Technologies
- **Runtime**: Node.js 18+
- **Framework**: Express.js 5.x
- **Language**: TypeScript 5.x
- **Database**: MySQL 8.x (SQLite for testing)
- **ORM**: Sequelize 6.x

### Dependencies
```json
{
  "express": "^5.1.0",          // Web framework
  "sequelize": "^6.37.7",       // ORM
  "mysql2": "^3.15.0",          // MySQL driver
  "bcryptjs": "^3.0.2",         // Password hashing
  "jsonwebtoken": "^9.0.2",     // JWT authentication
  "multer": "^2.0.2",           // File upload handling
  "cors": "^2.8.5",             // Cross-origin requests
  "helmet": "^8.1.0",           // Security headers
  "morgan": "^1.10.1",          // Logging middleware
  "dotenv": "^17.2.2"           // Environment variables
}
```

### Development Dependencies
```json
{
  "typescript": "^5.9.2",       // TypeScript compiler
  "ts-node": "^10.9.2",         // TypeScript execution
  "nodemon": "^3.1.10",         // Development server
  "jest": "^30.1.3",            // Testing framework
  "ts-jest": "^29.4.4",         // TypeScript Jest support
  "supertest": "^7.1.4",        // HTTP testing
  "sqlite3": "^5.1.7",          // Test database
  "@types/*": "..."             // TypeScript type definitions
}
```

## Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- MySQL 8.x (for production)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vms/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment configuration**
   ```bash
   cp .env.example .env  # Create environment file
   # Edit .env with your configuration
   ```

4. **Database setup**
   ```bash
   # Ensure MySQL is running
   # Create database: vms_development
   npm run dev  # Starts server and auto-creates tables
   ```

5. **Run development server**
   ```bash
   npm run dev     # Development with hot reload
   npm run build   # Build for production
   npm start       # Start production server
   ```

### Available Scripts

```bash
npm run dev              # Development server with nodemon
npm run build            # TypeScript compilation
npm start                # Production server
npm test                 # Run all tests
npm run test:watch       # Watch mode testing
npm run test:coverage    # Test coverage report
npm run test:unit        # Unit tests only
npm run test:integration # Integration tests only
npm run test:ci          # CI/CD testing
```

## API Endpoints

### Authentication Endpoints
```http
POST /api/auth/login           # User login
POST /api/auth/register        # User registration
POST /api/auth/create-admin    # Create admin user
```

### Vehicle Endpoints
```http
# Public endpoints
GET    /api/vehicles           # Get vehicles (with filters/pagination)
GET    /api/vehicles/:id       # Get vehicle by ID

# Admin-only endpoints (require authentication + admin role)
POST   /api/vehicles           # Create new vehicle
PUT    /api/vehicles/:id       # Update vehicle
DELETE /api/vehicles/:id       # Delete vehicle
POST   /api/vehicles/upload    # Upload vehicle images
```

### AI Service Endpoints
```http
# Admin-only endpoints
POST /api/ai/generate-description      # Generate AI description
POST /api/ai/regenerate-description/:id # Regenerate description
```

### Utility Endpoints
```http
GET /health                    # Health check endpoint
GET /uploads/:filename         # Static file serving
```
## Authentication & Authorization

### JWT Implementation
- **Algorithm**: HS256
- **Token Expiration**: Configurable (default: 24h)
- **Token Storage**: Client-side (localStorage/sessionStorage)
- **Token Format**: `Bearer <token>`

### Authentication Flow
1. **Login**: POST `/api/auth/login` with credentials
2. **Token Generation**: Server generates JWT with user payload
3. **Token Usage**: Include in Authorization header: `Bearer <token>`
4. **Token Verification**: Middleware validates token on protected routes

### Authorization Levels
- **Public**: No authentication required
  - Get vehicles list
  - Get vehicle details
  - User registration/login

- **Authenticated**: Valid JWT required
  - Access to user-specific features

- **Admin**: Valid JWT + admin role required
  - Vehicle CRUD operations
  - File upload/management
  - AI service access
  - Admin user creation

## File Management

### Upload Configuration
- **Storage**: Local filesystem (`uploads/` directory)
- **Max Files**: 5 images per request
- **File Types**: Images only (jpg, jpeg, png, gif, webp)
- **Max File Size**: 5MB per file
- **File Naming**: UUID-based to prevent conflicts

### Upload Process
1. **Validation**: File type and size validation
2. **Storage**: Save to uploads directory with unique names
3. **Database**: Store filenames in vehicle.images array
4. **Serving**: Static file serving via `/uploads/:filename`

### AI Service Features
- **Context-aware**: Generates descriptions based on vehicle attributes
- **Customizable**: Configurable prompts and model parameters
- **Error Handling**: Graceful fallback for API failures
- **Rate Limiting**: Built-in request throttling

## Testing

### Test Coverage
- **Total Tests**: 96
- **Success Rate**: 100%
- **Test Suites**: 5 comprehensive suites
- **Coverage**: Controllers, Services, Integration

### Test Categories
1. **Unit Tests**: Individual function/method testing
2. **Integration Tests**: End-to-end API testing
3. **Service Tests**: Business logic validation
4. **Controller Tests**: Request/response handling

### Test Database
- **Engine**: SQLite in-memory
- **Isolation**: Each test suite gets fresh database
- **Speed**: Fast execution with memory storage
- **Mocking**: Complete separation from production DB

### Running Tests
```bash
npm test                    # All tests
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests only
npm run test:coverage      # With coverage report
npm run test:watch         # Watch mode
```

For detailed test documentation, see [test-readme.md](./test-readme.md).

## Environment Configuration

### Environment Variables
```bash
# Server Configuration
PORT=3001                       # Server port (default: 3001)
NODE_ENV=development           # Environment (development/production)

# Database Configuration
DB_HOST=localhost              # MySQL host
DB_PORT=3306                   # MySQL port
DB_NAME=vms_development        # Database name
DB_USER=root                   # Database user
DB_PASSWORD=password           # Database password

# Authentication
JWT_SECRET=your-secret-key     # JWT signing secret
JWT_EXPIRATION=24h             # Token expiration time

# AI Service (Optional)
OPENAI_API_KEY=sk-...          # OpenAI API key
OPENAI_MODEL=gpt-3.5-turbo     # Model to use

# File Upload
UPLOAD_PATH=./uploads          # Upload directory
MAX_FILE_SIZE=5242880          # Max file size (5MB)
```

### Configuration Files
- **.env**: Environment-specific variables
- **tsconfig.json**: TypeScript compiler options
- **jest.config.js**: Test runner configuration
- **package.json**: Dependencies and scripts