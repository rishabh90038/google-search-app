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
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || true }));
app.use(express.json({ limit: '1mb' }));

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const USER = { email: 'test@demo.com', password: 'password123', name: 'Test User' };

// --- MongoDB Setup ---
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/google-search-app';
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

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

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
