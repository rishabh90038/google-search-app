import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from './config';
import Toast from './components/Toast';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setToast(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store admin token
      localStorage.setItem('admin_jwt', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
      
      setToast({ message: `Welcome, ${data.user.name}!`, type: 'success' });
      setTimeout(() => navigate('/admin'), 1000); // Navigate after toast shows
    } catch (err) {
      setError(err.message);
      setToast({ message: err.message, type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container vh-100 d-flex align-items-center justify-content-center bg-light">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="card shadow p-4" style={{ minWidth: 400 }}>
        <div className="text-center mb-4">
          <h2 className="text-primary">🔐 Admin Login</h2>
          <p className="text-muted">Access the admin panel</p>
        </div>
        
        {error && <div className="alert alert-danger text-center">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Admin Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@google-search.com"
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary w-100 mb-3"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login as Admin'}
          </button>
        </form>
        
        <div className="text-center">
          <button 
            onClick={() => navigate('/')} 
            className="btn btn-link text-decoration-none"
          >
            ← Back to Search
          </button>
        </div>
        
        <div className="mt-4 p-3 bg-light rounded">
          <small className="text-muted">
            <strong>Demo Credentials:</strong><br/>
            Email: admin@google-search.com<br/>
            Password: admin123
          </small>
        </div>
      </div>
    </div>
  );
} 