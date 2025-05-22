export const transcribeAudio = async (
  audioBlob: Blob,
  fileName?: string
): Promise<TranscriptionResult> => {
  const formData = new FormData();
  formData.append("audio", audioBlob, fileName || "audio");

  const response = await fetch("/api/transcribe", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};
