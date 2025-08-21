// src/components/AnotherComponent.jsx
import React from 'react';
import useErrorHandler from '../hooks/useErrorHandler';

const AnotherComponent = () => {
  const throwError = useErrorHandler();

  const handleClick = () => {
    // This will trigger the error boundary
    throwError(new Error('Something went wrong!'));
  };

  return (
    <button onClick={handleClick}>
      Trigger Error
    </button>
  );
};

export default AnotherComponent;
