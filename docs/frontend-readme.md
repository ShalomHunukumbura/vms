# VMS Frontend Documentation

## Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Technologies](#technologies)
- [Installation & Setup](#installation--setup)
- [Features & Components](#features--components)
- [Routing & Navigation](#routing--navigation)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Authentication System](#authentication-system)
- [UI/UX Design](#uiux-design)
- [Environment Configuration](#environment-configuration)
- [Build & Deployment](#build--deployment)
- [Development Guidelines](#development-guidelines)

## Overview

The VMS (Vehicle Management System) frontend is a modern React application built with TypeScript and Vite. It provides a responsive, user-friendly interface for vehicle browsing, management, and administration with role-based access control.

### Key Features
- 🚗 **Vehicle Browsing**: Advanced search, filtering, and pagination
- 🔐 **Authentication**: Secure login/register with JWT tokens
- 👨‍💼 **Admin Panel**: Complete vehicle management for administrators
- 📱 **Responsive Design**: Mobile-first design with Tailwind CSS
- 🎨 **Modern UI**: Clean, intuitive user interface
- 🔄 **Real-time Updates**: Dynamic content loading and updates
- 🖼️ **Image Management**: Multi-image upload and display
- 🤖 **AI Integration**: AI-powered vehicle descriptions

## Architecture

### Architectural Pattern
The frontend follows a **component-based architecture** with React:

```
┌─────────────────┐
│     Pages       │ ← Route components & main views
├─────────────────┤
│   Components    │ ← Reusable UI components
├─────────────────┤
│    Context      │ ← Global state management
├─────────────────┤
│    Services     │ ← API communication layer
├─────────────────┤
│     Utils       │ ← Helper functions & utilities
└─────────────────┘
```

### Key Design Principles
- **Component Reusability**: Modular, reusable components
- **Type Safety**: Full TypeScript implementation
- **Separation of Concerns**: Clear separation between UI, state, and business logic
- **Responsive Design**: Mobile-first approach
- **Performance**: Optimized rendering and lazy loading

## Project Structure

```
frontend/
├── public/                       # Static assets
│   ├── vite.svg                  # Vite logo
│   └── index.html               # HTML entry point
├── src/                         # Source code
│   ├── App.tsx                  # Main application component
│   ├── main.tsx                 # Application entry point
│   ├── vite-env.d.ts           # Vite type definitions
│   ├── components/              # Reusable components
│   │   ├── admin/               # Admin-specific components
│   │   │   └── VehicleForm.tsx  # Vehicle creation/editing form
│   │   ├── common/              # Shared components
│   │   │   ├── Pagination.tsx   # Pagination component
│   │   │   └── ProtectedRoute.tsx # Route protection
│   │   ├── layout/              # Layout components
│   │   │   ├── Header.tsx       # Navigation header
│   │   │   └── Layout.tsx       # Main layout wrapper
│   │   └── vehicles/            # Vehicle-related components
│   │       ├── VehicleCard.tsx  # Vehicle display card
│   │       └── VehicleFilters.tsx # Search/filter controls
│   ├── context/                 # React Context providers
│   │   └── AuthContext.tsx      # Authentication context
│   ├── hooks/                   # Custom React hooks
│   │   └── useAuth.ts           # Authentication hook
│   ├── pages/                   # Route components
│   │   ├── AdminPanel.tsx       # Admin dashboard
│   │   ├── Login.tsx            # Login page
│   │   ├── Register.tsx         # Registration page
│   │   ├── NotFound.tsx         # 404 error page
│   │   ├── VehicleDetail.tsx    # Vehicle details view
│   │   └── VehicleList.tsx      # Vehicle listing page
│   ├── services/                # API services (placeholder)
│   ├── types/                   # TypeScript type definitions
│   │   ├── index.ts             # Main type definitions
│   │   └── api-error.ts         # Error handling types
│   └── utils/                   # Utility functions
│       ├── api.ts               # API communication
│       └── auth.ts              # Authentication utilities
├── dist/                        # Build output
├── node_modules/                # Dependencies
├── package.json                 # Dependencies & scripts
├── tsconfig.json               # TypeScript configuration
├── tsconfig.app.json           # App-specific TS config
├── tsconfig.node.json          # Node-specific TS config
├── vite.config.ts              # Vite configuration
├── eslint.config.js            # ESLint configuration
└── README.md                   # Project documentation
```

## Technologies

### Core Technologies
- **Framework**: React 19.1.1
- **Language**: TypeScript 5.8.3
- **Build Tool**: Vite 7.1.6
- **Styling**: Tailwind CSS 4.1.13
- **Routing**: React Router DOM 7.9.1

### Dependencies
```json
{
  "react": "^19.1.1",              // React framework
  "react-dom": "^19.1.1",          // React DOM rendering
  "react-router-dom": "^7.9.1",    // Client-side routing
  "axios": "^1.12.2",              // HTTP client
  "react-icons": "^5.5.0",         // Icon library
  "@hugeicons/react": "^1.1.1",    // Additional icons
  "@tailwindcss/vite": "^4.1.13"   // Tailwind CSS integration
}
```

### Development Dependencies
```json
{
  "vite": "^7.1.6",                // Build tool
  "typescript": "~5.8.3",          // TypeScript compiler
  "@vitejs/plugin-react": "^5.0.2", // React plugin for Vite
  "eslint": "^9.35.0",             // Linting
  "tailwindcss": "^4.1.13",        // CSS framework
  "@types/react": "^19.1.13",      // React type definitions
  "@types/react-dom": "^19.1.9",   // React DOM types
  "@types/node": "^24.5.2"         // Node.js types
}
```

## Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Backend API running (see backend documentation)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vms/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment configuration**
   ```bash
   # Create .env file (optional for development)
   echo "VITE_API_URL=http://localhost:3001" > .env
   ```

4. **Start development server**
   ```bash
   npm run dev     # Development server
   npm run build   # Production build
   npm run preview # Preview production build
   ```

### Available Scripts

```bash
npm run dev        # Start development server with hot reload
npm run build      # Build for production (TypeScript + Vite)
npm run preview    # Preview production build locally
npm run lint       # Run ESLint for code quality
```

## Features & Components

### Core Features

#### 1. Vehicle Browsing
- **Vehicle List**: Paginated grid view of all vehicles
- **Advanced Search**: Text search across multiple fields
- **Filtering**: Filter by type, brand, price range, year
- **Sorting**: Sort by price, year, creation date
- **Pagination**: Navigate through large datasets

#### 2. Vehicle Details
- **Detailed View**: Complete vehicle information
- **Image Gallery**: Multiple vehicle images with navigation
- **Specifications**: Engine size, color, year, price
- **Descriptions**: Manual and AI-generated descriptions

#### 3. Authentication System
- **User Registration**: Create new user accounts
- **Secure Login**: JWT-based authentication
- **Role Management**: User and admin role distinction
- **Protected Routes**: Access control for admin features

#### 4. Admin Panel
- **Vehicle Management**: Create, edit, delete vehicles
- **Image Upload**: Multi-image upload with validation
- **AI Integration**: Generate descriptions automatically
- **Admin Controls**: Full administrative capabilities

### Component Library

#### Layout Components
```typescript
// Header.tsx - Navigation and user controls
<Header />

// Layout.tsx - Main page layout wrapper
<Layout>
  <YourPageContent />
</Layout>
```

#### Vehicle Components
```typescript
// VehicleCard.tsx - Individual vehicle display
<VehicleCard vehicle={vehicleData} />

// VehicleFilters.tsx - Search and filter controls
<VehicleFilters
  filters={filters}
  onFiltersChange={handleFiltersChange}
/>
```

#### Common Components
```typescript
// Pagination.tsx - Page navigation
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={handlePageChange}
/>

// ProtectedRoute.tsx - Route access control
<ProtectedRoute requireAdmin={true}>
  <AdminComponent />
</ProtectedRoute>
```

#### Admin Components
```typescript
// VehicleForm.tsx - Vehicle creation/editing
<VehicleForm
  vehicle={vehicleData}
  onSubmit={handleSubmit}
  isEditing={isEditing}
/>
```

## Routing & Navigation

### Route Structure
```typescript
// App.tsx routing configuration
<Routes>
  <Route path="/" element={<VehicleList />} />           // Home page
  <Route path="/vehicle/:id" element={<VehicleDetail />} /> // Vehicle details
  <Route path="/login" element={<Login />} />            // User login
  <Route path="/register" element={<Register />} />      // User registration
  <Route path="/admin" element={<AdminPanel />} />       // Admin dashboard
  <Route path="*" element={<NotFound />} />              // 404 error page
</Routes>
```

### Navigation Features
- **Dynamic Routing**: Parameters for vehicle details
- **Protected Routes**: Admin-only access control
- **Breadcrumb Navigation**: Clear navigation hierarchy
- **Mobile-Friendly**: Responsive navigation menu

### Route Protection
```typescript
// Example protected route usage
<ProtectedRoute requireAdmin={true}>
  <AdminPanel />
</ProtectedRoute>
```

## State Management

### Authentication Context
```typescript
// AuthContext.tsx - Global authentication state
interface AuthContextValue {
  user: User | null;              // Current user data
  token: string | null;           // JWT token
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;       // Authentication status
  isAdmin: boolean;              // Admin role check
}
```

### Local State Management
- **Component State**: React useState for local state
- **Custom Hooks**: useAuth for authentication logic
- **Context API**: Global authentication state
- **Local Storage**: Persistent user sessions

### State Flow
```
User Action → Component → Service Layer → API → Backend
     ↓
Local State Update → UI Re-render → User Feedback
```

## API Integration

### API Service Architecture
```typescript
// utils/api.ts - Centralized API communication

// Base configuration
const api = axios.create({
  baseURL: 'http://localhost:3001',
  headers: { 'Content-Type': 'application/json' }
});

// Automatic token injection
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

### API Services

#### Authentication API
```typescript
export const authAPI = {
  login: (username: string, password: string) => Promise<AuthResponse>
  register: (username: string, password: string) => Promise<AuthResponse>
  createAdmin: (username: string, password: string) => Promise<void>
}
```

#### Vehicle API
```typescript
export const vehicleAPI = {
  getVehicles: (filters: VehicleFilters) => Promise<PaginatedResponse<Vehicle>>
  getVehicleById: (id: string) => Promise<Vehicle>
  createVehicle: (data: VehicleFormData) => Promise<Vehicle>
  updateVehicle: (id: string, data: Partial<VehicleFormData>) => Promise<Vehicle>
  deleteVehicle: (id: string) => Promise<void>
  uploadImages: (images: File[]) => Promise<string[]>
}
```

#### AI API
```typescript
export const aiAPI = {
  generateDescription: (vehicleData: VehicleFormData) => Promise<string>
  regenerateDescription: (vehicleId: string) => Promise<string>
}
```

### Error Handling
```typescript
// Automatic error handling with interceptors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Automatic logout on authentication errors
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## Authentication System

### Authentication Flow
1. **Login Process**:
   ```typescript
   User Input → authAPI.login() → JWT Token → localStorage → AuthContext Update
   ```

2. **Token Management**:
   - Storage: localStorage for persistence
   - Automatic injection: Axios interceptors
   - Expiration handling: Automatic logout on 401/403

3. **Role-Based Access**:
   ```typescript
   // Check admin privileges
   const { isAdmin } = useAuth();

   // Protect admin routes
   <ProtectedRoute requireAdmin={true}>
     <AdminComponent />
   </ProtectedRoute>
   ```

### Authentication Components
- **Login Form**: Username/password authentication
- **Registration Form**: New user account creation
- **Protected Routes**: Access control wrapper
- **Auth Context**: Global authentication state

### Security Features
- **JWT Tokens**: Secure token-based authentication
- **Automatic Logout**: Invalid token handling
- **Route Protection**: Role-based access control
- **Session Persistence**: Remember user sessions

## UI/UX Design

### Design System
- **Framework**: Tailwind CSS 4.x
- **Responsive**: Mobile-first approach
- **Typography**: System fonts with fallbacks
- **Color Scheme**: Modern, accessible color palette
- **Icons**: React Icons + HugeIcons

### Component Design Patterns
```typescript
// Consistent component structure
const ComponentName: React.FC<Props> = ({ prop1, prop2 }) => {
  const [state, setState] = useState(initialValue);

  const handleAction = () => {
    // Action logic
  };

  return (
    <div className="responsive-classes">
      {/* Component content */}
    </div>
  );
};
```

### Responsive Breakpoints
```css
/* Tailwind CSS breakpoints */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X large devices */
```

### UI Components
- **Cards**: Vehicle display cards with hover effects
- **Forms**: Accessible form inputs with validation
- **Buttons**: Consistent button styles and states
- **Navigation**: Responsive navigation with mobile menu
- **Modals**: Overlay components for actions
- **Loading States**: Skeleton screens and spinners

## Environment Configuration

### Environment Variables
```bash
# .env file
VITE_API_URL=http://localhost:3001    # Backend API URL
```

### Development Configuration
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    react(),          // React support
    tailwindcss(),    // Tailwind CSS integration
  ],
  server: {
    port: 5173,       // Development server port
    open: true,       // Auto-open browser
  }
});
```

### TypeScript Configuration
```json
// tsconfig.app.json
{
  "compilerOptions": {
    "target": "ES2022",
    "jsx": "react-jsx",
    "strict": true,
    "moduleResolution": "bundler"
  }
}
```

## Build & Deployment

### Build Process
```bash
# Development build
npm run dev

# Production build
npm run build        # Creates dist/ directory
npm run preview     # Preview production build
```

### Build Output
```
dist/
├── index.html      # Main HTML file
├── assets/         # Bundled CSS/JS assets
│   ├── index-[hash].css
│   └── index-[hash].js
└── vite.svg       # Static assets
```

### Deployment Options

#### Static Hosting (Netlify, Vercel)
```bash
# Build and deploy
npm run build
# Upload dist/ directory to hosting provider
```

#### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

#### Environment-Specific Builds
```bash
# Development
VITE_API_URL=http://localhost:3001 npm run build

# Production
VITE_API_URL=https://api.yourdomain.com npm run build
```

## Development Guidelines

### Code Style Standards
- **TypeScript**: Strict mode enabled
- **React**: Functional components with hooks
- **Naming**: camelCase for variables, PascalCase for components
- **File Structure**: Organized by feature/functionality
- **Import Order**: External → Internal → Relative imports

### Component Development
```typescript
// Component template
import React, { useState, useEffect } from 'react';
import type { ComponentProps } from '../types';

interface Props {
  // Define prop types
}

const ComponentName: React.FC<Props> = ({ prop }) => {
  // State and effects
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    // Side effects
  }, []);

  // Event handlers
  const handleEvent = () => {
    // Handler logic
  };

  // Render
  return (
    <div className="component-styles">
      {/* Component JSX */}
    </div>
  );
};

export default ComponentName;
```

### API Integration Patterns
```typescript
// Custom hook for API calls
const useVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const data = await vehicleAPI.getVehicles();
      setVehicles(data.items);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return { vehicles, loading, error, fetchVehicles };
};
```

### Error Handling
```typescript
// Consistent error handling
try {
  const result = await apiCall();
  // Handle success
} catch (error) {
  const message = getErrorMessage(error);
  setError(message);
  // Optional: Show toast notification
}
```

### Performance Best Practices
- **Code Splitting**: Route-based lazy loading
- **Image Optimization**: Lazy loading and proper sizing
- **Bundle Optimization**: Tree shaking and minification
- **Caching**: API response caching where appropriate
- **Memoization**: React.memo for expensive components

### Testing Strategy
```typescript
// Component testing pattern (future implementation)
import { render, screen } from '@testing-library/react';
import ComponentName from './ComponentName';

test('renders component correctly', () => {
  render(<ComponentName prop="value" />);
  expect(screen.getByText('Expected Text')).toBeInTheDocument();
});
```

## Contributing

### Development Workflow
1. Create feature branch from `main`
2. Implement changes following style guidelines
3. Test components and functionality
4. Run linting: `npm run lint`
5. Build successfully: `npm run build`
6. Submit pull request
7. Code review and approval
8. Merge to main

### Code Quality Standards
- All code must be TypeScript
- Components must be properly typed
- Follow React best practices
- Responsive design required
- Accessibility considerations

## Performance & Optimization

### Bundle Optimization
- **Vite**: Fast development and optimized builds
- **Tree Shaking**: Automatic dead code elimination
- **Code Splitting**: Route-based lazy loading
- **Asset Optimization**: Image and CSS optimization

### Runtime Performance
- **React 19**: Latest React optimizations
- **Virtual DOM**: Efficient rendering
- **Memo**: Component memoization where needed
- **Lazy Loading**: Images and routes

### Monitoring
- **Build Size**: Monitor bundle size growth
- **Load Times**: Track application load performance
- **User Experience**: Monitor real-world usage patterns

## Support & Maintenance

### Browser Support
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+
- **Mobile**: iOS Safari 14+, Android Chrome 90+
- **ES2022**: Modern JavaScript features

### Troubleshooting
- **Build Issues**: Check Node.js version and dependencies
- **API Errors**: Verify backend connectivity
- **Styling Issues**: Check Tailwind CSS compilation
- **Routing Problems**: Verify React Router configuration

### Maintenance Tasks
- **Dependency Updates**: Regular security updates
- **Performance Monitoring**: Track application metrics
- **User Feedback**: Incorporate user experience improvements
- **Feature Development**: Add new functionality as needed

---

**Version**: 1.0.0
**Last Updated**: December 2024
**Maintainer**: VMS Development Team

For backend documentation, see [backend-readme.md](../backend/backend-readme.md)