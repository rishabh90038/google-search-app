import React from 'react';
import PropTypes from 'prop-types';

function getFavicon(url) {
  try {
    const { hostname } = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${hostname}`;
  } catch {
    return '';
  }
}

export default function ResultCard({ title, link, snippet, onCopy }) {
  return (
    <div className="card mb-3 p-3 d-flex flex-row align-items-start gap-3">
      <img src={getFavicon(link)} alt="favicon" width={24} height={24} className="me-2 mt-1" />
      <div className="flex-grow-1">
        <a href={link} target="_blank" rel="noopener noreferrer" className="h5 text-primary text-decoration-underline">{title}</a>
        <p className="text-muted mb-1 mt-2">{snippet}</p>
      </div>
      <button className="btn btn-outline-secondary btn-sm" onClick={() => onCopy(link)} title="Copy link">
        <i className="bi bi-clipboard"></i> Copy
      </button>
    </div>
  );
}

ResultCard.propTypes = {
  title: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  snippet: PropTypes.string.isRequired,
  onCopy: PropTypes.func.isRequired,
}; 