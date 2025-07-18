import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import LoginPage from './LoginPage';
import SearchPage from './SearchPage';
import AdminPanel from './AdminPanel';
import AdminLoginPage from './AdminLoginPage';

// Auth context for managing JWT and user info
const AuthContext = createContext();
export function useAuth() {
  return useContext(AuthContext);
}

// Dark mode context
const DarkModeContext = createContext();
export function useDarkMode() {
  return useContext(DarkModeContext);
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const login = (user, token) => {
    setUser(user);
    setToken(token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  };
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function DarkModeProvider({ children }) {
  const [dark, setDark] = useState(() => localStorage.getItem('darkMode') === 'true');
  useEffect(() => {
    localStorage.setItem('darkMode', dark);
    document.body.className = dark ? 'bg-dark text-light' : '';
  }, [dark]);
  return (
    <DarkModeContext.Provider value={{ dark, setDark }}>
      {children}
    </DarkModeContext.Provider>
  );
}

function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const adminToken = localStorage.getItem('admin_jwt');
  return adminToken ? children : <Navigate to="/admin-login" />;
}

function PageTitleUpdater() {
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === '/login') document.title = 'Login | Google Search App';
    else document.title = 'Search | Google Search App';
  }, [location]);
  return null;
}

export default function App() {
  return (
    <Router>
      <DarkModeProvider>
        <AuthProvider>
          <PageTitleUpdater />
          <nav className="navbar navbar-expand navbar-light bg-light px-3 mb-2">
            <a className="navbar-brand" href="/">Google Search App</a>
            <div className="navbar-nav ms-auto d-flex align-items-center">
              <a className="nav-link me-3" href="/admin-login">Admin Login</a>
              <DarkModeToggle />
            </div>
          </nav>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin-login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <SearchPage />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </DarkModeProvider>
    </Router>
  );
}

function DarkModeToggle() {
  const { dark, setDark } = useDarkMode();
  return (
    <button
      className={`btn btn-sm ${dark ? 'btn-light' : 'btn-dark'}`}
      onClick={() => setDark(d => !d)}
      aria-label="Toggle dark mode"
    >
      {dark ? '☀️' : '🌙'}
    </button>
  );
}

function NotFound() {
  return (
    <div className="container text-center mt-5">
      <h1>404</h1>
      <p>Page not found.</p>
      <a href="/" className="btn btn-primary">Go Home</a>
    </div>
  );
}
