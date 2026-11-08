import React from "react";
import { RotateCcw, Sparkles } from "lucide-react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-pink-100 dark:bg-pink-950/60 flex items-center justify-center text-3xl mb-4 shadow-sm animate-bounce">
            💖
          </div>
          <h2 className="font-display font-bold text-2xl text-slate-800 dark:text-white mb-2">
            Oops! Recovering Nikki's Magic...
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-sm mb-6">
            Something needed a quick refresh! Click below to continue Nikki's birthday celebration.
          </p>
          <button
            onClick={this.handleReset}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-pink-500 to-purple-600 shadow-glow-pink hover:scale-105 active:scale-95 transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reload & Continue Surprise</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
