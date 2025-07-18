# 🚀 Google Search App - Assignment Submission

## 📋 Project Overview
A full-stack web application that allows users to search Google using the Custom Search API, with user authentication, search history, and admin panel functionality.

## 🌐 Live Demo
- **Frontend**: https://google-search-app-frontend-n1bmqwdqc-rishabhs-projects-705a5dc1.vercel.app
- **Backend**: https://google-search-app-backend.onrender.com

## 🛠️ Tech Stack

### Frontend
- **React.js** - Modern UI framework
- **Bootstrap** - Responsive design and styling
- **React Router** - Client-side routing
- **Context API** - State management
- **Vite** - Build tool and development server

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (MongoDB Atlas)
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **Axios** - HTTP client

### DevOps & Deployment
- **Vercel** - Frontend deployment
- **Render** - Backend deployment
- **MongoDB Atlas** - Cloud database
- **GitHub** - Version control

## ✨ Key Features

### 🔐 Authentication System
- **User Login**: Email/password authentication with JWT
- **Admin Login**: Separate admin authentication system
- **Session Management**: Persistent login state
- **Secure Routes**: Protected routes for authenticated users

### 🔍 Search Functionality
- **Google Custom Search API**: Real-time search results
- **Debounced Search**: Auto-search with 400ms delay
- **Search Toggle**: Option to enable/disable auto-search
- **Pagination**: Load more results functionality
- **Search History**: Track and display user search queries

### 👨‍💼 Admin Panel
- **User Management**: View all registered users
- **Search Analytics**: Monitor user search patterns
- **Secure Access**: Admin-only authentication
- **Data Visualization**: Clean table interface

### 🎨 User Experience
- **Responsive Design**: Works on all devices
- **Toast Notifications**: Real-time feedback
- **Loading States**: Professional loading indicators
- **Error Handling**: Graceful error management
- **Dark Mode Toggle**: Theme customization

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Google Custom Search API credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rishabh90038/google-search-app.git
   cd google-search-app
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   cd client
   npm install
   
   # Backend
   cd ../server
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Backend (.env)
   NODE_ENV=development
   PORT=5000
   JWT_SECRET=your_jwt_secret
   GOOGLE_API_KEY=your_google_api_key
   GOOGLE_CSE_ID=your_google_cse_id
   MONGODB_URI=your_mongodb_uri
   
   # Frontend (.env)
   REACT_APP_API_URL=http://localhost:5000
   ```

4. **Run the application**
   ```bash
   # Backend
   cd server
   npm run dev
   
   # Frontend (new terminal)
   cd client
   npm run dev
   ```

## 🔑 Demo Credentials

### Regular User
- **Email**: test@demo.com
- **Password**: password123

### Admin User
- **Email**: admin@google-search.com
- **Password**: admin123

## 📁 Project Structure

```
google-search-app/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── App.jsx        # Main application component
│   │   ├── LoginPage.jsx  # User login page
│   │   ├── SearchPage.jsx # Main search interface
│   │   ├── AdminPanel.jsx # Admin dashboard
│   │   └── config.js      # Configuration
│   ├── package.json
│   └── vercel.json        # Vercel deployment config
├── server/                # Backend Node.js application
│   ├── middleware/        # Express middleware
│   ├── tests/            # Unit and integration tests
│   ├── index.js          # Main server file
│   ├── package.json
│   └── Procfile          # Render deployment config
├── README.md             # Project documentation
└── DEPLOYMENT.md         # Deployment guide
```

## 🧪 Testing

### Backend Tests
```bash
cd server
npm test
npm run test:coverage
```

### Frontend Tests
```bash
cd client
npm test
```

## 🚀 Deployment

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Set build directory to `client`
3. Configure environment variables
4. Deploy automatically on push

### Backend (Render)
1. Connect GitHub repository to Render
2. Set build command and start command
3. Configure environment variables
4. Deploy automatically on push

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: API request throttling
- **CORS Protection**: Cross-origin request security
- **Input Validation**: Server-side validation
- **Helmet.js**: Security headers
- **Environment Variables**: Secure configuration

## 📊 Performance Optimizations

- **Debounced Search**: Reduces API calls
- **Abort Controller**: Cancels pending requests
- **Pagination**: Efficient data loading
- **Caching**: Browser caching strategies
- **Code Splitting**: Optimized bundle sizes

## 🎯 Key Implementation Highlights

1. **Professional Architecture**: Modular, scalable code structure
2. **Production Ready**: Deployed and tested in production environment
3. **User Experience**: Intuitive interface with real-time feedback
4. **Security**: Industry-standard authentication and authorization
5. **Testing**: Comprehensive test coverage
6. **Documentation**: Complete setup and deployment guides

## 📞 Contact

- **GitHub**: https://github.com/rishabh90038/google-search-app
- **Email**: coordinationsphere779@gmail.com

---

**Note**: This application demonstrates full-stack development skills including frontend, backend, database design, authentication, deployment, and testing. It's production-ready and showcases modern web development best practices. 