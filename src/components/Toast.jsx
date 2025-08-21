// src/components/Toast.jsx
import React, { useEffect } from 'react';
import { FiX, FiCheck, FiAlertCircle, FiInfo } from 'react-icons/fi';

/**
 * Toast Component - Individual toast notification
 */
const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FiCheck className="w-5 h-5" />;
      case 'error':
        return <FiAlertCircle className="w-5 h-5" />;
      case 'info':
        return <FiInfo className="w-5 h-5" />;
      default:
        return <FiCheck className="w-5 h-5" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'info':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-green-500 text-white';
    }
  };

  return (
    <div className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${getColors()} animate-slide-in min-w-[300px]`}>
      {getIcon()}
      <span className="flex-1">{message}</span>
      <button 
        onClick={onClose} 
        className="ml-2 hover:opacity-70 transition-opacity"
        aria-label="Close notification"
      >
        <FiX className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
