export const ErrorMessage = ({ error, onRetry }: ErrorMessageProps) => (
  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
    <div className="flex items-center space-x-3">
      <svg
        className="w-5 h-5 text-red-500"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
      </svg>
      <p className="text-red-700 text-sm">{error}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="ml-auto text-red-600 hover:text-red-800 text-sm font-medium"
        >
          Retry
        </button>
      )}
    </div>
  </div>
);
