import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center p-6 bg-stone-950">
            <div className="max-w-md w-full bg-stone-900 border border-red-500/20 rounded-2xl p-8 text-center space-y-6 shadow-2xl">
              <div className="inline-flex p-4 bg-red-500/10 rounded-full">
                <AlertTriangle className="w-12 h-12 text-red-500" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black uppercase tracking-tighter text-stone-100">
                  System Malfunction
                </h2>
                <p className="text-stone-400 text-sm font-bold">
                  The AgroPulse bridge encountered a fatal error. This could be due to a connection drop or environmental noise.
                </p>
                {this.state.error && (
                  <pre className="mt-4 p-3 bg-black/50 rounded-lg text-[10px] text-red-400 font-mono text-left overflow-auto max-h-32">
                    {this.state.error.message}
                  </pre>
                )}
              </div>
              <button
                onClick={this.handleReset}
                className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black uppercase text-xs tracking-widest rounded-xl transition-all shadow-lg"
              >
                <RefreshCcw className="w-4 h-4" />
                Reboot System
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
