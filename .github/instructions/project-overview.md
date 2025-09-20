# Agile Mantis Frontend - Project Overview

## 🎯 What is Agile Mantis?

Agile Mantis is a modern project management and AI-powered collaboration platform designed for development teams. It combines traditional project management features with intelligent code analysis and team communication tools to enhance productivity and project transparency.

### Core Features

- **Team & Project Management**: Hierarchical organization with teams containing multiple projects
- **AI-Powered Chat**: Intelligent project assistant with codebase awareness
- **File Management**: Document upload, processing, and intelligent analysis
- **Member Management**: Role-based access control and team collaboration
- **Real-time Communication**: Interactive chat interface with markdown support

## 🛠️ Tech Stack

### Frontend Framework
- **React 19.1.0** - Latest React with concurrent features
- **TypeScript 5.8.3** - Full type safety and modern language features
- **Vite 6.3.5** - Fast build tool and development server

### Styling & UI
- **Tailwind CSS 3.4.16** - Utility-first CSS framework
- **@tailwindcss/forms** - Form styling utilities
- **Responsive Design** - Mobile-first approach with dark mode support

### State Management & Architecture
- **React Context API** - Global state management
- **useReducer Pattern** - Complex state logic handling
- **Custom Hooks** - Reusable stateful logic

### Routing & Navigation
- **React Router DOM 7.6.2** - Client-side routing
- **Lazy Loading** - Code splitting for optimal performance
- **Protected Routes** - Authentication-based access control

### Authentication & Security
- **Auth0 React 2.4.0** - Identity and access management
- **JWT Token Management** - Secure API authentication
- **Role-based Access Control** - Granular permissions

### API & Data Management
- **Axios 1.9.0** - HTTP client with interceptors
- **RESTful API Integration** - Backend communication
- **Error Handling** - Comprehensive error management

### Enhanced Features
- **React Markdown 10.1.0** - Rich text rendering for AI responses
- **React Syntax Highlighter 15.6.6** - Code block highlighting
- **Remark GFM 4.0.1** - GitHub Flavored Markdown support

### Development & Quality
- **ESLint 9.29.0** - Code linting and formatting
- **Prettier 3.5.3** - Code formatting
- **Jest 29.7.0** - Unit testing framework
- **React Testing Library 16.3.0** - Component testing utilities

## 🏗️ Architecture Patterns

### 1. Component Architecture

#### Atomic Design Principles
```
src/components/
├── common/           # Reusable atomic components
│   ├── Button.tsx    # Configurable button component
│   ├── Input.tsx     # Form input with validation
│   ├── Modal.tsx     # Overlay component
│   └── LoadingIndicator.tsx
├── layout/           # Layout components
│   ├── AppLayout.tsx # Main app structure
│   ├── Navbar.tsx    # Top navigation
│   └── Sidebar.tsx   # Side navigation
├── chat/             # Chat-specific components
├── project/          # Project-specific components
└── auth/             # Authentication components
```

#### Example: Reusable Button Component
```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  // ... props
}) => {
  // Utility-based styling with Tailwind
  const baseClasses = [
    'inline-flex', 'items-center', 'justify-center',
    'font-medium', 'rounded-lg', 'border',
    'transition-all', 'duration-200'
  ];
  
  // Variant-based styling
  const variantClasses = {
    primary: ['bg-primary-600', 'text-white', 'border-primary-600'],
    secondary: ['bg-gray-100', 'text-gray-900', 'border-gray-300'],
    // ... other variants
  };
  
  return (
    <button 
      className={clsx(baseClasses, variantClasses[variant], sizeClasses[size])}
      disabled={disabled || loading}
    >
      {loading && <LoadingSpinner />}
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
};
```

### 2. State Management Pattern

#### Context + Reducer Pattern
```tsx
// AuthContext.tsx - Global authentication state
interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  token: string | null;
  error: string | null;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      };
    // ... other cases
  }
}
```

#### Provider Composition Pattern
```tsx
// main.tsx - Nested providers for separation of concerns
<React.StrictMode>
  <ErrorBoundary>
    <AppProviders>          // Auth0 + global providers
      <ProjectProvider>     // Project-specific state
        <Suspense fallback={<LoadingIndicator />}>
          <AppRouter />
        </Suspense>
      </ProjectProvider>
    </AppProviders>
  </ErrorBoundary>
</React.StrictMode>
```

### 3. Routing Architecture

#### Nested Route Structure
```tsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <DashboardPage /> },
      {
        path: 'teams/:teamId',
        children: [
          { index: true, element: <TeamPage /> },
          { path: 'members', element: <TeamMembersPage /> },
          {
            path: 'projects/:projectId',
            children: [
              { index: true, element: <ProjectPage /> },
              { path: 'chat', element: <ProjectChatPage /> },
              { path: 'files', element: <ProjectFilesPage /> },
              // ... nested project routes
            ],
          },
        ],
      },
    ],
  },
]);
```

#### Lazy Loading with Code Splitting
```tsx
// Lazy loaded components for optimal bundle size
const ProjectChatPage = lazy(() => import('../pages/project/ProjectChatPage'));
const ProjectFilesPage = lazy(() => import('../pages/project/ProjectFilesPage'));

// Usage with Suspense boundary
<Suspense fallback={<LoadingIndicator />}>
  <ProjectChatPage />
</Suspense>
```

### 4. API Integration Pattern

#### Centralized HTTP Client
```tsx
// client.ts - Axios instance with interceptors
const axiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor for authentication
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth0_id_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth0_id_token');
      window.location.href = '/login';
    }
    return Promise.reject(new HttpError(message, status, code));
  }
);
```

#### Service Layer Pattern
```tsx
// projects.ts - API service abstraction
export const projectsApi = {
  // GET /api/teams/{teamId}/projects
  getProjects: async (teamId: string): Promise<Project[]> => {
    const response = await apiClient.get<Project[]>(`/teams/${teamId}/projects`);
    return response.data;
  },

  // POST /api/teams/{teamId}/projects
  createProject: async (teamId: string, data: CreateProjectRequest): Promise<Project> => {
    const response = await apiClient.post<Project>(`/teams/${teamId}/projects`, data);
    return response.data;
  },

  // PUT /api/teams/{teamId}/projects/{projectId}
  updateProject: async (teamId: string, projectId: string, data: UpdateProjectRequest): Promise<Project> => {
    const response = await apiClient.put<Project>(`/teams/${teamId}/projects/${projectId}`, data);
    return response.data;
  },
};
```

### 5. Type Safety Pattern

#### Comprehensive TypeScript Types
```tsx
// project.ts - Domain model types
export interface Project {
  id: string;
  name: string;
  description?: string;
  teamId: string;
  ownerId: string;
  members: ProjectMember[];
  documents: ProjectDocument[];
  agentContext: AgentContext;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMember {
  userId: string;
  user: User;
  role: ProjectRole;
  joinedAt: string;
}

export type ProjectRole = 'owner' | 'admin' | 'member' | 'viewer';
```

#### API Response Types
```tsx
// api.ts - API contract types
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

### 6. Error Handling Pattern

#### Global Error Boundary
```tsx
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <DefaultErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

#### Custom Error Classes
```tsx
export class HttpError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor(message: string, status: number, code?: string, details?: unknown) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}
```

## 🎨 Design System & Styling

### Utility-First CSS with Tailwind

#### Design Tokens
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          900: '#1e3a8a',
        },
        gray: {
          50: '#f9fafb',
          900: '#111827',
          950: '#030712',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  darkMode: 'class',
};
```

#### Component Styling Pattern
```tsx
// Consistent styling approach across components
const Button = ({ variant, size, className, ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg';
  const variantStyles = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
  };
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={clsx(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    />
  );
};
```

### Responsive Design Approach
- **Mobile-first**: Base styles for mobile, progressive enhancement
- **Breakpoint System**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Dark Mode Support**: System preference detection with manual toggle

## 🔒 Security Patterns

### Authentication Flow
1. **Auth0 Integration**: OAuth 2.0 / OpenID Connect
2. **JWT Token Management**: Secure token storage and rotation
3. **Protected Routes**: Route-level access control
4. **API Authentication**: Bearer token in request headers

### Security Best Practices
- **HTTPS Only**: All API communications encrypted
- **Token Expiration**: Automatic token refresh
- **Role-based Access**: Granular permission system
- **Input Validation**: Client and server-side validation

## 🧪 Testing Strategy

### Testing Architecture
```
src/
├── __tests__/           # Global test utilities
├── components/
│   └── Button.test.tsx  # Component unit tests
├── hooks/
│   └── useAuth.test.ts  # Custom hook tests
└── pages/
    └── Login.test.tsx   # Page integration tests
```

### Testing Patterns
```tsx
// Component testing with React Testing Library
describe('Button Component', () => {
  it('renders with correct variant classes', () => {
    render(<Button variant="primary">Click me</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-primary-600');
  });

  it('handles click events', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## 📁 Project Structure

```
agilemantis-frontend/
├── public/                 # Static assets
├── src/
│   ├── api/               # API service layer
│   │   ├── client.ts      # HTTP client configuration
│   │   ├── auth.ts        # Authentication API
│   │   ├── projects.ts    # Project management API
│   │   ├── teams.ts       # Team management API
│   │   └── chat.ts        # AI chat API
│   ├── components/        # Reusable UI components
│   │   ├── common/        # Atomic components
│   │   ├── layout/        # Layout components
│   │   ├── chat/          # Chat-specific components
│   │   └── project/       # Project-specific components
│   ├── context/           # React Context providers
│   │   ├── AuthContext.tsx    # Authentication state
│   │   ├── ProjectContext.tsx # Project management state
│   │   └── TeamContext.tsx    # Team management state
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page components
│   │   ├── auth/          # Authentication pages
│   │   ├── dashboard/     # Dashboard page
│   │   ├── project/       # Project pages
│   │   └── team/          # Team pages
│   ├── router/            # Routing configuration
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   └── main.tsx           # Application entry point
├── .env.development       # Development environment variables
├── .env.production        # Production environment variables
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite build configuration
```

## 🚀 Development Workflow

### Environment Setup
```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Run tests
yarn test

# Build for production
yarn build

# Lint and format
yarn lint
yarn format
```

### Environment Configuration
```bash
# .env.development
VITE_APP_TITLE=Agile Mantis - Dev
VITE_API_BASE_URL=http://localhost:3000/api
VITE_AUTH0_DOMAIN=dev-example.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_REDIRECT_URI=http://localhost:5175/callback
VITE_ENVIRONMENT=development
VITE_LOG_LEVEL=debug
```

## 🔧 Performance Optimizations

### Code Splitting
- **Route-level splitting**: Lazy loading of page components
- **Component-level splitting**: Dynamic imports for heavy components
- **Bundle analysis**: Webpack bundle analyzer integration

### State Management Optimization
- **Context separation**: Multiple contexts to prevent unnecessary re-renders
- **Memoization**: React.memo, useMemo, useCallback for expensive operations
- **Lazy state initialization**: Deferred loading of non-critical state

### Network Optimization
- **Request deduplication**: Prevent duplicate API calls
- **Caching strategy**: Intelligent data caching with expiration
- **Optimistic updates**: Immediate UI updates with fallback

## 🎯 Key Features Implementation

### AI-Powered Chat System
- **Real-time messaging**: WebSocket-like experience with polling
- **Markdown rendering**: Rich text support with syntax highlighting
- **Thread management**: Conversation persistence and context
- **Typing indicators**: Visual feedback for AI processing

### File Management System
- **Drag & drop upload**: Intuitive file handling
- **Processing status**: Real-time upload and processing feedback
- **Document analysis**: AI-powered content understanding
- **File preview**: In-browser document viewing

### Team & Project Hierarchy
- **Nested routing**: Teams containing multiple projects
- **Role-based access**: Granular permission system
- **Member management**: Invitation and role assignment
- **Settings management**: Configurable project parameters

## 📈 Future Enhancements

### Planned Features
- **Real-time collaboration**: WebSocket integration
- **Advanced search**: Full-text search across projects
- **Notification system**: In-app and email notifications
- **Analytics dashboard**: Project insights and metrics
- **Mobile app**: React Native companion app

### Technical Improvements
- **Progressive Web App**: Offline support and mobile optimization
- **Micro-frontends**: Modular architecture for scalability
- **GraphQL migration**: More efficient data fetching
- **Advanced caching**: Redis integration for performance

---

*This project overview serves as a comprehensive guide to the Agile Mantis frontend architecture, patterns, and implementation details. It's designed to help developers understand the codebase structure and contribute effectively to the project.*