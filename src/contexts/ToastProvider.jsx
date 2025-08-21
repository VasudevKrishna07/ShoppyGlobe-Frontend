// src/contexts/ToastProvider.jsx

import React, { useState } from 'react';
import ToastContext from './ToastContext';
import Toast from '../components/Toast';

/**
 * ToastProvider - only default export, wraps app and renders toasts
 */
export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const contextValue = { addToast };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
        {toasts.map(({ id, message, type, duration }) => (
          <Toast
            key={id}
            message={message}
            type={type}
            duration={duration}
            onClose={() => removeToast(id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
