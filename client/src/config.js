// Configuration for different environments
const config = {
  development: {
    API_BASE_URL: 'http://localhost:5000'
  },
  production: {
    API_BASE_URL: process.env.REACT_APP_API_URL || 'https://your-backend-url.onrender.com'
  }
};

// Get current environment
const environment = process.env.NODE_ENV || 'development';

// Export the appropriate config
export const API_BASE_URL = config[environment].API_BASE_URL; 