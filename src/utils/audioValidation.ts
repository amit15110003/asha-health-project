export const ALLOWED_AUDIO_TYPES = [
  "audio/wav",
  "audio/mp3",
  "audio/mpeg",
  "audio/mp4",
  "audio/m4a",
  "audio/webm",
  "audio/ogg",
  "audio/flac",
  "audio/aac",
];

export const ALLOWED_EXTENSIONS = /\.(wav|mp3|mp4|m4a|webm|ogg|flac|aac)$/i;
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export const validateAudioFile = (file: File): string | null => {
  if (
    !ALLOWED_AUDIO_TYPES.includes(file.type) &&
    !file.name.match(ALLOWED_EXTENSIONS)
  ) {
    return "Please upload a valid audio file (WAV, MP3, MP4, M4A, WebM, OGG, FLAC, AAC)";
  }

  if (file.size > MAX_FILE_SIZE) {
    return "File size must be less than 50MB";
  }

  return null;
};
