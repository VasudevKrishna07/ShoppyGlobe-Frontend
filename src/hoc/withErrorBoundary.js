// src/hoc/withErrorBoundary.js
import React from 'react';
import ErrorBoundary from '../components/ErrorBoundary';

function withErrorBoundary(WrappedComponent) {
  function ComponentWithBoundary(props) {
    return (
      <ErrorBoundary>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  }
  ComponentWithBoundary.displayName = `withErrorBoundary(${WrappedComponent.name})`;
  return ComponentWithBoundary;
}

export default withErrorBoundary;
