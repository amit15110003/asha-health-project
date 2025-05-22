export const LoadingState = () => (
  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-blue-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
      </div>
      <div className="text-center">
        <p className="text-blue-800 font-medium">Transcribing Audio</p>
        <p className="text-blue-600 text-sm">Please wait...</p>
      </div>
    </div>
  </div>
);
