import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Keep details out of the customer's screen; the hosting platform captures server logs.
    if (typeof window !== "undefined") {
      console.error("CVPen UI rendering error:", error, info?.componentStack || "");
    }
  }

  handleReload = () => {
    if (typeof window !== "undefined") window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <main role="alert" className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
          <h1 className="text-2xl font-bold mb-3">Something went wrong</h1>
          <p className="text-gray-600 mb-5">Your current page could not be displayed. Reload the page and try again.</p>
          <button type="button" onClick={this.handleReload} className="px-5 py-3 rounded bg-blue-700 text-white">
            Reload page
          </button>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
