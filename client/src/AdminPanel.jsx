import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from './config';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setError('');
      try {
        const admin_jwt = localStorage.getItem('admin_jwt') || 'adminsecret';
        const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
          headers: { Authorization: `Bearer ${admin_jwt}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch users');
        setUsers(data.users || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  return (
    <div className="container py-5">
      <h2 className="mb-4">Admin Panel: All Users & Search History</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Search History</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={i}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <ul className="mb-0">
                    {u.history.map((h, j) => (
                      <li key={j}>
                        <span className="text-secondary">[{new Date(h.timestamp).toLocaleString()}]</span> {h.query}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <p><b>Note:</b> For demo, set <code>localStorage.setItem('admin_jwt', 'adminsecret')</code> in browser console to access this page.</p>
      </div>
    </div>
  );
} 