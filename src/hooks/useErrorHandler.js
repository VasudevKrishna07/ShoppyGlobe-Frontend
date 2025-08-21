// src/hooks/useErrorHandler.js
import { useState, useEffect } from 'react';

function useErrorHandler() {
  const [error, setError] = useState(null);
  useEffect(() => {
    if (error) throw error;
  }, [error]);
  return setError;
}

export default useErrorHandler;
