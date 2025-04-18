import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';

interface FallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const FallbackUI = ({ error, resetErrorBoundary }: FallbackProps) => (
  <div style={{ padding: 20, border: '2px solid red', color: 'red' }}>
    <h2>Something went wrong.</h2>
    <p>{error.message}</p>
    <button onClick={resetErrorBoundary}>Try Again</button>
  </div>
);

function withErrorBoundary<P>(
  WrappedComponent: React.ComponentType<P>,
  options: { FallbackComponent: React.ComponentType<FallbackProps> }
) {
  return function ErrorBoundaryWrapper(props: P) {
    const [key, setKey] = useState(0);

    return (
      <ErrorBoundary
        key={key}
        FallbackComponent={options.FallbackComponent}
        onReset={() => setKey(prev => prev + 1)}
      >
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
}

const BuggyComponent: React.FC = () => {
  throw new Error('This component crashed.');
};

const SafeComponent = withErrorBoundary(BuggyComponent, {
  FallbackComponent: FallbackUI,
});

const App: React.FC = () => (
  <div style={{ fontFamily: 'Arial, sans-serif' }}>
    <h1>React Functional HOC: withErrorBoundary</h1>
    <SafeComponent />
  </div>
);

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
