// src/components/SomeComponentWithErrorBoundary.jsx

import React from 'react';
import SomeComponent from './SomeComponent';
import ErrorBoundary from './ErrorBoundary';

/**
 * Wraps SomeComponent in an ErrorBoundary to catch rendering errors.
 * Exported as default for Fast Refresh compatibility.
 */
export default function SomeComponentWithErrorBoundary(props) {
  return (
    <ErrorBoundary>
      <SomeComponent {...props} />
    </ErrorBoundary>
  );
}
