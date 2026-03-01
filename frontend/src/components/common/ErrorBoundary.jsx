import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, info: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        console.error('App Error Boundary caught:', error, info);
        this.setState({ info });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    padding: '40px',
                    fontFamily: 'monospace',
                    background: '#fff1f2',
                    border: '2px solid #ef4444',
                    margin: '20px',
                    borderRadius: '8px'
                }}>
                    <h2 style={{ color: '#ef4444' }}>🚨 Application Error</h2>
                    <p><strong>Error:</strong> {this.state.error?.message}</p>
                    <details>
                        <summary>Stack trace</summary>
                        <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                            {this.state.error?.stack}
                        </pre>
                        <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                            {this.state.info?.componentStack}
                        </pre>
                    </details>
                    <button
                        style={{ marginTop: '20px', padding: '8px 16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        onClick={() => this.setState({ hasError: false, error: null, info: null })}
                    >
                        Try Again
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
