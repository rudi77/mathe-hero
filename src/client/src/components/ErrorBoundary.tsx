import { cn } from "@/lib/utils";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen p-8 bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
          <div className="flex flex-col items-center w-full max-w-lg p-8 bg-white rounded-3xl shadow-2xl">
            {/* Friendly "Oops" emoji instead of warning icon */}
            <div className="text-8xl mb-6">😮</div>

            <h1 className="text-3xl font-bold text-purple-600 mb-4">
              Ups! Da ist was schiefgelaufen!
            </h1>

            <p className="text-lg text-gray-700 text-center mb-8 leading-relaxed">
              Keine Sorge! Das passiert manchmal.<br />
              Versuch einfach nochmal, dann klappt's bestimmt! 🌟
            </p>

            <button
              onClick={() => window.location.reload()}
              className={cn(
                "flex items-center gap-3 px-8 py-4 rounded-2xl text-lg font-bold",
                "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
                "hover:from-purple-600 hover:to-pink-600",
                "shadow-lg hover:shadow-xl transform hover:scale-105",
                "transition-all duration-200 cursor-pointer"
              )}
            >
              <RotateCcw size={24} />
              Nochmal versuchen
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
