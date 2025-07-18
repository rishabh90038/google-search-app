import React, { useState, useEffect } from 'react';
import { useAuth } from './App';

export default function SearchPage() {
  const { user, token, logout } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recent, setRecent] = useState(() => {
    const saved = localStorage.getItem('recent_searches');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('recent_searches', JSON.stringify(recent));
  }, [recent]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setResults([]);
    try {
      const res = await fetch('http://localhost:5000/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Search failed');
      setResults(data.results);
      setRecent(prev => [query, ...prev.filter(q => q !== query)].slice(0, 3));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="fw-semibold fs-5">Hi, {user?.name || user?.email}!</div>
        <button onClick={logout} className="btn btn-outline-danger btn-sm">Logout</button>
      </div>
      <div className="card shadow p-4 mb-4">
        <form onSubmit={handleSearch} className="row g-2 align-items-center">
          <div className="col-md-10">
            <input
              type="text"
              className="form-control"
              placeholder="Search Google..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              required
            />
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>
        {recent.length > 0 && (
          <div className="mt-3 text-secondary small">
            Recent: {recent.map((q, i) => (
              <button
                key={i}
                className="btn btn-link btn-sm p-0 me-2"
                style={{ textDecoration: 'underline' }}
                onClick={() => setQuery(q)}
              >{q}</button>
            ))}
          </div>
        )}
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </div>
      <div>
        {results.map((r, i) => (
          <div key={i} className="card mb-3 p-3">
            <a href={r.link} target="_blank" rel="noopener noreferrer" className="h5 text-primary text-decoration-underline">{r.title}</a>
            <p className="text-muted mb-1 mt-2">{r.snippet}</p>
          </div>
        ))}
        {loading && <div className="text-center text-secondary mt-4">Loading...</div>}
      </div>
    </div>
  );
} 