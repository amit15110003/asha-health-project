import React from "react";

interface FileUploadAreaProps {
  isDragOver: boolean;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  onClick: () => void;
}

export const FileUploadArea = ({
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onClick,
}: FileUploadAreaProps) => (
  <div
    className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 cursor-pointer ${
      isDragOver
        ? "border-blue-400 bg-blue-50"
        : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
    }`}
    onDragOver={onDragOver}
    onDragLeave={onDragLeave}
    onDrop={onDrop}
    onClick={onClick}
  >
    <div className="flex flex-col items-center space-y-3">
      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
      </div>
      <div>
        <p className="text-gray-700 font-medium">
          {isDragOver ? "Drop your audio file here" : "Upload Audio File"}
        </p>
        <p className="text-gray-500 text-sm mt-1">
          Drag & drop or click to browse
        </p>
        <p className="text-gray-400 text-xs mt-2">
          Supports WAV, MP3, MP4, M4A, WebM, OGG, FLAC, AAC (Max 50MB)
        </p>
      </div>
    </div>
  </div>
);
