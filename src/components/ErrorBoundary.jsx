// src/components/ErrorBoundary.jsx

import React from 'react';
import { FiRefreshCw, FiHome, FiAlertTriangle } from 'react-icons/fi';

/**
 * ErrorBoundary Component - Catches JavaScript errors in component tree
 * Displays fallback UI instead of crashing the entire application
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      errorInfo: null,
      errorId: null
    };
  }

  /**
   * Static method to update state when error occurs
   */
  static getDerivedStateFromError() {
    return { 
      hasError: true,
      errorId: Date.now()
    };
  }

  /**
   * Lifecycle method called when error is caught
   */
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      errorInfo
    });

    // Report error to monitoring service in production
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
      // Example: Your error reporting service
      console.error('Production error:', { error, errorInfo });
    }
  }

  /**
   * Reset error boundary state
   */
  handleReset = () => {
    this.setState({ 
      hasError: false, 
      errorInfo: null,
      errorId: null 
    });
  };

  /**
   * Reload the entire page
   */
  handleReload = () => {
    window.location.reload();
  };

  /**
   * Navigate to home page
   */
  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const isDevelopment = typeof window !== 'undefined' && 
        (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            
            {/* Error Icon */}
            <div className="mb-8">
              <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <FiAlertTriangle className="w-10 h-10 text-red-600" />
              </div>
            </div>

            {/* Error Message */}
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Oops! Something went wrong
            </h1>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              We're sorry, but something unexpected happened. 
              Our team has been notified and is working on a fix.
            </p>

            {/* Error ID for support */}
            {this.state.errorId && (
              <div className="mb-6 p-3 bg-gray-100 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Error ID for support:</p>
                <code className="text-sm font-mono text-gray-700">
                  {this.state.errorId}
                </code>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                <FiRefreshCw className="w-4 h-4" />
                Try Again
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 border border-purple-300 text-purple-600 font-medium rounded-lg hover:bg-purple-50 transition-colors"
              >
                <FiHome className="w-4 h-4" />
                Go to Homepage
              </button>

              <button
                onClick={this.handleReload}
                className="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Reload Page
              </button>
            </div>

            {/* Development Error Details */}
            {isDevelopment && this.state.errorInfo && (
              <details className="mt-8 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 mb-2">
                  🔧 Debug Information (Development Only)
                </summary>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-xs">
                  <div>
                    <strong className="text-red-800">Component Stack:</strong>
                    <pre className="mt-1 text-red-700 whitespace-pre-wrap break-words text-xs">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                </div>
              </details>
            )}

            {/* Contact Support */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                If this problem persists, please{' '}
                <a href="mailto:support@shoppyglobe.com" className="text-purple-600 hover:underline">
                  contact our support team
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
