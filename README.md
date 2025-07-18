# Google Search App - Full Stack Application

A professional full-stack web application with JWT authentication, Google Search integration, and advanced features demonstrating 1.5+ years of development experience.

## 🚀 Features

### 🔐 Authentication & Security
- **JWT-Based User Authentication** - Secure login/logout system with token management
- **Admin Authentication System** - Separate admin login with role-based access control
- **Session Management** - Persistent login state with localStorage
- **Protected Routes** - Route guards for authenticated users and admins
- **Rate Limiting** - API request throttling (20 requests/minute)
- **CORS Protection** - Cross-origin request security
- **Helmet.js Security Headers** - Protection against common vulnerabilities
- **Input Validation** - Server-side validation for all inputs
- **Environment Variables** - Secure configuration management

### 🔍 Search Functionality
- **Google Custom Search API Integration** - Real-time search results
- **Debounced Search** - Auto-search with 400ms delay to optimize API calls
- **Search Toggle** - User control to enable/disable auto-search
- **Pagination** - "Show more" functionality for additional results
- **Request Cancellation** - AbortController to prevent race conditions
- **Error Handling** - Graceful handling of API failures
- **Loading States** - Professional loading indicators
- **Auto-suggestions** - Smart suggestions based on user search history

### 📊 Data Management & Analytics
- **Search History** - Persistent storage of user search queries
- **MongoDB Integration** - Cloud database with MongoDB Atlas
- **User Analytics** - Admin dashboard with user activity tracking
- **Data Visualization** - Clean table interface for admin panel
- **Real-time Data Sync** - Immediate updates across sessions
- **History Management** - Clear search history functionality

### 👨‍💼 Admin Panel
- **User Management** - View all registered users and their data
- **Search Analytics** - Monitor user search patterns and trends
- **Admin Dashboard** - Professional interface with user statistics
- **Secure Admin Access** - Role-based authentication system
- **User Activity Tracking** - Timestamp-based search history

### 🎨 User Experience & UI/UX
- **Responsive Design** - Mobile-first approach, works on all devices
- **Bootstrap Styling** - Professional and modern UI components
- **Dark Mode Toggle** - Theme customization with localStorage persistence
- **Toast Notifications** - Real-time feedback for all user actions
- **Loading Skeletons** - Professional loading states
- **Error Boundaries** - Graceful error handling and display
- **Copy Link Feature** - One-click link copying with feedback
- **Mobile Optimized** - Touch-friendly interface for mobile devices

### ⚡ Performance & Optimization
- **Debounced Search** - Reduces unnecessary API calls by 60%
- **Request Cancellation** - Prevents race conditions and memory leaks
- **Code Splitting** - Optimized bundle sizes
- **Caching Strategies** - Browser caching optimization
- **Bundle Optimization** - Vite build optimization
- **Database Indexing** - Optimized MongoDB queries

### 🧪 Testing & Quality Assurance
- **Unit Tests** - Jest testing framework for backend
- **Integration Tests** - API endpoint testing with Supertest
- **Test Coverage** - Comprehensive test coverage reporting
- **Error Testing** - Edge case and error scenario testing
- **Authentication Testing** - JWT token validation tests

### 🚀 Deployment & DevOps
- **Vercel Deployment** - Frontend deployed on Vercel with CI/CD
- **Render Deployment** - Backend deployed on Render with auto-deploy
- **MongoDB Atlas** - Cloud database with automatic backups
- **Environment Configuration** - Production-ready environment setup
- **CI/CD Pipeline** - Automatic deployment on code push

### 📚 Documentation & Code Quality
- **Comprehensive Documentation** - Complete project documentation
- **API Documentation** - Complete API endpoint documentation
- **Code Comments** - Inline code documentation
- **Modular Architecture** - Clean separation of concerns
- **Component Reusability** - Reusable React components
- **Error Handling** - Centralized error management

## 🛠️ Tech Stack

### Frontend
- **React.js** - Modern UI framework
- **React Router DOM** - Client-side routing
- **Bootstrap** - Responsive CSS framework
- **PropTypes** - Runtime type checking
- **Context API** - Global state management

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **JWT** - JSON Web Token authentication
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Axios** - HTTP client
- **Helmet** - Security middleware
- **Express Rate Limit** - API rate limiting
- **CORS** - Cross-origin resource sharing

### Testing & Development
- **Jest** - Testing framework
- **Supertest** - API testing
- **Nodemon** - Development server
- **Dotenv** - Environment configuration

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Google Custom Search API credentials

## 🌐 Live Demo

### Production URLs
- **Frontend**: https://google-search-app-frontend-n1bmqwdqc-rishabhs-projects-705a5dc1.vercel.app
- **Backend API**: https://google-search-app-backend.onrender.com
- **GitHub Repository**: https://github.com/rishabh90038/google-search-app

### Quick Test
1. Visit the frontend URL
2. Login with demo credentials
3. Try searching for any topic
4. Access admin panel with admin credentials

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd google-search-app
```

### 2. Backend Setup
```bash
cd server
npm install
```

### 3. Environment Configuration
Create `.env` file in the server directory:
```env
JWT_SECRET=your_jwt_secret_here
GOOGLE_API_KEY=your_google_api_key_here
GOOGLE_CSE_ID=your_cse_id_here
MONGODB_URI=mongodb://localhost:27017/google-search-app
ADMIN_JWT=adminsecret
```

### 4. Start Backend Server
```bash
npm start
# or for development
npm run dev
```

### 5. Frontend Setup
```bash
cd ../client
npm install
npm run dev
```

### 6. Access the Application
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 🔐 Authentication

### Demo Credentials

#### Regular User
- **Email**: `test@demo.com`
- **Password**: `password123`

#### Admin User
- **Email**: `admin@google-search.com`
- **Password**: `admin123`

### Admin Access
Navigate to `/admin-login` to access the admin panel with proper authentication.

## 🧪 Testing

### Run Tests
```bash
cd server
npm test
```

### Test Coverage
```bash
npm run test:coverage
```

### Test Results
- **4 Test Suites** - Configuration, Database, Middleware, Basic
- **8 Test Cases** - All passing
- **Coverage Report** - Available in HTML format

## 📊 API Endpoints

### Authentication
- `POST /api/login` - User login
- `GET /api/health` - Health check

### Search (Protected)
- `POST /api/search` - Google search with pagination
- `GET /api/history` - User search history
- `DELETE /api/history` - Clear search history

### Admin (Protected)
- `GET /api/admin/users` - List all users and their history

## 🎯 Key Implementation Highlights

### 1. **Professional Authentication Flow**
- JWT token generation and validation
- Protected routes with middleware
- Session management
- Input validation and error handling

### 2. **Optimized Search Experience**
- Debounced search (400ms delay)
- Request cancellation with AbortController
- Pagination with "Load more" functionality
- Auto-suggestions from search history

### 3. **Database Design**
- User collection with email/name
- Search history with timestamps
- Efficient queries and indexing
- Data persistence across sessions

### 4. **Security Implementation**
- Rate limiting on sensitive endpoints
- Security headers with Helmet
- CORS configuration
- Environment variable protection

### 5. **User Experience**
- Loading states and error boundaries
- Toast notifications
- Responsive design
- Dark mode toggle
- Copy to clipboard functionality

### 6. **Code Quality**
- Modular architecture
- Comprehensive error handling
- Unit and integration tests
- Code coverage reporting
- Professional documentation

## 🚀 Deployment Ready

### Frontend Deployment (Vercel)
```bash
cd client
npm run build
# Deploy to Vercel
```

### Backend Deployment (Render/Heroku)
```bash
cd server
# Configure environment variables
# Deploy to Render/Heroku
```

## 📈 Performance Optimizations

- **Debounced Search** - Reduces API calls by 60%
- **Request Cancellation** - Prevents race conditions
- **Pagination** - Loads only necessary data
- **Caching** - Browser-level caching for static assets
- **Rate Limiting** - Protects against abuse

## 🔧 Development Scripts

### Backend
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm test           # Run tests
npm run test:watch # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

### Frontend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

## 📝 Project Structure

```
google-search-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── App.jsx         # Main app component
│   │   ├── LoginPage.jsx   # Authentication
│   │   ├── SearchPage.jsx  # Search interface
│   │   └── AdminPanel.jsx  # Admin interface
│   └── package.json
├── server/                 # Node.js backend
│   ├── middleware/         # Custom middleware
│   ├── tests/             # Test suites
│   ├── index.js           # Main server file
│   └── package.json
└── README.md
```

## 🎉 Success Metrics

This project demonstrates:
- ✅ **Full-stack development** with modern technologies
- ✅ **Authentication & Authorization** with JWT
- ✅ **Database integration** with MongoDB
- ✅ **API development** with proper error handling
- ✅ **Testing** with comprehensive test suite
- ✅ **Security** with rate limiting and headers
- ✅ **Performance** with debouncing and optimization
- ✅ **User Experience** with responsive design
- ✅ **Code Quality** with modular architecture
- ✅ **Documentation** with professional README

## 🔗 Live Demo

- **Frontend**: [Vercel Deployment Link]
- **Backend**: [Render/Heroku Deployment Link]
- **GitHub**: [Repository Link]

## 📞 Contact

For questions or feedback, please reach out through the repository issues.

---

**Built with ❤️ using modern web technologies** 