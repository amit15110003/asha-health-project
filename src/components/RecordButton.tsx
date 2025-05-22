interface RecordButtonProps {
  isRecording: boolean;
  loading: boolean;
  onToggleRecording: () => void;
}

export const RecordButton = ({
  isRecording,
  loading,
  onToggleRecording,
}: RecordButtonProps) => (
  <button
    onClick={onToggleRecording}
    className={`relative group w-20 h-20 sm:w-24 sm:h-24 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 ${
      isRecording
        ? "bg-gradient-to-r from-red-500 to-red-600 shadow-lg shadow-red-500/30"
        : "bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-500/30"
    }`}
    disabled={loading}
  >
    <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    {isRecording ? (
      <svg
        className="w-8 h-8 sm:w-10 sm:h-10 text-white mx-auto"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <rect x="6" y="4" width="4" height="16" rx="1" />
        <rect x="14" y="4" width="4" height="16" rx="1" />
      </svg>
    ) : (
      <svg
        className="w-8 h-8 sm:w-10 sm:h-10 text-white mx-auto"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        <path d="M19 10v1a7 7 0 0 1-14 0v-1a1 1 0 0 1 2 0v1a5 5 0 0 0 10 0v-1a1 1 0 1 1 2 0Z" />
        <path d="M12 18v4m-4 0h8" />
      </svg>
    )}
  </button>
);
