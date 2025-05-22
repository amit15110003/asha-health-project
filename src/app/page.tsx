"use client";
import { AudioPlayer } from "@/components/AudioPlayer";
import { ErrorMessage } from "@/components/ErrorMessage";
import { FileUploadArea } from "@/components/FileUploadArea";
import { LoadingState } from "@/components/LoadingState";
import { RecordButton } from "@/components/RecordButton";
import { RecordingStatus } from "@/components/RecordingStatus";
import SOPModal from "@/components/SOAPModal";
import { TranscriptionResult } from "@/components/TranscriptionResult";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useState } from "react";

const AudioRecorder = () => {
  const [showSoapModal, setShowSoapModal] = useState(false);
  const [soapResponse, setSoapResponse] = useState<ISoapResponse>();
  const [loading, setLoading] = useState(false);

  const { state, actions } = useAudioRecorder();
  const {
    fileInputRef,
    handleFileInputChange,
    handleDrop,
    triggerFileInput,
    clearFileInput,
  } = useFileUpload({
    onFileUpload: actions.processUploadedFile,
    onError: actions.setError,
  });

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    actions.setDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    actions.setDragOver(false);
  };

  const handleDropWithState = (
    event: React.DragEvent<HTMLDivElement>
  ): void => {
    actions.setDragOver(false);
    handleDrop(event);
  };

  const handleClearAll = (): void => {
    actions.clearAll();
    clearFileInput();
  };

  const toggleRecording = (): void => {
    if (state.isRecording) {
      actions.stopRecording();
    } else {
      actions.startRecording();
    }
  };

  const handleGenerateSOP = async () => {
    setShowSoapModal(true);
    setLoading(true);

    const response = await fetch("/api/generate-soap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transcript: state.transcription?.transcript,
      }),
    });

    const data = await response.json();
    setSoapResponse(data.soap || "Failed to generate SOAP");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen">
        {/* Left Panel - Recording & Upload */}
        <div className="w-1/2 p-6 flex flex-col">
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-lg">
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                      <path d="M19 10v1a7 7 0 0 1-14 0v-1a1 1 0 0 1 2 0v1a5 5 0 0 0 10 0v-1a1 1 0 1 1 2 0Z" />
                      <path d="M12 18v4m-4 0h8" />
                    </svg>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    AI Medical Scribe
                  </h1>
                  <p className="text-gray-600">
                    Record or upload audio files for AI transcription
                  </p>
                </div>

                {/* Error Message */}
                {state.error && (
                  <ErrorMessage
                    error={state.error}
                    onRetry={actions.retryTranscription}
                  />
                )}

                {/* Recording Status */}
                {state.isRecording && <RecordingStatus />}

                {/* Control Buttons */}
                <div className="flex justify-center items-center space-x-4 mb-8">
                  <RecordButton
                    isRecording={state.isRecording}
                    loading={state.loading}
                    onToggleRecording={toggleRecording}
                  />

                  {(state.audioUrl || state.transcription) && (
                    <button
                      onClick={handleClearAll}
                      className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors duration-200 flex items-center justify-center"
                    >
                      <svg
                        className="w-5 h-5 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Action Text */}
                <div className="text-center mb-6">
                  <p className="text-gray-600">
                    {state.isRecording
                      ? "Tap to stop recording"
                      : state.loading
                      ? "Transcribing your audio..."
                      : "Tap to start recording or upload an audio file"}
                  </p>
                </div>

                {/* File Upload Section */}
                {!state.isRecording && !state.loading && (
                  <>
                    <div className="text-center mb-4">
                      <span className="text-gray-400 text-sm">OR</span>
                    </div>

                    <FileUploadArea
                      isDragOver={state.isDragOver}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDropWithState}
                      onClick={triggerFileInput}
                    />

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="audio/*,.wav,.mp3,.mp4,.m4a,.webm,.ogg,.flac,.aac"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                  </>
                )}

                {/* Loading State */}
                {state.loading && <LoadingState />}

                {/* Audio Preview */}
                {state.audioUrl && !state.loading && (
                  <AudioPlayer
                    audioUrl={state.audioUrl}
                    fileName={state.audioFileName}
                    transcription={state.transcription}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Transcription Results */}
        <div className="w-1/2 bg-white/60 backdrop-blur-sm border-l border-white/20">
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200/50 flex flex-row justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Transcription Results
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {state.transcription
                      ? `Confidence: ${(
                          state.transcription.confidence * 100
                        ).toFixed(1)}%`
                      : "Waiting for audio input..."}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  handleGenerateSOP();
                  setShowSoapModal(true);
                }}
                className="bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-lg shadow hover:bg-blue-700 hover:scale-[1.02] active:scale-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
              >
                Generate SOAP
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {state.transcription ? (
                <div className="space-y-6">
                  {/* Transcript with Speaker Segments */}
                  <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-6">
                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-800 mb-2">
                        {state.transcription.speakerSegments?.length > 0
                          ? "Conversation Transcript"
                          : "Transcript"}
                      </h3>
                      <div className="h-px bg-gradient-to-r from-blue-500/20 to-purple-600/20"></div>
                    </div>

                    {state.transcription.speakerSegments?.length > 0 ? (
                      // Speaker-segmented transcript
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {state.transcription.speakerSegments.map(
                          (segment, index) => {
                            const speakerIndex =
                              state?.transcription?.speakers?.indexOf(
                                segment.speaker
                              ) || 0;
                            const colors = [
                              {
                                gradient: "from-blue-500 to-blue-600",
                                badge: "bg-blue-100 text-blue-800",
                                border: "#3B82F6",
                              },
                              {
                                gradient: "from-purple-500 to-purple-600",
                                badge: "bg-purple-100 text-purple-800",
                                border: "#8B5CF6",
                              },
                              {
                                gradient: "from-green-500 to-green-600",
                                badge: "bg-green-100 text-green-800",
                                border: "#10B981",
                              },
                              {
                                gradient: "from-orange-500 to-orange-600",
                                badge: "bg-orange-100 text-orange-800",
                                border: "#F59E0B",
                              },
                              {
                                gradient: "from-pink-500 to-pink-600",
                                badge: "bg-pink-100 text-pink-800",
                                border: "#EC4899",
                              },
                              {
                                gradient: "from-teal-500 to-teal-600",
                                badge: "bg-teal-100 text-teal-800",
                                border: "#14B8A6",
                              },
                              {
                                gradient: "from-red-500 to-red-600",
                                badge: "bg-red-100 text-red-800",
                                border: "#EF4444",
                              },
                              {
                                gradient: "from-indigo-500 to-indigo-600",
                                badge: "bg-indigo-100 text-indigo-800",
                                border: "#6366F1",
                              },
                            ];
                            const colorScheme =
                              colors[speakerIndex % colors.length];

                            const formatTime = (seconds: number) => {
                              const minutes = Math.floor(seconds / 60);
                              const remainingSeconds = Math.floor(seconds % 60);
                              return `${minutes}:${remainingSeconds
                                .toString()
                                .padStart(2, "0")}`;
                            };

                            return (
                              <div
                                key={index}
                                className="bg-gray-50 rounded-xl p-4 border-l-4"
                                style={{ borderLeftColor: colorScheme.border }}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorScheme.badge}`}
                                  >
                                    <div
                                      className={`w-2 h-2 rounded-full bg-gradient-to-r ${colorScheme.gradient} mr-1.5`}
                                    />
                                    Speaker {segment.speaker + 1}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {formatTime(segment.start)} -{" "}
                                    {formatTime(segment.end)}
                                  </span>
                                </div>
                                <p className="text-gray-800 leading-relaxed text-sm">
                                  {segment.text}
                                </p>
                              </div>
                            );
                          }
                        )}
                      </div>
                    ) : (
                      // Regular transcript
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                          {state.transcription.transcript ||
                            "No speech detected"}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Metadata */}
                  <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-6">
                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-800 mb-2">
                        Details
                      </h3>
                      <div className="h-px bg-gradient-to-r from-blue-500/20 to-purple-600/20"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <span className="text-gray-600">Words</span>
                        <p className="font-semibold text-gray-800">
                          {state.transcription.words?.length || 0}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <span className="text-gray-600">Duration</span>
                        <p className="font-semibold text-gray-800">
                          {state.transcription.metadata.duration.toFixed(1)}s
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <span className="text-gray-600">Confidence</span>
                        <p className="font-semibold text-gray-800">
                          {(state.transcription.confidence * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <span className="text-gray-600">
                          {state.transcription.speakerCount > 1
                            ? "Speakers"
                            : "Channels"}
                        </span>
                        <p className="font-semibold text-gray-800">
                          {state.transcription.speakerCount > 1
                            ? state.transcription.speakerCount
                            : state.transcription.metadata.channels}
                        </p>
                      </div>
                      {state.transcription.speakerSegments?.length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-3 col-span-2">
                          <span className="text-gray-600">Segments</span>
                          <p className="font-semibold text-gray-800">
                            {state.transcription.speakerSegments.length}{" "}
                            conversation segments
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Word Timeline (if available and no speaker segments) */}
                  {state.transcription.words &&
                    state.transcription.words.length > 0 &&
                    (!state.transcription.speakerSegments ||
                      state.transcription.speakerSegments.length === 0) && (
                      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-6">
                        <div className="mb-4">
                          <h3 className="font-semibold text-gray-800 mb-2">
                            Word Timeline
                          </h3>
                          <div className="h-px bg-gradient-to-r from-blue-500/20 to-purple-600/20"></div>
                        </div>
                        <div className="max-h-64 overflow-y-auto space-y-2">
                          {state.transcription.words.map((word, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-gray-50 rounded-lg p-3 text-sm"
                            >
                              <span className="font-medium text-gray-800">
                                {word.word}
                              </span>
                              <div className="flex space-x-4 text-gray-600">
                                <span>{word.start.toFixed(2)}s</span>
                                <span>→</span>
                                <span>{word.end.toFixed(2)}s</span>
                                <span className="text-blue-600">
                                  {(word.confidence * 100).toFixed(0)}%
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                      No Transcription Yet
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Start recording or upload an audio file to see
                      transcription results here.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen p-4 flex items-center justify-center">
        <div className="w-full max-w-2xl mx-auto space-y-6">
          {/* Main Card */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-6 sm:p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                  <path d="M19 10v1a7 7 0 0 1-14 0v-1a1 1 0 0 1 2 0v1a5 5 0 0 0 10 0v-1a1 1 0 1 1 2 0Z" />
                  <path d="M12 18v4m-4 0h8" />
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                AI Medical Scribe
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Record or upload audio files for AI transcription
              </p>
            </div>

            {/* Error Message */}
            {state.error && (
              <ErrorMessage
                error={state.error}
                onRetry={actions.retryTranscription}
              />
            )}

            {/* Recording Status */}
            {state.isRecording && <RecordingStatus />}

            {/* Control Buttons */}
            <div className="flex justify-center items-center space-x-4 mb-8">
              <RecordButton
                isRecording={state.isRecording}
                loading={state.loading}
                onToggleRecording={toggleRecording}
              />

              {(state.audioUrl || state.transcription) && (
                <button
                  onClick={handleClearAll}
                  className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors duration-200 flex items-center justify-center"
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Action Text */}
            <div className="text-center mb-6">
              <p className="text-gray-600 text-sm sm:text-base">
                {state.isRecording
                  ? "Tap to stop recording"
                  : state.loading
                  ? "Transcribing your audio..."
                  : "Tap to start recording or upload an audio file"}
              </p>
            </div>

            {/* File Upload Section */}
            {!state.isRecording && !state.loading && (
              <>
                <div className="text-center mb-4">
                  <span className="text-gray-400 text-sm">OR</span>
                </div>

                <FileUploadArea
                  isDragOver={state.isDragOver}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDropWithState}
                  onClick={triggerFileInput}
                />

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*,.wav,.mp3,.mp4,.m4a,.webm,.ogg,.flac,.aac"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </>
            )}

            {/* Loading State */}
            {state.loading && <LoadingState />}

            {/* Audio Preview */}
            {state.audioUrl && !state.loading && (
              <AudioPlayer
                audioUrl={state.audioUrl}
                fileName={state.audioFileName}
                transcription={state.transcription}
              />
            )}
          </div>

          {/* Transcription Results */}
          {state.transcription && (
            <TranscriptionResult transcription={state.transcription} />
          )}
        </div>
      </div>

      {showSoapModal && (
        <SOPModal
          loading={loading}
          setShowSoapModal={setShowSoapModal}
          soapResponse={soapResponse}
        />
      )}
    </div>
  );
};

export default AudioRecorder;
