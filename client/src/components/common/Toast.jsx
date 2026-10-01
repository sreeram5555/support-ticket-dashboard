import { useState, useEffect } from 'react';
import './Toast.css';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`toast toast-${type} ${visible ? 'toast-visible' : 'toast-hidden'}`}>
      <div className="toast-content">
        {type === 'success' && <span className="toast-icon">✓</span>}
        <p>{message}</p>
      </div>
      <button className="toast-close" onClick={() => {
        setVisible(false);
        setTimeout(onClose, 300);
      }}>
        &times;
      </button>
    </div>
  );
};

export default Toast;
