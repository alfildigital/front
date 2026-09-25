import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ErrorBanner } from './ErrorBanner';

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
}

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[App Error]', error, errorInfo);
  }

  handleRetry = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="mx-auto flex min-h-screen max-w-2xl items-center px-4 py-12">
          <ErrorBanner
            message="No se pudo cargar la información. Verificá la conexión con el servidor e intentá nuevamente."
            onRetry={this.handleRetry}
          />
        </main>
      );
    }

    return this.props.children;
  }
}