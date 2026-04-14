import { Component } from "react"
import type { ErrorInfo, ReactNode } from "react"

type Props = {
  children: ReactNode
  /** Custom fallback UI. If omitted, renders the full-page reload screen. */
  fallback?: (error: Error, reset: () => void) => ReactNode
  /** Human-readable label logged alongside the error — helps disambiguate deep boundaries. */
  label?: string
}
type State = { hasError: boolean; error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    const tag = this.props.label ? `[${this.props.label}]` : ""
    console.error(`Uncaught error ${tag}:`, error, info.componentStack)
  }

  reset = () => this.setState({ hasError: false, error: null })

  render() {
    if (!this.state.hasError) return this.props.children

    if (this.props.fallback) {
      return this.props.fallback(this.state.error ?? new Error("Unknown error"), this.reset)
    }

    return (
      <div role="alert" className="flex min-h-screen items-center justify-center p-8">
        <div className="max-w-md space-y-4 text-center">
          <h1 className="text-2xl font-bold text-red-600">Something went wrong</h1>
          <p className="text-sm text-muted-foreground">
            {this.state.error?.message ?? "An unexpected error occurred."}
          </p>
          <button
            className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
            onClick={() => window.location.reload()}
          >
            Reload page
          </button>
        </div>
      </div>
    )
  }
}
