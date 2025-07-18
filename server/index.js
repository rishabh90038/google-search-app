require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const USER = { email: 'test@demo.com', password: 'password123', name: 'Test User' };

console.log('Server starting...');

// Login Route
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (email === USER.email && password === USER.password) {
    const token = jwt.sign({ email: USER.email, name: USER.name }, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token, user: { email: USER.email, name: USER.name } });
  }
  return res.status(401).json({ message: 'Invalid credentials' });
});

// Auth Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Google Search Route
app.post('/api/search', authenticateToken, async (req, res) => {

  const { query } = req.body;
  if (!query) return res.status(400).json({ message: 'Query is required' });
  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    const cx = process.env.GOOGLE_CSE_ID;
    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${apiKey}&cx=${cx}`;
    const response = await axios.get(url);
    const items = response.data.items ? response.data.items.slice(0, 5) : [];
    const results = items.map(item => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet
    }));
    res.json({ results });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching search results', error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
