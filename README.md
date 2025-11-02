# Automation Inc. - Frontend

A modern, production-ready workflow automation platform built with Next.js 16, React 19, and TypeScript.

## Features

- 🚀 **Modern Stack**: Next.js 16 with App Router, React 19, TypeScript
- 🎨 **Beautiful UI**: Tailwind CSS 4 with glassmorphism design
- 🔐 **Authentication**: Complete auth flow (login, signup, password management)
- 📊 **Dashboard**: Real-time workflow monitoring and analytics
- 🔄 **Workflow Editor**: Visual workflow builder with React Flow
- 🔑 **Credentials Management**: Secure credential storage for integrations
- 📋 **Templates**: Pre-built workflow templates
- 🔔 **Toast Notifications**: User-friendly feedback system
- 🛡️ **Error Boundaries**: Graceful error handling
- 📱 **Responsive**: Mobile-first design
- ⚡ **Performance**: Optimized for production with code splitting

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running (n8njd)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://n8njd.test/api/v1
NEXT_PUBLIC_APP_NAME=Automation Inc.
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
n8njdfront/
├── app/
│   ├── auth/              # Authentication pages
│   ├── components/        # Reusable components
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main dashboard
├── lib/
│   ├── api.ts            # API client
│   ├── config.ts         # Configuration
│   └── toast.tsx         # Toast notification system
├── public/               # Static assets
└── middleware.ts         # Route protection
```

## Key Features

### Authentication
- Login with email/password
- User registration
- Password change
- Forgot password flow
- Protected routes with middleware

### Dashboard
- Workflow statistics
- Execution history
- Real-time updates
- Quick actions

### Workflow Editor
- Visual workflow builder
- Drag-and-drop nodes
- Node connections
- Real-time preview
- Save/update workflows

### Credentials Management
- Multiple credential types (HTTP, OAuth2, API Key, Database, SMTP, AWS, etc.)
- Secure storage
- Easy management

### Templates
- Pre-built workflow templates
- One-click deployment
- Template marketplace

## Production Build

```bash
npm run build
npm start
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://n8njd.test/api/v1` |
| `NEXT_PUBLIC_APP_NAME` | Application name | `Automation Inc.` |
| `NEXT_PUBLIC_APP_URL` | Frontend URL | `http://localhost:3000` |

## Technologies

- **Framework**: Next.js 16
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Workflow Editor**: React Flow
- **Icons**: Material Symbols
- **Fonts**: Spline Sans

## Performance Optimizations

- Code splitting with dynamic imports
- Image optimization
- Font optimization
- Compression enabled
- React strict mode
- Package import optimization

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

Proprietary - All rights reserved

## Support

For support, email support@automationinc.com
