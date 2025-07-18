# Google Search App

A full-stack web application with JWT authentication and Google Search integration.

## Features
- **Login with JWT authentication** (hardcoded user)
- **Google Search integration** (top 5 results, title + link + snippet)
- **Protected search page** (only accessible after login)
- **Recent searches** (last 3, per user)
- **Responsive UI with Bootstrap**
- **Loading and error handling**
- **Logout and user greeting**

## Tech Stack
- **Frontend:** React.js, Bootstrap
- **Backend:** Node.js, Express.js, JWT
- **API:** Google Custom Search JSON API

## Demo
> _Add your deployed link here_

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/google-search-app.git
cd google-search-app
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` folder:
```
JWT_SECRET=your_jwt_secret
GOOGLE_API_KEY=your_google_api_key
GOOGLE_CSE_ID=your_cse_id
```
Start the backend:
```bash
node index.js
```

### 3. Frontend Setup
```bash
cd ../client
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Login Credentials
- **Email:** `test@demo.com`
- **Password:** `password123`

## Environment Variables
- `JWT_SECRET`: Secret for signing JWT tokens
- `GOOGLE_API_KEY`: Your Google Custom Search API key
- `GOOGLE_CSE_ID`: Your Google Custom Search Engine ID

## Deployment
- **Frontend:** Deploy on Vercel, Netlify, etc.
- **Backend:** Deploy on Render, Heroku, etc.
- Update API URLs in frontend if deploying to production

## Screenshots
> _Add screenshots here_

## License
MIT

---

**Made with ❤️ for a hiring assignment.** 