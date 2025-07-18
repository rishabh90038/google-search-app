import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from './config';
import Toast from './components/Toast';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminUser, setAdminUser] = useState(null);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get admin user info
    const adminUserStr = localStorage.getItem('admin_user');
    if (adminUserStr) {
      setAdminUser(JSON.parse(adminUserStr));
    }
  }, []);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setError('');
      try {
        const admin_jwt = localStorage.getItem('admin_jwt');
        if (!admin_jwt) {
          navigate('/admin-login');
          return;
        }
        const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
          headers: { Authorization: `Bearer ${admin_jwt}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch users');
        setUsers(data.users || []);
      } catch (err) {
        setError(err.message);
        if (err.message.includes('Invalid admin token') || err.message.includes('Admin access required')) {
          navigate('/admin-login');
        }
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_jwt');
    localStorage.removeItem('admin_user');
    setToast({ message: 'Admin logged out successfully!', type: 'info' });
    setTimeout(() => navigate('/admin-login'), 1000);
  };

  return (
    <div className="container py-5">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">🔐 Admin Panel</h2>
          <p className="text-muted mb-0">
            Welcome, {adminUser?.name || 'Admin'} ({adminUser?.email})
          </p>
        </div>
        <div className="d-flex gap-2">
          <button onClick={() => navigate('/')} className="btn btn-outline-primary btn-sm">
            ← Back to Search
          </button>
          <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">
            Logout
          </button>
        </div>
      </div>

      {loading && <div className="text-center"><div className="spinner-border" role="status"></div></div>}
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">All Users & Search History</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Search History</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 && !loading ? (
                  <tr>
                    <td colSpan="3" className="text-center text-muted">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((u, i) => (
                    <tr key={i}>
                      <td><strong>{u.name}</strong></td>
                      <td>{u.email}</td>
                      <td>
                        {u.history.length === 0 ? (
                          <span className="text-muted">No searches yet</span>
                        ) : (
                          <ul className="mb-0 list-unstyled">
                            {u.history.map((h, j) => (
                              <li key={j} className="mb-1">
                                <small>
                                  <span className="text-secondary">[{new Date(h.timestamp).toLocaleString()}]</span> {h.query}
                                </small>
                              </li>
                            ))}
                          </ul>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 