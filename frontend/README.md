# Vehicle Management System - Frontend

A modern React frontend for the Vehicle Management System, built with TypeScript, TailwindCSS, and Vite.

## Features

### Public Features
- **Vehicle Catalog**: Browse vehicles with advanced filtering and search
- **Vehicle Details**: View comprehensive vehicle information with image gallery
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Clean, minimalistic design with smooth interactions

### Admin Features (Authentication Required)
- **Vehicle Management**: Add, edit, and delete vehicles
- **Image Upload**: Multiple image upload for vehicles
- **AI Integration**: Generate vehicle descriptions using AI
- **Admin Dashboard**: Comprehensive vehicle inventory management

## Technology Stack

- **React 19** - UI Framework
- **TypeScript** - Type Safety
- **TailwindCSS 4** - Styling
- **React Router Dom** - Navigation
- **Vite** - Build Tool
- **Axios** - HTTP Client

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── admin/          # Admin-specific components
│   ├── common/         # Common components (pagination, etc.)
│   ├── layout/         # Layout components
│   └── vehicles/       # Vehicle-related components
├── context/            # React Context providers
├── pages/              # Page components
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── App.tsx            # Main application component
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Backend server running on port 3001

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment configuration:
```bash
cp .env.example .env
```

3. Update `.env` with your backend URL if different from default:
```env
VITE_API_URL=http://localhost:3001
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features Overview

### Vehicle Listing
- Grid layout with responsive design
- Advanced filtering by type, brand, model, color, year, price
- Search functionality across multiple fields
- Sorting options (price, year, brand, date)
- Pagination support

### Vehicle Details
- Image gallery with thumbnails
- Comprehensive vehicle specifications
- AI-generated descriptions
- Contact information for inquiries

### Admin Panel
- Protected routes (admin access only)
- Vehicle CRUD operations
- Bulk image upload
- AI description generation
- Real-time inventory management

### Authentication
- JWT-based authentication
- Protected routes for admin features
- Persistent login sessions
- Automatic token refresh

## API Integration

The frontend communicates with the backend through a RESTful API:

- `GET /api/vehicles` - Fetch vehicles with filtering
- `GET /api/vehicles/:id` - Get vehicle details
- `POST /api/vehicles` - Create vehicle (admin)
- `PUT /api/vehicles/:id` - Update vehicle (admin)
- `DELETE /api/vehicles/:id` - Delete vehicle (admin)
- `POST /api/auth/login` - User authentication
- `POST /api/ai/generate-description` - AI description generation

## Design Principles

- **Minimalistic**: Clean, uncluttered interface
- **Modern**: Contemporary design patterns and interactions
- **Responsive**: Mobile-first approach with excellent tablet/desktop experience
- **Accessible**: Proper contrast, focus states, and semantic HTML
- **Performance**: Optimized images, lazy loading, and efficient rendering

## Environment Variables

- `VITE_API_URL` - Backend API base URL
- `VITE_APP_NAME` - Application name
- `VITE_APP_VERSION` - Application version

## Contributing

1. Follow the existing code structure and patterns
2. Use TypeScript for all new components
3. Implement responsive design for all UI components
4. Add proper error handling and loading states
5. Follow the minimalistic design approach
