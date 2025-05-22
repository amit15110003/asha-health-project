"use client";
import { useState } from "react";
import SOPModal from "./SOAPModal";

interface TranscriptionResultProps {
  transcription: TranscriptionResult;
}

export const TranscriptionResult = ({
  transcription,
}: TranscriptionResultProps) => {
  const [showSoapModal, setShowSoapModal] = useState(false);
  const [soapResponse, setSoapResponse] = useState<ISoapResponse>();
  const [loading, setLoading] = useState(false);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getSpeakerColor = (speakerIndex: number) => {
    const colors = [
      "from-blue-500 to-blue-600",
      "from-purple-500 to-purple-600",
      "from-green-500 to-green-600",
      "from-orange-500 to-orange-600",
      "from-pink-500 to-pink-600",
      "from-teal-500 to-teal-600",
      "from-red-500 to-red-600",
      "from-indigo-500 to-indigo-600",
    ];
    return colors[speakerIndex % colors.length];
  };

  const getBadgeColor = (speakerIndex: number) => {
    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-purple-100 text-purple-800",
      "bg-green-100 text-green-800",
      "bg-orange-100 text-orange-800",
      "bg-pink-100 text-pink-800",
      "bg-teal-100 text-teal-800",
      "bg-red-100 text-red-800",
      "bg-indigo-100 text-indigo-800",
    ];
    return colors[speakerIndex % colors.length];
  };

  const handleGenerateSOP = async () => {
    setShowSoapModal(true);
    setLoading(true);

    const response = await fetch("/api/generate-soap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transcript: transcription?.transcript, // your raw transcript string
      }),
    });

    const data = await response.json();
    setSoapResponse(data.soap || "Failed to generate SOAP");
    setLoading(false);
  };

  return (
    <div className="">
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3 mb-6">
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
              <h3 className="font-semibold text-gray-800">
                Transcription Complete
              </h3>
              <p className="text-gray-600 text-sm">
                Confidence: {(transcription.confidence * 100).toFixed(1)}%
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              handleGenerateSOP();
              setShowSoapModal(true);
            }}
            className="bg-blue-600 text-white font-semibold px-4 py-1.5 rounded-lg shadow hover:bg-blue-700 hover:scale-[1.02] active:scale-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
          >
            Generate SOAP
          </button>
        </div>

        {/* Speaker Segments or Full Transcript */}
        <div className="space-y-4 mb-4">
          {transcription?.speakerSegments &&
          transcription?.speakerSegments.length > 0 ? (
            // Show speaker-segmented transcript
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Conversation Transcript
              </h4>
              {transcription?.speakerSegments.map((segment, index) => {
                const speakerIndex = transcription?.speakers.indexOf(
                  segment.speaker
                );
                return (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-xl p-4 border-l-4 border-gradient-to-b"
                    style={{
                      borderLeftColor:
                        speakerIndex === 0
                          ? "#3B82F6"
                          : speakerIndex === 1
                          ? "#8B5CF6"
                          : speakerIndex === 2
                          ? "#10B981"
                          : speakerIndex === 3
                          ? "#F59E0B"
                          : "#EC4899",
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(
                          speakerIndex
                        )}`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full bg-gradient-to-r ${getSpeakerColor(
                            speakerIndex
                          )} mr-1.5`}
                        />
                        Speaker {segment.speaker + 1}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTime(segment.start)} - {formatTime(segment.end)}
                      </span>
                    </div>
                    <p className="text-gray-800 leading-relaxed text-sm sm:text-base">
                      {segment.text}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            // Fallback to full transcript
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Full Transcript
              </h4>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-800 leading-relaxed text-sm sm:text-base">
                  {transcription.transcript || "No speech detected"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="flex justify-between items-center text-xs text-gray-500 pt-4 border-t border-gray-200">
          <div className="flex space-x-4">
            <span>{transcription.words?.length || 0} words</span>
            {transcription?.speakerCount > 1 && (
              <span>
                {transcription?.speakerSegments?.length || 0} segments
              </span>
            )}
          </div>
          <span>{transcription.metadata.duration.toFixed(1)}s duration</span>
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
