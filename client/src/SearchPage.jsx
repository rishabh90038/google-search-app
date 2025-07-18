import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from './App';
import ResultCard from './components/ResultCard';
import Loader from './components/Loader';
import Toast from './components/Toast';
import { API_BASE_URL } from './config';

function getInitials(name, email) {
  if (name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }
  return email ? email[0].toUpperCase() : '?';
}

export default function SearchPage() {
  const { user, token, logout } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const debounceRef = useRef();
  const abortControllerRef = useRef();

  // Fetch search history from backend after login
  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setHistory(data.history || []);
      } catch {}
    }
    fetchHistory();
  }, [token]);

  // Debounced search effect
  useEffect(() => {
    if (!query.trim()) return;
    if (page !== 1) return; // Only debounce for first page
    setLoading(true);
    setError('');
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (abortControllerRef.current) abortControllerRef.current.abort();
    debounceRef.current = setTimeout(() => {
      handleSearch(null, 1, true);
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
    // eslint-disable-next-line
  }, [query]);

  const handleSearch = async (e, nextPage = 1, fromDebounce = false) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    if (loading && !fromDebounce) return; // Prevent duplicate calls
    setLoading(true);
    setError('');
    if (nextPage === 1) setResults([]);
    try {
      abortControllerRef.current = new AbortController();
              const res = await fetch(`${API_BASE_URL}/api/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query, start: (nextPage - 1) * 5 + 1 }),
        signal: abortControllerRef.current.signal,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Search failed');
      setResults(nextPage === 1 ? data.results : [...results, ...data.results]);
      setPage(nextPage);
      setHasMore(data.results.length === 5);
      // Refetch history after a new search
      if (nextPage === 1) fetchHistoryBackend();
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError(err.message);
      setToast({ message: err.message, type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  // Fetch history helper
  const fetchHistoryBackend = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setHistory(data.history || []);
    } catch {}
  };

  const handleCopy = (link) => {
    navigator.clipboard.writeText(link);
    setToast({ message: 'Link copied!', type: 'success' });
  };

  const handleClearHistory = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/history`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setHistory([]);
        setToast({ message: 'Search history cleared', type: 'success' });
      }
    } catch {}
  };

  // Show up to 3 most recent search queries for suggestions
  const recentQueries = Array.from(new Set(history.map(h => h.query))).slice(0, 3);

  return (
    <div className="container py-5">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {loading && <Loader />}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-2">
          <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{width: 40, height: 40, fontWeight: 'bold', fontSize: 18}}>
            {getInitials(user?.name, user?.email)}
          </div>
          <div className="fw-semibold fs-5 ms-2">Hi, {user?.name || user?.email}!</div>
        </div>
        <button onClick={logout} className="btn btn-outline-danger btn-sm">Logout</button>
      </div>
      <div className="card shadow p-4 mb-4">
        <form onSubmit={e => handleSearch(e, 1)} className="row g-2 align-items-center">
          <div className="col-md-10 position-relative">
            <input
              type="text"
              className="form-control"
              placeholder="Search Google..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              required
              aria-label="Search Google"
              autoFocus
            />
            {/* Auto-suggestion dropdown */}
            {query && recentQueries.length > 0 && (
              <ul className="list-group position-absolute w-100" style={{zIndex: 10, top: '100%'}}>
                {recentQueries.filter(q => q.toLowerCase().includes(query.toLowerCase()) && q !== query).map((q, i) => (
                  <li
                    key={i}
                    className="list-group-item list-group-item-action"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setQuery(q)}
                  >{q}</li>
                ))}
              </ul>
            )}
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>
        {recentQueries.length > 0 && (
          <div className="mt-3 text-secondary small d-flex align-items-center gap-2">
            <span>Recent:</span>
            {recentQueries.map((q, i) => (
              <button
                key={i}
                className="btn btn-link btn-sm p-0 me-2"
                style={{ textDecoration: 'underline' }}
                onClick={() => setQuery(q)}
                tabIndex={0}
                aria-label={`Recent search: ${q}`}
              >{q}</button>
            ))}
            <button className="btn btn-outline-secondary btn-sm ms-2" onClick={handleClearHistory}>Clear</button>
          </div>
        )}
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </div>
      <div>
        {results.map((r, i) => (
          <ResultCard key={i} title={r.title} link={r.link} snippet={r.snippet} onCopy={handleCopy} />
        ))}
        {hasMore && !loading && (
          <div className="text-center mt-4">
            <button className="btn btn-outline-primary" onClick={e => handleSearch(e, page + 1)}>Show more</button>
          </div>
        )}
      </div>
    </div>
  );
} 