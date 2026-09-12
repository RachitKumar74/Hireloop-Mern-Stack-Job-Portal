import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen grid place-items-center bg-slate-50 px-4">
          <div className="bg-white rounded-2xl p-8 max-w-md text-center shadow-soft border border-slate-100">
            <h1 className="text-xl font-bold text-navy">Something went wrong</h1>
            <p className="mt-2 text-sm text-slate-500">
              {this.state.error?.message || 'Unexpected error'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-5 py-2.5 rounded-xl"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}