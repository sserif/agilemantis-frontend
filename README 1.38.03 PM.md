# Agile Mantis Frontend

A modern, responsive web application for project management and team collaboration, built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Modern Tech Stack**: React 19, TypeScript, Vite, Tailwind CSS
- **Responsive Design**: Mobile-first approach with dark mode support
- **Type Safety**: Full TypeScript integration with strict type checking
- **Component Library**: Reusable UI components with consistent design
- **State Management**: React Context API with useReducer for complex state
- **Routing**: React Router v7 with code splitting and lazy loading
- **Form Handling**: Built-in validation utilities and form components
- **API Integration**: Axios-based API client with interceptors and error handling
- **Testing**: Jest and React Testing Library setup
- **Code Quality**: ESLint, Prettier, and pre-commit hooks

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher (or yarn equivalent)
- Modern web browser with ES2020 support

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd agile-mantis/code/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.development
   ```
   
   Edit `.env.development` and configure the following variables:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   VITE_APP_NAME=Agile Mantis
   VITE_APP_VERSION=1.0.0
   VITE_AUTH0_DOMAIN=your-auth0-domain
   VITE_AUTH0_CLIENT_ID=your-auth0-client-id
   VITE_AUTH0_AUDIENCE=your-auth0-audience
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build the application for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint to check code quality |
| `npm run lint:fix` | Run ESLint and automatically fix issues |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting with Prettier |
| `npm run test` | Run tests in watch mode |
| `npm run test:ci` | Run tests once for CI/CD |
| `npm run test:coverage` | Run tests with coverage report |

## 📁 Project Structure

```
src/
├── api/                    # API client and service layers
│   ├── client.ts          # Axios client configuration
│   ├── auth.ts            # Authentication API methods
│   ├── teams.ts           # Team management API methods
│   ├── projects.ts        # Project management API methods
│   ├── users.ts           # User management API methods
│   └── index.ts           # API exports
├── components/             # Reusable UI components
│   ├── common/            # Generic components (Button, Input, Modal, etc.)
│   └── layout/            # Layout components (Navbar, Sidebar, etc.)
├── context/               # React Context providers
│   ├── AuthContext.tsx   # Authentication state management
│   ├── TeamContext.tsx   # Team state management
│   ├── ProjectContext.tsx # Project state management
│   └── index.ts          # Context exports
├── hooks/                 # Custom React hooks
│   └── index.ts          # Hook exports
├── pages/                 # Page components organized by feature
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # Dashboard page
│   ├── team/             # Team management pages
│   ├── project/          # Project management pages
│   ├── settings/         # User settings pages
│   └── notfound/         # 404 error page
├── router/               # Routing configuration
│   └── index.tsx         # Main router setup
├── types/                # TypeScript type definitions
│   ├── auth.ts           # Authentication types
│   ├── user.ts           # User types
│   ├── team.ts           # Team types
│   ├── project.ts        # Project types
│   ├── api.ts            # API response types
│   └── index.ts          # Type exports
├── utils/                # Utility functions
│   ├── env.ts            # Environment variable handling
│   ├── validation.ts     # Form validation utilities
│   ├── constants.ts      # Application constants
│   ├── lazyRoutes.ts     # Route lazy loading utilities
│   └── index.ts          # Utility exports
├── assets/               # Static assets (images, icons, etc.)
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
└── index.css            # Global styles and Tailwind imports
```

## 🎨 Design System

### Components
- **Button**: Primary, secondary, danger, ghost, and outline variants
- **Input**: Text inputs with validation and icon support
- **Select**: Dropdown selects with custom styling
- **TextArea**: Multiline text inputs with validation
- **Modal**: Responsive modals with overlay and animations

### Color Palette
- **Primary**: Blue color scheme for primary actions and branding
- **Gray**: Neutral colors for text, borders, and backgrounds
- **Status**: Red for errors, green for success, yellow for warnings

### Typography
- **Font**: Inter font family for modern, readable text
- **Sizes**: Responsive text sizing with proper line heights
- **Weights**: Regular, medium, semibold, and bold weights

## 🔧 Configuration

### Environment Variables
Create `.env.development` for development and `.env.production` for production:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api

# Application Info
VITE_APP_NAME=Agile Mantis
VITE_APP_VERSION=1.0.0

# Auth0 Configuration (when implemented)
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=your-api-audience
```

### Build Configuration
The application uses Vite for fast builds and development:
- **Development**: Hot module replacement and fast refresh
- **Production**: Optimized bundles with code splitting
- **Assets**: Automatic optimization and compression

## 🧪 Testing

### Running Tests
```bash
# Run tests in watch mode
npm run test

# Run tests once with coverage
npm run test:coverage

# Run tests for CI/CD
npm run test:ci
```

### Testing Structure
- **Unit Tests**: Component and utility function tests
- **Integration Tests**: Context and API integration tests
- **Test Utilities**: Custom render functions and mocks

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

### Build Optimization
- **Code Splitting**: Automatic route-based code splitting
- **Tree Shaking**: Unused code elimination
- **Asset Optimization**: Image and CSS optimization
- **Bundle Analysis**: Use `npm run build` to see bundle sizes

## 🤝 Contributing

1. **Code Style**: Follow the ESLint and Prettier configurations
2. **Commits**: Use conventional commit messages
3. **Testing**: Ensure all tests pass before submitting PRs
4. **Types**: Maintain strict TypeScript typing

### Development Workflow
1. Create a feature branch from `main`
2. Make your changes with proper tests
3. Run linting and tests locally
4. Submit a pull request with a clear description

## 📚 Learn More

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [React Router](https://reactrouter.com/)

## 🐛 Troubleshooting

### Common Issues

**Build fails with TypeScript errors**
- Ensure all imports have proper file extensions
- Check that all types are properly defined
- Run `npm run lint` to identify issues

**Styles not applying correctly**
- Verify Tailwind CSS is properly configured
- Check that PostCSS configuration is correct
- Ensure proper class names are being used

**API calls failing**
- Check environment variables are set correctly
- Verify API base URL configuration
- Check network tab in browser dev tools

### Getting Help
- Check the [Issues](link-to-issues) page for known problems
- Create a new issue with detailed reproduction steps
- Contact the development team for assistance

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
