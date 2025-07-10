# WooCommerce Store Frontend

React-based frontend for the WooCommerce store application with modern UI components and real-time features.

## 🎉 Features

- **React 18** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast development and build tooling
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components
- **Real-time Search** - Instant product and order search
- **Responsive Design** - Mobile-first approach
- **Dark/Light Mode** - Theme switching capability
- **Loading States** - Skeleton loading components
- **Error Boundaries** - Comprehensive error handling

## ⚙️ Prerequisites

Make sure you have the following installed on your development machine:

- **Node.js** (version 18 or above)
- **pnpm** (recommended package manager)
- **Git** for version control

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/dipeshkumarsah98/woocommerce-store.git
cd WooCommerce-store
```

### 2. Install Dependencies

```bash
cd client
pnpm install
```

### 3. Environment Setup

Create a `.env` file in the client directory:

```bash
cp .env.example .env
```

Configure the environment variables:

```env
VITE_API_BASE_URL=http://localhost:3000
```

### 4. Start Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:5173`

## 📜 Available Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build production-ready code
- `pnpm preview` - Preview production build locally
- `pnpm lint` - Run ESLint for code analysis
- `pnpm lint:fix` - Fix ESLint issues automatically
- `pnpm type-check` - Run TypeScript type checking

## 📂 Project Structure

```
client/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # shadcn/ui components
│   │   └── ...            # Custom components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── pages/             # Page components
│   ├── services/          # API service functions
│   ├── styles/            # Global styles
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Application entry point
├── .eslintrc.js           # ESLint configuration
├── index.html             # HTML template
├── postcss.config.js      # PostCSS configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```

## 🎨 UI Components

### Built-in Components
- **ProductCard** - Product display with image and details
- **OrderCard** - Order information display
- **SearchBar** - Real-time search functionality
- **NavBar** - Navigation with theme toggle
- **Loading Skeletons** - Loading state components

### shadcn/ui Components
- **Button** - Various button styles and states
- **Card** - Content containers
- **Input** - Form input fields
- **Badge** - Status and label indicators
- **Table** - Data display tables
- **Dropdown Menu** - Context menus
- **Navigation Menu** - Navigation components

## 🔧 Development

### Adding New Components

1. Create component file in `src/components/`
2. Export component with proper TypeScript types
3. Add to index file for easy imports

### Styling Guidelines

- Use Tailwind CSS classes for styling
- Follow mobile-first responsive design
- Use CSS variables for theme colors
- Maintain consistent spacing and typography

### State Management

- Use React hooks for local state
- Custom hooks for reusable logic
- Context API for global state (if needed)

## 🧪 Testing

### Running Tests

```bash
pnpm test
```

### Test Structure

- Unit tests for components
- Integration tests for pages
- E2E tests for critical flows

## 📦 Building for Production

### Build Process

```bash
pnpm build
```

### Build Output

- Optimized JavaScript bundles
- Minified CSS
- Static assets
- Service worker (if configured)

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   pnpm dev --port 3001
   ```

2. **TypeScript errors**
   ```bash
   pnpm type-check
   ```

3. **Build failures**
   ```bash
   rm -rf node_modules
   pnpm install
   ```


