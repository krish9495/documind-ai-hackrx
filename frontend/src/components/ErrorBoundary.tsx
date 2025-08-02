import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "20px",
            background: "#ff6b6b",
            color: "white",
            fontFamily: "monospace",
            whiteSpace: "pre-wrap",
          }}
        >
          <h2>🚨 Something went wrong!</h2>
          <details>
            <summary>Error Details</summary>
            <p>
              <strong>Error:</strong> {this.state.error?.message}
            </p>
            <p>
              <strong>Stack:</strong> {this.state.error?.stack}
            </p>
          </details>
          <p>Check the browser console for more details.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
