interface AudioPlayerProps {
  audioUrl: string;
  fileName: string | null;
  transcription: TranscriptionResult | null;
}

export const AudioPlayer = ({
  audioUrl,
  fileName,
  transcription,
}: AudioPlayerProps) => (
  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-6 mb-6">
    <div className="flex items-center space-x-3 mb-4">
      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
        <svg
          className="w-5 h-5 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M9 18V5l12-2v13M9 18l-5 2V7l5-2" />
        </svg>
      </div>
      <div>
        <h3 className="font-semibold text-gray-800">
          {fileName || "Audio Recording"}
        </h3>
        <p className="text-gray-600 text-sm">
          {transcription?.metadata.duration
            ? `Duration: ${transcription.metadata.duration.toFixed(1)}s`
            : "Ready for playback"}
        </p>
      </div>
    </div>
    <audio
      controls
      className="w-full h-10 sm:h-12 bg-white rounded-lg shadow-sm"
    >
      <source src={audioUrl} />
      Your browser does not support the audio element.
    </audio>
  </div>
);
