import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

export default function Toast({ message, type = 'danger', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast align-items-center text-bg-${type} show position-fixed top-0 end-0 m-3`} role="alert" style={{zIndex: 3000, minWidth: 250}}>
      <div className="d-flex">
        <div className="toast-body">{message}</div>
        <button type="button" className="btn-close btn-close-white me-2 m-auto" aria-label="Close" onClick={onClose}></button>
      </div>
    </div>
  );
}

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.string,
  onClose: PropTypes.func.isRequired,
}; 