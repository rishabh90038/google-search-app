require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const axios = require('axios');
const mongoose = require('mongoose');
const authenticateToken = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Trust proxy for rate limiting behind Render
app.set('trust proxy', 1);

app.use(helmet());

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.use(cors({
  origin: NODE_ENV === 'production' 
    ? ['https://google-search-app-frontend-n1bmqwdqc-rishabhs-projects-705a5dc1.vercel.app', 'https://your-frontend-domain.vercel.app', 'https://your-frontend-domain.netlify.app']
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const USER = { email: 'test@demo.com', password: 'password123', name: 'Test User' };
const ADMIN = { email: 'rishabh@gmail.com', password: 'admin123', name: 'Admin User' };

// --- MongoDB Setup ---
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/google-search-app';
if (MONGODB_URI !== 'mongodb://localhost:27017/google-search-app') {
  mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.log('MongoDB connection skipped (using local URI)');
}

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
});
const User = mongoose.model('User', userSchema);

const searchHistorySchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  query: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});
const SearchHistory = mongoose.model('SearchHistory', searchHistorySchema);
// --- End MongoDB Setup ---

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // limit each IP to 20 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/login', limiter);
app.use('/api/search', limiter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ message: 'Invalid input type.' });
    }
    if (email !== USER.email || password !== USER.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Upsert user in DB
    await User.findOneAndUpdate(
      { email: USER.email },
      { email: USER.email, name: USER.name },
      { upsert: true, new: true }
    );
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ email: USER.email, name: USER.name }, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token, user: { email: USER.email, name: USER.name } });
  } catch (err) {
    next(err);
  }
});

app.post('/api/search', authenticateToken, async (req, res, next) => {
  try {
    const { query, start } = req.body;
    if (!query || typeof query !== 'string' || !query.trim()) {
      return res.status(400).json({ message: 'Query is required' });
    }
    // Store search history in DB
    await SearchHistory.create({ userEmail: req.user.email, query });
    const apiKey = process.env.GOOGLE_API_KEY;
    const cx = process.env.GOOGLE_CSE_ID;
    const startIndex = Number.isInteger(start) && start > 0 ? start : 1;
    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${apiKey}&cx=${cx}&start=${startIndex}`;
    const response = await axios.get(url);
    const items = response.data.items ? response.data.items.slice(0, 5) : [];
    const results = items.map(item => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet
    }));
    res.json({ results });
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      return res.status(502).json({ message: 'Google API error', error: error.response.data.error.message });
    }
    next(error);
  }
});

// Fetch user search history
app.get('/api/history', authenticateToken, async (req, res, next) => {
  try {
    const history = await SearchHistory.find({ userEmail: req.user.email })
      .sort({ timestamp: -1 })
      .limit(20);
    res.json({ history });
  } catch (err) {
    next(err);
  }
});

// Clear user search history
app.delete('/api/history', authenticateToken, async (req, res, next) => {
  try {
    await SearchHistory.deleteMany({ userEmail: req.user.email });
    res.json({ message: 'Search history cleared' });
  } catch (err) {
    next(err);
  }
});

// --- Admin Login Endpoint ---
app.post('/api/admin/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ message: 'Invalid input type.' });
    }
    if (email !== ADMIN.email || password !== ADMIN.password) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }
    const jwt = require('jsonwebtoken');
    const adminToken = jwt.sign({ email: ADMIN.email, name: ADMIN.name, role: 'admin' }, JWT_SECRET, { expiresIn: '2h' });
    return res.json({ token: adminToken, user: { email: ADMIN.email, name: ADMIN.name, role: 'admin' } });
  } catch (err) {
    next(err);
  }
});

// --- Admin Middleware ---
function adminAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Admin token required' });
  }
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid admin token' });
  }
}

// --- Admin Endpoint: List all users and their search history ---
app.get('/api/admin/users', adminAuth, async (req, res, next) => {
  try {
    const users = await User.find({});
    const histories = await SearchHistory.find({});
    const userMap = {};
    users.forEach(u => {
      userMap[u.email] = { name: u.name, email: u.email, history: [] };
    });
    histories.forEach(h => {
      if (userMap[h.userEmail]) {
        userMap[h.userEmail].history.push({ query: h.query, timestamp: h.timestamp });
      }
    });
    res.json({ users: Object.values(userMap) });
  } catch (err) {
    next(err);
  }
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
