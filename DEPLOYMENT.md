# 🚀 Production Deployment Guide

This guide will help you deploy your Google Search App to production.

## 📋 Prerequisites

- GitHub account
- Vercel account (free)
- Render/Heroku account (free)
- MongoDB Atlas account (free tier available)

## 🎯 Deployment Strategy

- **Frontend**: Vercel (React/Vite)
- **Backend**: Render or Heroku (Node.js/Express)
- **Database**: MongoDB Atlas (cloud database)

## 🌐 Frontend Deployment (Vercel)

### Step 1: Prepare Frontend
```bash
cd client
# Ensure all API calls use environment variables
# Check config.js is properly configured
```

### Step 2: Deploy to Vercel
1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for production deployment"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Select the `client` folder as root directory

3. **Configure Environment Variables**:
   - In Vercel dashboard, go to Project Settings → Environment Variables
   - Add: `REACT_APP_API_URL` = `https://your-backend-url.onrender.com`

4. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically build and deploy your app

### Step 3: Update CORS in Backend
After getting your Vercel URL, update the backend CORS configuration.

## 🔧 Backend Deployment (Render)

### Step 1: Prepare Backend
```bash
cd server
# Ensure all environment variables are configured
# Check package.json has proper scripts
```

### Step 2: Deploy to Render
1. **Push to GitHub** (if not already done)

2. **Connect to Render**:
   - Go to [render.com](https://render.com)
   - Sign up/Login with GitHub
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

3. **Configure Service**:
   - **Name**: `google-search-app-backend`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

4. **Environment Variables**:
   ```
   NODE_ENV=production
   PORT=10000
   JWT_SECRET=your_secure_jwt_secret_here
   GOOGLE_API_KEY=your_google_api_key_here
   GOOGLE_CSE_ID=your_google_cse_id_here
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/google-search-app
   ADMIN_JWT=your_secure_admin_jwt_here
   ```

5. **Deploy**:
   - Click "Create Web Service"
   - Render will build and deploy your backend

### Step 3: Update Frontend API URL
After getting your Render URL, update the frontend environment variable.

## 🗄️ Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Cluster
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create free account
3. Create new cluster (free tier)
4. Set up database access (username/password)
5. Set up network access (allow all IPs: 0.0.0.0/0)

### Step 2: Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database password
5. Add this to your backend environment variables

## 🔄 Update Configuration

### After Backend Deployment
1. **Update Frontend API URL**:
   - Go to Vercel dashboard
   - Update `REACT_APP_API_URL` with your Render URL
   - Redeploy frontend

2. **Update Backend CORS**:
   - Go to Render dashboard
   - Update environment variables
   - Add your Vercel URL to CORS origins
   - Redeploy backend

## 🧪 Testing Production

### Test Frontend
1. Visit your Vercel URL
2. Test login functionality
3. Test search functionality
4. Test admin panel

### Test Backend
1. Test health endpoint: `https://your-backend-url.onrender.com/api/health`
2. Test login endpoint with Postman/curl
3. Verify database connections

## 🔒 Security Checklist

- [ ] **Environment Variables**: All secrets are in environment variables
- [ ] **CORS**: Properly configured for production domains
- [ ] **Rate Limiting**: Enabled on production
- [ ] **HTTPS**: Both frontend and backend use HTTPS
- [ ] **Database**: MongoDB Atlas with proper authentication
- [ ] **API Keys**: Google API keys have proper restrictions

## 📊 Monitoring

### Vercel Analytics
- Built-in analytics for frontend performance
- Monitor page views and user behavior

### Render Monitoring
- Built-in logs and metrics
- Monitor API response times
- Set up alerts for downtime

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Check CORS configuration in backend
   - Verify frontend URL is in allowed origins

2. **Database Connection**:
   - Check MongoDB Atlas network access
   - Verify connection string format

3. **Environment Variables**:
   - Ensure all variables are set in deployment platform
   - Check variable names match code

4. **Build Failures**:
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json

### Debug Commands
```bash
# Test backend locally with production config
NODE_ENV=production npm start

# Test frontend build
npm run build

# Check environment variables
echo $REACT_APP_API_URL
```

## 📈 Performance Optimization

### Frontend
- Enable Vercel's edge caching
- Optimize bundle size
- Use lazy loading for components

### Backend
- Enable Render's auto-scaling
- Optimize database queries
- Use connection pooling

## 🔗 Final URLs

After deployment, you should have:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.onrender.com`
- **Database**: MongoDB Atlas cluster

## 📝 Update README

Don't forget to update your README.md with:
- Live demo links
- Deployment status
- Updated screenshots

---

**🎉 Congratulations! Your app is now live in production!** 